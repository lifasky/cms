"use strict";

var Mill = require("../store");
var async = require("async");
var _ = require("lodash");

var theme_layout = "" +
  "doctype html\n" +
  "html(lang='en')\n" +
  " head\n" +
  "{{head}}" +
  "  style.\n" +
  "   /* theme styles */\n" +
  "   !{style_theme}" + "\n" +
  "  style.\n" +
  "   /* page styles */\n" +
  "   !{style_page}" +
  "\n" +
  "  script.\n" +
  "   !{script_head_theme}" +
  "\n" +
  "  script.\n" +
  "   !{script_head_page}" +
  "\n" +
  " body\n" +
  "{{header}}" +
  "  .body_full\n" +
  "{{content}}" +
  "{{footer}}" +
  "\n" +
  "  script(src='//localhost:35729/livereload.js')\n" + // livereload
  "  script.\n" +
  "   /* theme scripts */\n" +
  "   !{script_end_theme}" +
  "\n" +
  "  script.\n" +
  "   /* page scripts */\n" +
  "   !{script_end_page}";

var theme_tmpls = {
  "main": {
    "name": "Main",
    "layout": theme_layout,
    "site_content": {
      "name": "Whole Mill",
      "version": "0.0.0",
      "auth": "Gloria Deng",
      "created_at": "2015-10-12"
    },
    "view_head": "  title #{title}\n",
    "view_header": "  .header This is header for navigation bar\n",
    "view_footer": "   .footer This is footer\n",
    "style": "p {color: red;}",
    "script_head": "console.log('HIHI Theme Script Head');\n",
    "script_end": "console.log('HIHI Theme Script');\n"
  }
};

var page_tmpls = {
  "p_tmpl_001": {
    "name": "Home",
    "theme_id": "main",
    "content_tmpl": "",
    "view_content": "   .content\n    H1 #{content.page_title}\n    p This is content\n",
    "style": "p {background: lightsteelblue;}",
    "script_head": "console.log('HIHI Page Script Head');\n",
    "script_end": "console.log('HIHI Page Script');\n"
  }
};

var pages = {
  "p_001": {
    "title": "Hi CMS",
    "theme_tmpl_id": "main",
    "page_tmpl_id": "p_tmpl_001",
    "content": {
      "page_title": "Home Page"
    }
  },
  "p_002": {
    "title": "Hi CMS",
    "theme_tmpl_id": "main",
    "page_tmpl_id": "p_tmpl_001",
    "content": {
      "page_title": "About Page"
    }
  }
};

var routes = {
  "/": "p_001",
  "/about": "p_002",
  "/about-us": "p_002"
}

var users = {
  "gloria@azuqua.com": {
    "password": "letmein"
  }
}

module.exports = function(client) {

  var mill = new Mill(client);

  function forEach(objs, module, action, cb) {
    var arr = [];
    _.forEach(objs, function(n, key) {
      n._key = key;
      arr.push(n);
    });
    async.each(arr, function(item, callback) {
      mill[module][action](item._key, item, function(err, data) {
        console.log("CMS: Initialize ", module, action, item._key, err, data);
        callback(err, data);
      });
    }, cb);
  }

  return {

    init: function(req, res) {
      async.parallel([
        function(callback) {
          // initial theme template
          forEach(theme_tmpls, "theme_tmpl", "update", callback);
        },
        function(callback) { // initial page template
          forEach(page_tmpls, "page_tmpl", "update", callback);
        },
        function(callback) { // initial pages
          forEach(pages, "page", "update", callback);
        },
        function(callback) {
          // initial routes
          var arr = [];
          _.forEach(routes, function(n, key) {
            var obj = {};
            obj.key = key;
            obj.value = n;
            arr.push(obj);
          });
          async.each(arr, function(item, cb) {
            mill.route.update(item.key, item.value, function(err, data) {
              console.log("CMS: Initialize ", "route", "update", item.key, err, data);
              cb(err, data);
            });
          }, callback);
        },
        function(callback) { // inital users
          forEach(users, "user", "update", callback);
        }
      ], function(err) {
        if (err) {
          res.send(err.toString());
        } else {
          res.send("Initialized Whole Mill");
        }
      });
    }

  };

};
