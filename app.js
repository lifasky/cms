"use strict";

var path = require("path");
var express = require("express");
var config = global.config = require("./config/app.json");
var jade = require("jade");
var redis = require("redis");
var async = require("async");
var Mill = require("./mill");
// var initCMS = require("./mill/controllers/initCMS");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(express.static(path.join(__dirname, "public")));
app.set("port", 9000);

var client = redis.createClient(config.redis.port, config.redis.server, {
  auth_pass: config.redis.key
});

client.select(config.redis.db, function(err) {
  if (err) {
    err.msg = "Error creating redis clients!";
    process.exit();
  }

  // initCMS(client);
  var mill = new Mill(client);
  app.use(mill);

});


app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/editor", function(req, res) {
  res.render("editor");
});

var server = app.listen(app.get("port"));
console.log("Server listening on port " + app.get("port"));
