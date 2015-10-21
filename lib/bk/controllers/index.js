"use strict";

var async = require("async");
var _ = require("lodash");
var path = require("path");
var fs = require("fs");

function getModules(dirname, extend) {
  extend = extend || ".js";
  var modules = _.reduce(fs.readdirSync(dirname), function(out, file) {
    if (file !== __filename && file !== "index.js") {
      out[path.basename(file, extend)] = require(path.join(dirname, file));
    }
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

function handleMiddleware(middleware, req, res, cb) {
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

// function handleRequest(req, res, next, routeConfig, controllers, middleware) {
//   var _controller = controllers[routeConfig.controller];
//   var _middleware = middleware[routeConfig.middleware];
//   var _action = _controller && _controller[routeConfig.action];
//   if (typeof _action === "function") {
//     handleMiddleware(_middleware, req, res, function(err) {
//       _action.call(_controller, req, res, next);
//     });
//   } else {
//     next();
//   }
// }

module.exports = function(client) {

  // core
  var routes = getModules(path.join(__dirname, "../routes"), ".json");
  var controllers = getModules(path.join(__dirname, "../controllers"), ".js");
  var middleware = {};
  // TODO custom: can overwrite the core routes and controller

  initControllers(controllers, client);

  return function(req, res, next) {

    // init
    var path = req.path;
    var method = req.method.toLowerCase();
    var routeData = getRouteData(routes, path);
    var routeConfig = routeData && routeData[method];

    // handleRequest
    var _controller = controllers && controllers[routeConfig.controller];
    var _middleware = middleware && middleware[routeConfig.middleware];
    var _action = _controller && _controller[routeConfig.action];
    if (typeof _action === "function") {
      handleMiddleware(_middleware, req, res, function(err) {
        _action.call(_controller, req, res, next);
      });
    } else {
      next();
    }

  };

};
