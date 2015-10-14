"use strict";

var _ = require("lodash");
var path = require("path");
var fs = require("fs");

module.exports.getDate = function() {
  return Math.floor(Date.now() / 1000);
};

module.exports.getModules = function(dirname, extend) {
  extend = extend || ".js";
  var modules = _.reduce(fs.readdirSync(dirname), function(out, file) {
    if (file !== __filename)
      out[path.basename(file, extend)] = require(path.join(dirname, file));
    return out;
  }, {});
  return modules;
}
