"use strict";

var Mill = require("../../mill");

module.exports = function(client, root) {

  var mill = new Mill(client, root);

  return {

    get: function(obj, cb) {
      mill.api.get(obj.id, cb);
    },

    getall: function(obj, cb) {
      mill.api.getall(cb);
    },

    create: function(obj, cb) {
      mill.api.create(obj.content, cb);
    },

    delete: function(obj, cb) {
      mill.api.delete(obj.id, cb);
    },

    update: function(obj, cb) {
      mill.api.update(obj.id, obj.content, cb);
    },

    publish: function(obj, cb) {
      mill.api.publish(obj.id, cb);
    },

    unPublish: function(obj, cb) {
      mill.api.unPublish(obj.id, cb);
    },

    updateContent: function(obj, cb) {
      mill.api.update(obj.id, obj.content, cb);
    },

    keys: function(obj, cb) {
      mill.api.keys(cb);
    },

    list: function(obj, cb) {
      mill.api.list(cb);
    }

  };

};
