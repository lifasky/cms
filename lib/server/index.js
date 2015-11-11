"use strict";

var async = require("async");
var _ = require("lodash");
var path = require("path");
var fs = require("fs");
var validationBuilder = require("./dns/validator");
var Mill = require("./mill");

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

  var mill;
  var routes;
  var controllers;
  var controllers_custom;
  var middleware;

  var host;
  var route;
  var domain;
  var subdomain;
  // var originalUrl;

  var method;
  var inputs;
  var routeConfig;
  var siteData;
  var reqType;

  middleware = require("./middleware")(client);

  // init core controllers
  routes = getModules(path.join(__dirname, "./core/routes"), ".json");
  routes = _.reduce(routes, function(result, route) {
    _.assign(result, route);
    return result;
  }, {});

  controllers = getModules(path.join(__dirname, "./core/controllers"), ".js");
  initControllers(controllers, client);

  // init custom controllers
  controllers_custom = getModules(path.join(__dirname, "./custom/controllers"), ".js");
  initControllers(controllers_custom, client);

  controllers = _.assign(controllers, controllers_custom);

  require("./auth/passport")(app, client); // TODO

  app.use(function(req, res, next) {
    host = req.hostname.split(".");
    route = req.path;
    domain = host[host.length - 2] + "." + host[host.length - 1];
    subdomain = host.slice(0, -2).join(".") || "www"; // default to www.azuqua.com
    // originalUrl = req.originalUrl;

    method = req.method.toLowerCase();
    inputs = _.assign({}, req.query, req.body);

    console.log("*** dnsrouter --> started ***");
    console.log("domain: " + domain);
    console.log("subdomain: " + subdomain);
    console.log("route: " + route);
    console.log("method: " + method);
    // console.log("Original URL: " + originalUrl);

    async.series([
      function(callback) {
        // Get siteData
        getSiteData(domain, subdomain, callback);
      },
      function(callback) {
        // Get routeConfig
        lookupRoute(route, method, callback);
      }
    ], function(err) {
      if (err || _.isEmpty(routeConfig)) {
        return next();
      }
      console.log("routeConfig:", routeConfig);
      switch (routeConfig.type) {
        case "redirect":
          // TODO
          handleRedirect(req, res, next);
          break;
        case "display":
          // TODO
          handleDisplay(req, res, next);
          break;
        default:
          handleAPI(req, res, next);
      }
    });
  });

  function getSiteData(domain, subdomain, cb) {
    var key = "routes" + ":" + domain + ":" + subdomain;
    // e.g. sitedata = {root: "xxx"}
    client.get(key, function(err, data) {
      if (!err) {
        try {
          data = JSON.parse(data);
        } catch (e) {}
        if (!data || _.isEmpty(data) || !data.root) {
          console.log("ERROR:", "No correct siteDate provided.");
          cb(new Error("No correct siteDate provided."));
        } else {
          console.log("root:", data.root);
          siteData = data;
          mill = new Mill(client, data.root); // TODO
          cb(null);
        }
      } else {
        cb(err);
      }
    })
  }

  function lookupRoute(route, method, cb) {
    // get route from generate mill routes;
    routeConfig = routes[route] && routes[route][method]; // TODO: handle custom routes && not match error
    if (routeConfig && !_.isEmpty(routeConfig)) {
      return cb(null);
    }
    // get route data from db;
    mill.route.get(route, function(err, data) {
      if (err) {
        cb(err);
      } else {
        routeConfig = data[method] || {};
        _.assign(inputs, routeConfig.params);
        cb(null);
      }
    });
  }

  /**
   * handle middleware
   */
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
  function handleDynamicAction(action, middleware, req, res, next) {
    var validationRules = routeConfig.validationRules;
    if (typeof action === "function") {
      //Run the request through form validation if rules present
      if (validationRules && _.isObject(validationRules)) {
        validationBuilder(validationRules)(req, res, function() {
          //TODO throw error if it's an API call without ui
          handleMiddleware(middleware, req, res, function() {
            action(inputs, function(err, data) {
              if (!err) {
                res.status(200).send(data);
              } else {
                res.status(400).send(err);
              }
            });
          });
        });
      } else {
        handleMiddleware(middleware, req, res, function() {
          action(inputs, function(err, data) {
            if (!err) {
              res.status(200).send(data);
            } else {
              res.status(400).send(err);
            }
          });
        });
      }
    } else {
      next();
    }
  }

  /**
   * handle redirect
   */
  // TODO
  function handleRedirect(req, res, next) {
    next();
  }

  /**
   * handle render pages
   */
  function handleDisplay(req, res, next) {
    var _middleware = middleware[routeConfig.middleware];
    var _controller;
    var _action;
    if (routeConfig.requiedPreload) {
      _controller = controllers[routeConfig.controller];
      _action = _controller && _controller[routeConfig.action];
    } else {
      inputs.id = routeConfig.page_id;
      // inputs.body = inputs; // params, query, body // TODO
      _action = controllers.page.show;
    }
    handleDynamicAction(_action, _middleware, req, res, next);
  }

  /**
   * handle dynamic action
   */
  function handleAPI(req, res, next) {
    var _controller = controllers[routeConfig.controller];
    var _middleware = middleware[routeConfig.middleware];
    var _action = _controller && _controller[routeConfig.action];
    handleDynamicAction(_action, _middleware, req, res, next);
  }


}

module.exports = handleRequest;
