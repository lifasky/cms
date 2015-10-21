"use strict";

var express = require("express");
var path = require("path");
var redis = require("redis");
var async = require("async");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var RedisStore = require("connect-redis")(session);
var config = global.config = require("./config/app.json");
var server = require("./server");

function makeWholeMill(app) {
  app.use(express.static(path.join(__dirname, "content")));

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({
    extended: false
  }));

  // parse application/json
  app.use(bodyParser.json());

  var client = redis.createClient(config.redis.port, config.redis.server, {
    auth_pass: config.redis.key
  });

  client.select(config.redis.db, function(err) {
    if (err) {
      err.msg = "Error creating redis clients!";
      console.log(err);
      // process.exit();

      app.get("*", function(req, res) {
        res.status(404).send("error/404");
      });

      app.listen(app.get("port"), function() {
        console.log("www server started on: " + app.get("port"));
      });
    }

    var sessionsMiddleware = session({
      store: new RedisStore({
        client: client,
        ttl: config.sessions.ttl
      }),
      secret: config.sessions.secret,
      key: config.sessions.key,
      saveUninitialized: false,
      resave: false,
      cookie: config.sessions.cookie
    });

    app.use(cookieParser());
    app.use("/", sessionsMiddleware);

    return server(app, client);

  });
}

module.exports = makeWholeMill;
