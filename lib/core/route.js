"use strict";

var async = require("async");

function Route(client) {
  this.client = client;
}

Route.prototype.get = function(r_id, cb) {
  var page_id = "p_001";
  cb(null, page_id);
};

module.exports = Route;
