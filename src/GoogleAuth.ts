"use strict"
var GoogleStrategy = require("passport-google-oauth20").Strategy;
import * as passport from 'passport';
import { AuthConfig } from './Config';
import {Express}from 'express';
import { AuthDelegate } from './AuthDelegate';
export class OAuth {
    app:Express;
    config:AuthConfig;
    delegate:AuthDelegate;
    constructor(app:Express, config:AuthConfig, delegate:AuthDelegate) {
        this.app = app;
        this.config = config;
        this.delegate = delegate;
       
        app.use(passport.initialize());
        app.use(passport.session());
        app.get(config.authRoute, passport.authenticate('google', {
            scope: config.scope
        }));

        app.get(config.authCallback, passport.authenticate('google', {
            successRedirect: config.successRedirect,
            failureRedirect: config.failureRedirect
        }));

        app.get(config.logoutRoute, (req:Express.Request, res:Express.Response & {redirect:(logoutRedirect:string)=>any}) => {
            (<Express.Request & {logout:()=>any}>req).logout();
            res.redirect(config.logoutRedirect);
        });

        passport.use("Google",new GoogleStrategy({
                clientID: config.clientID,
                clientSecret: config.clientSecret,
                callbackURL: config.callbackURL
            },
            function (accessToken:string, refreshToken:string, profile:any, done:(err?:Error,accessFailed?:boolean)=>any) {
                console.log("accessing")
                process.nextTick(function () {
                    console.log("tick")
                    var accessFailed = false
                    if (config.blacklist) {
                        console.log("checking blacklist");
                        if (config.blacklist.includes(profile.emails[0].value)) accessFailed = true
                    }
                    if (config.whitelist && config.whitelist.length > 0 && !accessFailed) {
                        console.log("checking whitelist");
                        if (config.whitelist.includes(profile.emails[0].value)) return done(null, profile);
                        else accessFailed = true
                    }else{
                        return done(null, profile)
                    }
                    if (accessFailed){ console.log("failure"); delegate.accessFailed.then(_ => {
                        console.log("failed");
                        done(null, false)
                    })
                    
                }
                });
            }
        ));

        passport.serializeUser(function (user:any, done:(err?:Error,id?:string)=>any) {
            delegate.serialize(user).then((user:any) => {
               console.log(user);
               done(null, user.providerId)
            }).catch((e:Error) => console.log(e))
        });

        passport.deserializeUser((id:string|number, done:(err?:Error,id?:string)=>any) => {
            console.log("deserializing %s",id);
            delegate.deserialize(id).then((o:any) => {
                done(null, o.providerId)
            }).catch((err:Error) => {
                console.log("broke "+err);
                done(err, null)
            });
        });

    }
    
    isAuthenticated(req:Express.Request & {isAuthenticated:()=>boolean}, res:Express.Response) {
        return req.isAuthenticated();
    };

    ensureAuthenticated(req:Express.Request & {isAuthenticated:()=>boolean}, res:Express.Response & {sendStatus:(code:number)=>any}, next:()=>any) {
        if (req.isAuthenticated()) {
            console.log("authenticated!");
            return next();
        }else{
            res.sendStatus(403);
        }
    };

};