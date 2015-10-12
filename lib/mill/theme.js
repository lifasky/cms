"use strict";

var async = require("async");

function Theme(client) {
  this.client = client;
}

Theme.prototype.get = function(t_id, cb) {
  var theme = {
    id: t_id,
  	name: "Whole Mill",
    version: "",
    created_at: "",
    updated_at: "",
    author: ""
  }
  cb(null, theme);
};

module.exports = Theme;
