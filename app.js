"use strict";

var path = require("path");
var express = require("express");
var config = global.config = require("./config/app.json");
var jade = require("jade");
var redis = require("redis");
var async = require("async");
var Mill = require("./mill");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(express.static(path.join(__dirname, "public")));
app.set("port", 9000);

/**
 * Initialize Session Handling
 */
var cookieParser = require("cookie-parser");
var session = require("express-session");
var RedisStore = require("connect-redis")(session);

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


  var mill = new Mill(client);
  
  require("./controllers/oauth")(app, mill);

  app.use(mill);

});

app.get("/admin/login", function(req, res) {
  res.render("login");
});

app.get("/admin/editor", function(req, res) {
  res.render("editor");
});

var server = app.listen(app.get("port"));
console.log("Server listening on port " + app.get("port"));
