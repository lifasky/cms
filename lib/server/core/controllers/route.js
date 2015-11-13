"use strict";

var async = require("async");
var Mill = require("../../mill");

module.exports = function(client, root) {

  var mill = new Mill(client, root);

  return {
    get: function(obj, cb) {
      mill.route.get(obj.url, cb);
    },

    getall: function(obj, cb) {
      mill.route.getall(cb);
    },

    create: function(obj, cb) {
      mill.route.create(obj.url, obj.content, cb);
    },

    update: function(obj, cb) {
      mill.route.update(obj.url, obj.content, cb);
    },

    delete: function(obj, cb) {
      mill.route.delete(obj.url, cb);
    },

    getUrlsByPageId: function(obj, cb) {
      mill.route.getUrlsByPageId(obj.page_id, cb);
    },

    getUrlsByApiId: function(obj, cb) {
      mill.route.getUrlsByApiId(obj.api_id, cb);
    }

  };

};
