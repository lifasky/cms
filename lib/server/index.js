"use strict";

var async = require("async");
var _ = require("lodash");
var path = require("path");
var fs = require("fs");

function getModules(dirname, extend) {
  extend = extend || ".js";
  var files = fs.readdirSync(dirname).filter(function(file) {
    return (file !== ".DS_store" && file.indexOf(".") !== 0);
  });
  var modules = _.reduce(files, function(out, file) {
    out[path.basename(file, extend)] = require(path.join(dirname, file));
    return out;
  }, {});
  return modules;
}

function getRouteData(routes, path) {
  var routeData;
  var result = _.reduce(routes, function(result, n, key) {
    return _.assign(result, n);
  }, {});
  routeData = result[path];
  if (!routeData) {
    return result["*"];
  }
  return routeData;
}

function initControllers(controllers, client) {
  _.forEach(controllers, function(n, key) {
    controllers[key] = new controllers[key](client);
  });
}

function handleRequest(app, client) {
  // init core controllers
  var routes = getModules(path.join(__dirname, "./core/routes"), ".json");
  var controllers = getModules(path.join(__dirname, "./core/controllers"), ".js");
  initControllers(controllers, client);

  // init custom controllers
  var routes_custom = getModules(path.join(__dirname, "./custom/routes"), ".json");
  var controllers_custom = getModules(path.join(__dirname, "./custom/controllers"), ".js");
  initControllers(controllers_custom, client);

  routes = _.assign(routes, routes_custom);
  controllers = _.assign(controllers, controllers_custom);

  require("./auth/passport")(app, client);
  var middleware = require("./middleware")(client);

  var _route;
  var _method;
  var _controller;
  var _middleware;
  var _action;
  var _handleRequest = [];
  _.forEach(routes, function(n) {
    _.forEach(n, function(m) {
      m = m || {};
      _route = m.route;
      _.forEach(m.methods, function(p, key) {
        _method = key;
        _controller = controllers && controllers[p.controller];
        _action = _controller && _controller[p.action];
        _middleware = middleware && middleware[p.middleware];
        if (!_middleware) {
          _middleware = function(req, res, next) {
            next();
          }
        }
        if (typeof _action !== "function") {
          _action = function(req, res, next) {
            next();
          }
        }
        app[_method](_route, _middleware, _action);
      });
    });
  });

  // display all pages
  app.get("*", controllers.page.show);

}

module.exports = handleRequest;
