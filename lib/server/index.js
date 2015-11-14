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

// function initControllers(controllers, client, root) {
//   console.log("initControllers here")
//   _.forEach(controllers, function(Con, key) {
//     console.log("TTT initControllers", key, typeof Con);
//     controllers[key] = new Con(client, root);
//   });
// }

function handleRequest(app, client) {

  var routes;
  var controllers;
  var controllers_core;
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

  // init core controllers
  routes = getModules(path.join(__dirname, "./core/routes"), ".json");
  routes = _.reduce(routes, function(result, route) {
    _.assign(result, route);
    return result;
  }, {});

  controllers_core = getModules(path.join(__dirname, "./core/controllers"), ".js");
  controllers_custom = getModules(path.join(__dirname, "./custom/controllers"), ".js");
  controllers = _.assign(controllers_core, controllers_custom);

  // require("./auth/passport")(app, client); // TODO

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
        // handle initializing error
        if (!siteData || !siteData.root) {
          if (route !== "/api/init/cms") {
            console.log("ERROR: Failure in initializing");
            return callback(new Error("Failure in initializing"));
          }
        }
        // initialize middleware
        middleware = require("./middleware")(client, siteData.root); // TODO

        callback(null);
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
        case "display":
          // TODO
          handleDisplay(req, res, next);
          break;
        case "api":
          // TODO
          handleAPI(req, res, next);
          break;
        case "redirect":
          // TODO
          handleRedirect(req, res, next);
          break;
        default:
          handleCoreAPI(req, res, next);
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
          console.log("WARM:", "No correct siteDate provided.");
          cb(null);
        } else {
          console.log("root:", data.root);
          siteData = data || {};
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
    // TODO: bad! need to optimize mill to handle root
    // get route data from db;
    var routeCon = controllers.route(client, siteData.root);
    routeCon.get({
      "url": route
    }, function(err, data) {
      if (err) {
        cb(err);
      } else {
        // todo
        routeConfig = data[method] || {};
        inputs.routeConfig = routeConfig;
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
  function handleDynamicAction(req, res, next) {
    var _controller = controllers[routeConfig.controller];
    if (_controller) {
      _controller = controllers[routeConfig.controller](client, siteData.root);
    } else {
      console.log("Error: controller not found.");
      return next();
    }
    var _action = _controller && _controller[routeConfig.action];
    var _middleware = middleware[routeConfig.middleware];
    var validationRules = routeConfig.validationRules;
    if (typeof _action === "function") {
      //Run the request through form validation if rules present
      if (validationRules && _.isObject(validationRules)) {
        validationBuilder(validationRules)(req, res, function() {
          //TODO throw error if it's an API call without ui
          handleMiddleware(_middleware, req, res, function() {
            _action(inputs, function(err, data) {
              if (!err) {
                res.status(200).send(data);
              } else {
                console.log("ERROR:", err);
                res.status(400).send(err);
              }
            });
          });
        });
      } else {
        handleMiddleware(_middleware, req, res, function() {
          _action(inputs, function(err, data) {
            if (!err) {
              res.status(200).send(data);
            } else {
              console.log("ERROR:", err);
              res.status(400).send(err);
            }
          });
        });
      }
    } else {
      console.log("Error: action not found.");
      next();
    }
  }

  /**
   * handle dynamic action
   */
  function handleCoreAPI(req, res, next) {
    handleDynamicAction(req, res, next);
  }

  /**
   * handle render pages
   */
  function handleDisplay(req, res, next) {
    var _controller = controllers.page(client, siteData.root);
    _controller.get({"id": routeConfig.page_id}, function(err, data) {
      if (!err && data.publish) {
        _.assign(routeConfig, data);
        if (!data.requiedPreload) {
          routeConfig.controller = "page";
          routeConfig.action = "show";
          inputs.id = routeConfig.page_id;
        }
        // inputs.body = inputs; // params, query, body // TODO
        handleDynamicAction(req, res, next);
      } else if (!data.publish) {
        console.log("WARM: handleDisplay:", "Page is not published");
        next();
      } else {
        console.log("ERROR: handleDisplay:", err);
        next();
      }
    });
  }

  /**
   * handle redirect
   */
  // TODO
  function handleRedirect(req, res, next) {
    next();
  }

  /**
   * handle dynamic action
   */
  function handleAPI(req, res, next) {
    var _controller = controllers.api(client, siteData.root);
    _controller.get({"id": routeConfig.api_id}, function(err, data) {
      if (!err && data.publish) {
        _.assign(routeConfig, data);
        handleDynamicAction(req, res, next);
      } else {
        next();
      }
    });
  }


}

module.exports = handleRequest;
