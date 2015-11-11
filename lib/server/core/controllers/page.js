"use strict";

var Mill = require("../../mill");

module.exports = function(client, root) {

  var mill = new Mill(client, root);

  return {

    show: function(obj, cb) {
      mill.render(obj.id, obj.body, cb);
    },

    get: function(obj, cb) {
      mill.page.get(obj.id, cb);
    },

    getall: function(obj, cb) {
      mill.page.getall(cb);
    },

    create: function(obj, cb) {
      console.log("TTT", obj);
      mill.newPage(obj.content, cb);
    },

    delete: function(obj, cb) {
      mill.page.delete(obj.id, cb);
    },

    update: function(obj, cb) {
      mill.page.update(obj.id, obj.content, cb);
    },

    getPagesByPageTmpl: function(obj, cb) {
      mill.page.getPagesByPageTmpl(obj.page_tmpl_id, cb);
    },

    publish: function(obj, cb) {
      mill.page.publish(obj.id, cb);
    },

    unPublish: function(obj, cb) {
      mill.page.unPublish(obj.id, cb);
    },

    updateContent: function(obj, cb) {
      mill.page.update(obj.id, obj.content, cb);
    },

    keys: function(obj, cb) {
      mill.page.keys(cb);
    },

    list: function(obj, cb) {
      mill.page.list(cb);
    }

  };

};
