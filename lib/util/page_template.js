"use strict";

var async = require("async");

var page = exports = module.exports = {};

page.getTemplate = function(client, view, cb) {
  /* redis, hash */
  var self = this;
  async.parallel([
    function(callback) {
      self.getPageLayout(client, view, callback);
    },
    function(callback) {
      self.getContentTemplate(client, view, callback);
    },
    function(callback) {
      self.getStylePage(client, view, callback);
    },
    function(callback) {
      self.getScriptPage(client, view, callback);
    },
    function(callback) {
      self.getScriptPageHead(client, view, callback);
    }
  ], function(err, results) {
    if (!err) {
      var layout = results[0];
      var content_tmpl = results[1];
      var stype_page = results[2];
      var script_page = results[3];
      var script_page_head = results[4];
      cb(null, {
        "layout": layout,
        "content_tmpl": content_tmpl,
        "stype_page": stype_page,
        "script_page": script_page,
        "script_page_head": script_page_head
      });
    } else {
      cb(err, null);
    }
  });
};

page.getStylePage = function(client, view, cb) {
  /* redis set */
  var data = "p {font-size: 18px;}";
  cb(null, data);
};

page.getScriptPage = function(client, view, cb) {
  /* redis set */
  var data = "console.log('HIHI Script');";
  cb(null, data);
};

page.getScriptPageHead = function(client, view, cb) {
  /* redis set */
  var data = "console.log('HIHI Script Head');";
  cb(null, data);
};

page.getPageLayout = function(client, view, cb) {
  /* redis set */
  var data = "main";
  cb(null, data);
};

page.getContentTemplate = function(client, view, cb) {
  /* redis set */
  var data = "   .content\n    p This is content\n";
  cb(null, data);
};

page.getPageAdminTemplate = function(client, view, cb) {
  /* redis set */
  var data = "";
  cb(null, data);
};

page.setPageAdminTemplate = function(client, view, value, cb) {};

