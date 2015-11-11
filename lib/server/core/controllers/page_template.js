"use strict";

var Mill = require("../../mill");

module.exports = function(client, root) {

  var mill = new Mill(client, root);

  return {
    get: function(obj, cb) {
      mill.page_tmpl.get(obj.id, cb);
    },

    getall: function(obj, cb) {
      mill.page_tmpl.getall(cb);
    },

    create: function(obj, cb) {
      mill.page_tmpl.create(obj.content, cb);
    },

    delete: function(obj, cb) {
      mill.page_tmpl.delete(obj.id, cb);
    },

    update: function(obj, cb) {
      mill.page_tmpl.update(obj.id, obj.content, cb);
    },

    updateSchema: function(obj, cb) {
      mill.page_tmpl.updateSchema(obj.id, obj.schema, cb);
    },

    keys: function(obj, cb) {
      mill.page_tmpl.keys(cb);
    },

    list: function(obj, cb) {
      mill.page_tmpl.list(cb);
    }

  };

};
