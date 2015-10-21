"use strict";

var _ = require("lodash");

module.exports.getDate = function() {
  return Math.floor(Date.now() / 1000);
};
