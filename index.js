define("AuthDelegate", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class AuthDelegate {
    }
    exports.AuthDelegate = AuthDelegate;
});
define("Config", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class AuthConfig {
    }
    exports.AuthConfig = AuthConfig;
});
define("GoogleAuth", ["require", "exports", "passport"], function (require, exports, passport) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GoogleStrategy = require("passport-google-oauth20").Strategy;
    class OAuth {
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
    }
    exports.OAuth = OAuth;
    ;
});
