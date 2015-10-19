"use strict";

/**
 * Configure Google Auth
 */
var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
var config = global.config;
var _ = require("lodash");

module.exports = function(app, client) {

  app.use(passport.initialize());
  app.use(passport.session(), function(req, res, next) { console.log(req.session); next()});

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  passport.use(new GoogleStrategy(config.google.auth,
    function(accessToken, refreshToken, profile, done) {

      var email = profile.emails[0].value;
      if (!email) {
        return done(null, false);
      }
      if (config.google.allowed.indexOf(email) > -1) {
        return done(null, profile);
      }
      client.user.get(email, function(err, data) {
        if (err) {
          done(null, false);
        } else {
          done(null, profile);
        }
      });
      
    }
  ));

  app.get("/auth", passport.authenticate("google"));

  app.get("/auth/google/callback/?",
    passport.authenticate("google", {
      failureRedirect: "/"
    }),
    function(req, res) {
      res.redirect("/");
    });

};
