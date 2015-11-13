"use strict";

var async = require("async");
var _ = require("lodash");
var Mill = require("../mill");

module.exports = function(client, root) {

  var mill = new Mill(client, root);

  function init(req, res, next) {
    req.instance = req.instance || {};
    var path = req.path.split("/").filter(function(a) {
      return a !== ""
    });
    req.instance.path = path;
    next();
  }

  function auth(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  }

  function setUser(req, res, next) {
    req.instance.admin = {};
    var user = req.session.passport.user || {};
    var _json = req.session.passport._json || {};
    req.instance.admin.displayName = user.displayName;
    req.instance.admin.email = user.emails[0].value;
    req.instance.admin.picture = _json.picture;
    console.log("XXX Administrator", req.instance.admin);
    next();
  }

  return {
    "auth": [init, auth, setUser],
  }
}
