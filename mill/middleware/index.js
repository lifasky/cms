"use strict";

var Mill = require("../store");


function auth(req, res, next) {
  next();
}

module.exports = function(client) {

  return {
    auth: auth
  };

};
