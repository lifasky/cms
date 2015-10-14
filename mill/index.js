"use strict";

var async = require("async");
var _ = require("lodash");
var path = require("path");
var util = require("./lib/util");

var routes = util.getModules(path.join(__dirname, "routes"), ".json");
var controllers = util.getModules(path.join(__dirname, "controllers"), ".js");
var middleware = {};

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

function handleMiddleware(middleware, cb) {
  if (_.isArray(middleware)) {
    async.eachSeries(middleware, function(fn, callback) {
      fn(req, res, callback);
    }, function(err) {
      cb(null);
    });
  } else {
    cb(null);
  }
}

function handleRequest(routeConfig, req, res, next) {
  var _controller = controllers[routeConfig.controller];
  var _middleware = middleware[routeConfig.middleware];
  var _action = _controller && _controller[routeConfig.action];
  if (typeof _action === 'function') {
    handleMiddleware(_middleware, function(err) {
      _action.call(_controller, req, res, next);
    });
  } else {
    next();
  }
}

module.exports = function(client) {

  initControllers(controllers, client);

  return function(req, res, next) {
    var path = req.path;
    var method = req.method.toLowerCase();
    var routeData = getRouteData(routes, path);
    var routeConfig = routeData && routeData[method];
    handleRequest(routeConfig, req, res, next)
  };

};
