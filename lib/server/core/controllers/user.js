"use strict";

var async = require("async");
var Mill = require("../../mill");

module.exports = function(client, root) {

  var mill = new Mill(client, root);

  return {
    get: function(obj, cb) {
      mill.user.get(obj.id, cb);
    },

    getall: function(obj, cb) {
      mill.user.getall(cb);
    },

    create: function(obj, cb) {
      mill.user.create(obj.id, obj.user, cb);
    },

    update: function(obj, cb) {
      mill.user.update(obj.id, obj.content, cb);
    },

    delete: function(obj, cb) {
      mill.user.delete(obj.id, cb);
    },

    auth: function(obj, cb) {
      mill.user.auth(obj.id, obj.password, cb);
    }

  };

};
