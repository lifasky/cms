"use strict";

var Mill = require("../../mill");

module.exports = function(client, root) {

  var mill = new Mill(client, root);

  return {
    get: function(obj, cb) {
      mill.theme_tmpl.get(obj.id, cb);
    },

    getall: function(obj, cb) {
      mill.theme_tmpl.getall(cb);
    },

    create: function(obj, cb) {
      mill.theme_tmpl.create(null, obj.content, cb);
    },

    delete: function(obj, cb) {
      mill.theme_tmpl.delete(obj.id, cb);
    },

    update: function(obj, cb) {
      mill.theme_tmpl.update(obj.id, obj.content, cb);
    },

    updateContent: function(obj, cb) {
      mill.theme_tmpl.updateContent(obj.id, obj.content, cb);
    },

    keys: function(obj, cb) {
      mill.theme_tmpl.keys(cb);
    },

    list: function(obj, cb) {
      mill.theme_tmpl.list(function(err, data) {
        cb(err, data);
      });
    }

  };

};
