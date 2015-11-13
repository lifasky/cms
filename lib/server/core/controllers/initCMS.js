"use strict";

var Mill = require("../../mill");
var async = require("async");
var _ = require("lodash");
var uuid = require("node-uuid");

/*

  This controller is used for initialize a new cms;

*/

var basic_theme_layout = "" +
  "doctype html\n" +
  "html(lang='en')\n" +
  " head\n" +
  "{{head}}\n" +
  "  style.\n" +
  "   /* theme styles */\n" +
  "   !{style_theme}" + "\n" +
  "  style.\n" +
  "   /* page styles */\n" +
  "   !{style_page}\n" +
  "\n" +
  "  script.\n" +
  "   !{script_head_theme}\n" +
  "\n" +
  "  script.\n" +
  "   !{script_head_page}\n" +
  "\n" +
  " body\n" +
  "{{header}}\n" +
  "  .body_full\n" +
  "{{content}}\n" +
  "{{footer}}\n" +
  "\n" +
  "  script(src='//localhost:35729/livereload.js')\n" + // livereload
  "  script.\n" +
  "   /* theme scripts */\n" +
  "   !{script_end_theme}\n" +
  "\n" +
  "  script.\n" +
  "   /* page scripts */\n" +
  "   !{script_end_page}\n";

var basic = {

  theme_tmpls: {
    "main": {
      "name": "Main",
      "layout": basic_theme_layout,
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
  },

  page_tmpls: {
    "60192944-d5d9-4159-ad36-9275d6373023": {
      "name": "Default",
      "theme_id": "main",
      "content_tmpl": "",
      "view_content": "   .content\n    H1 #{content.page_title}\n    p This is content\n",
      "style": "p {background: lightsteelblue;}",
      "script_head": "console.log('HIHI Page Script Head');\n",
      "script_end": "console.log('HIHI Page Script');\n"
    }
  },

  pages: {
    "6f11d7c9-44af-4953-b92c-30debfca7a97": {
      "title": "Home",
      "page_tmpl_id": "60192944-d5d9-4159-ad36-9275d6373023",
      "content": [{
        "headline": "Whole Mill",
        "sub_headline": "- created at 2015 by Azuqua -"
      }, {
        "headline": "Welcome!",
        "description": "This is Home page."
      }]
    },
    "bb06e7b9-ab7c-42be-af55-e70e5af598eb": {
      "title": "About",
      "page_tmpl_id": "60192944-d5d9-4159-ad36-9275d6373023",
      "content": [{
        "headline": "Whole Mill",
        "sub_headline": "- created at 2015 by Azuqua -"
      }, {
        "headline": "About!",
        "description": "This is About page."
      }]
    }
  },

  routes: {
    "/contact": {
      "get": {
        "type": "display",
        "page_id": "6f11d7c9-44af-4953-b92c-30debfca7a97"
      }
    },
    "/about": {
      "get": {
        "type": "display",
        "page_id": "bb06e7b9-ab7c-42be-af55-e70e5af598eb"
      }
    },
    "/about-us": {
      "get": {
        "type": "display",
        "page_id": "bb06e7b9-ab7c-42be-af55-e70e5af598eb"
      }
    }
  },

  users: {
    "gloria@azuqua.com": {
      "priority": "owner",
    }
  }

};

function forEach(mill, objs, module, action, cb) {
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

function createDomainRoute(client, root, domain, subdomain, cb) {
  var key = "routes" + ":" + domain + ":" + subdomain;
  var value;
  client.get(key, function(err, data) {
    if (err) {
      cb(err);
    } else if (data) {
      cb(new Error("Already exist"));
    } else {
      // var root = uuid.v4();
      value = {
        "root": root
      }
      value = JSON.stringify(value);
      client.set(key, value, function(err) {
        if (!err) {
          cb(null, root);
        } else {
          cb(err);
        }
      });
    }
  });
}

function initCMS(mill, theme_tmpls, page_tmpls, pages, routes, users, cb) {
  async.parallel([
    function(callback) {
      // initial theme template
      forEach(mill, theme_tmpls, "theme_tmpl", "create", callback);
    },
    function(callback) { // initial page template
      forEach(mill, page_tmpls, "page_tmpl", "create", callback);
    },
    function(callback) { // initial pages
      forEach(mill, pages, "page", "create", callback);
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
        mill.route.create(item.key, item.value, function(err, data) {
          console.log("CMS: Initialize ", "route", "create", item.key, err, data);
          cb(err, data);
        });
      }, callback);
    },
    function(callback) { // inital users
      forEach(mill, users, "user", "create", callback);
    }
  ], cb);
}

module.exports = function(client) {

  return {
    /*
      http://localhost.azuqua.com:9000/api/init/cms
      root
      domain
      subdomain
     */
    init: function(obj, cb) {
      if (!obj.root || !obj.domain || !obj.subdomain) {
        return cb("No root, domain or subdomain provided.");
      }
      var mill;
      var root = obj.root;
      var domain = obj.domain;
      var subdomain = obj.subdomain;

      var theme_tmpls = basic.theme_tmpls;
      var page_tmpls = basic.page_tmpls;
      var pages = basic.pages;
      var routes = basic.routes;
      var users = basic.users;

      createDomainRoute(client, root, domain, subdomain, function(err) {
        if (!err) {
          mill = new Mill(client, root);
          initCMS(mill, theme_tmpls, page_tmpls, pages, routes, users, function(err) {
            if (!err) {
              cb(null, "Initialized Whole Mill", root);
            } else {
              cb(err, err.toString());
            }
          });
        } else {
          cb(err);
        }
      });
    }

  };

};

