"use strict";

var _ = require("lodash");

module.exports.toArray = function(obj) {
  var array = [];
  var _obj = JSON.parse(JSON.stringify(obj));
  _.forEach(_obj, function(n, key) {
    n._key = key;
    array.push(n);
  });
  return array;
};
