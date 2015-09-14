"use strict";

var path = require("path");
var express = require("express");
var jade = require("jade");
var async = require("async");
var util = require("./lib/util/index");

var app = express();
app.use(express.static(path.join(__dirname, "public")));
app.set("port", 9000);

app.get("/", function(req, res) {
  var client = "";
  var view = "xxx";
  var contents = {
    title: "Hi CMS"
  };
  util.render(client, view, contents, function(err, html) {
    if (!err) {
      res.send(html);
    } else {
      res.send(err);
    }
  });
});

var server = app.listen(app.get("port"));
console.log("Server listening on port " + app.get("port"));
