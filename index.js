System.register("AuthDelegate", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var AuthDelegate;
    return {
        setters: [],
        execute: function () {
            AuthDelegate = class AuthDelegate {
            };
            exports_1("AuthDelegate", AuthDelegate);
        }
    };
});
System.register("Config", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var AuthConfig;
    return {
        setters: [],
        execute: function () {
            AuthConfig = class AuthConfig {
            };
            exports_2("AuthConfig", AuthConfig);
        }
    };
});
System.register("GoogleAuth", ["passport"], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var GoogleStrategy, passport, OAuth;
    return {
        setters: [
            function (passport_1) {
                passport = passport_1;
            }
        ],
        execute: function () {
            GoogleStrategy = require("passport-google-oauth20").Strategy;
            OAuth = class OAuth {
                constructor(app, config, delegate) {
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
                    app.get(config.logoutRoute, (req, res) => {
                        req.logout();
                        res.redirect(config.logoutRedirect);
                    });
                    passport.use("Google", new GoogleStrategy({
                        clientID: config.clientID,
                        clientSecret: config.clientSecret,
                        callbackURL: config.callbackURL
                    }, function (accessToken, refreshToken, profile, done) {
                        console.log("accessing");
                        process.nextTick(function () {
                            console.log("tick");
                            var accessFailed = false;
                            if (config.blacklist) {
                                console.log("checking blacklist");
                                if (config.blacklist.includes(profile.emails[0].value))
                                    accessFailed = true;
                            }
                            if (config.whitelist && config.whitelist.length > 0 && !accessFailed) {
                                console.log("checking whitelist");
                                if (config.whitelist.includes(profile.emails[0].value))
                                    return done(null, profile);
                                else
                                    accessFailed = true;
                            }
                            else {
                                return done(null, profile);
                            }
                            if (accessFailed) {
                                console.log("failure");
                                delegate.accessFailed.then(_ => {
                                    console.log("failed");
                                    done(null, false);
                                });
                            }
                        });
                    }));
                    passport.serializeUser(function (user, done) {
                        delegate.serialize(user).then((user) => {
                            console.log(user);
                            done(null, user.providerId);
                        }).catch((e) => console.log(e));
                    });
                    passport.deserializeUser((id, done) => {
                        console.log("deserializing %s", id);
                        delegate.deserialize(id).then((o) => {
                            done(null, o.providerId);
                        }).catch((err) => {
                            console.log("broke " + err);
                            done(err, null);
                        });
                    });
                }
                isAuthenticated(req, res) {
                    return req.isAuthenticated();
                }
                ;
                ensureAuthenticated(req, res, next) {
                    if (req.isAuthenticated()) {
                        console.log("authenticated!");
                        return next();
                    }
                    else {
                        res.sendStatus(403);
                    }
                }
                ;
            };
            exports_3("OAuth", OAuth);
            ;
        }
    };
});
