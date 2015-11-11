"use strict";

var async = require("async");
var _ = require("lodash");
var path = require("path");
var fs = require("fs");
var validationBuilder = require("./dns/validator");

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
  routes = _.reduce(routes, function(result, route) {
    _.assign(result, route);
    return result;
  }, {});


  var controllers = getModules(path.join(__dirname, "./core/controllers"), ".js");
  initControllers(controllers, client);

  // init custom controllers
  // var routes_custom = getModules(path.join(__dirname, "./custom/routes"), ".json");
  // var controllers_custom = getModules(path.join(__dirname, "./custom/controllers"), ".js");
  // initControllers(controllers_custom, client);

  // routes = _.assign(routes, routes_custom);
  // controllers = _.assign(controllers, controllers_custom);

  require("./auth/passport")(app, client);
  var middleware = require("./middleware")(client);

  app.use(function(req, res, next) {
    var host = req.hostname.split(".");
    var path = req.path;
    var domain = host[host.length - 2] + "." + host[host.length - 1];
    var subdomain = host.slice(0, -2).join(".") || "www"; // default to www.azuqua.com
    // var originalUrl = req.originalUrl;

    var method = req.method.toLowerCase();
    // var inputs = req.query || req.body || {};
    // var params = req.params || {};
    var routeConfig;
    var siteData; // {cms_root: "mill"}
    var reqType;
    // var redirect = false;

    console.log("*** dnsrouter --> started ***");
    console.log("domain: " + domain);
    console.log("subdomain: " + subdomain);
    console.log("path: " + path);
    console.log("method: " + method);
    // console.log("Original URL: " + originalUrl);

    async.series([
      function(callback) {
        getSiteData(domain, subdomain, function(err, data) {
          if (err) {
            callback(err);
          } else {
            siteData = data || {};
            callback(null);
          }
        });
      },
      function(callback) {
        // get route from generate mill routes;
        routeConfig = routes[path] && routes[path][method]; // TODO: handle custom routes && not match error
        // get route data from db;
        if (!routeConfig) {
          controllers.route.get(path, function(err, data) {
            if (!err) {
              routeConfig = data;
            } else {

            }
          });
        } else {
          callback(null);
        }

      }
    ], function(err) {
      if (!err) {

        if (!routeConfig) {
           controllers.page.show(req, res, next);
        }

        reqType = routeConfig.type;

        switch (reqType) {
          case "redirect":
            // TODO
            // doRedirect(req, res, routeConfig, next);
            break;
          case "display":
            // TODO
            // renderView(req, res, routeConfig);
            break;
          default:
            handleDynamicAction(routeConfig, req, res, next);
        }
      } else {
        next();
      }
    });

  });

  function getSiteData(domain, subdomain, cb) {
    var key = "site:" + subdomain + ":" + domain;
    client.get(key, function(err, data) {
      cb(err, data);
    })
  }

  function handleMiddleware(middleware, req, res, cb) {
    //if middleware stack present, run through middleware
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

  /**
   * handle dynamic action
   */
  function handleDynamicAction(routeConfig, req, res, next) {
    var _controller = controllers[routeConfig.controller];
    var _middleware = middleware[routeConfig.middleware];
    var _action = _controller && _controller[routeConfig.action];
    var validationRules = routeConfig.validationRules;
    if (typeof _action === "function") {
      //Run the request through form validation if rules present
      if (validationRules && _.isObject(validationRules)) {
        validationBuilder(validationRules)(req, res, function() {
          //TODO throw error if it's an API call without ui
          handleMiddleware(_middleware, req, res, function() {
            _action.call(_controller, req, res, next);
          });
        });
      } else {
        handleMiddleware(_middleware, req, res, function() {
          _action.call(_controller, req, res, next);
        });
      }
    } else {
      next();
    }
  }

}

module.exports = handleRequest;
