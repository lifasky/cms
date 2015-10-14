"use strict";

var Mill = require("../store");
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

  return {

    init: function(req, res) {
      // initial theme template
      _.forEach(theme_tmpls, function(n, key) {
        mill.theme_tmpl.update(key, n, function(err, data) {
          console.log("CMS: Initialize Theme Template", key, err, data);
        });
      });

      // initial page template
      _.forEach(page_tmpls, function(n, key) {
        mill.page_tmpl.update(key, n, function(err, data) {
          console.log("CMS: Initialize Page Template", key, err, data);
        });
      });

      // initial pages
      _.forEach(pages, function(n, key) {
        mill.page.update(key, n, function(err, data) {
          console.log("CMS: Initialize Pages", key, err, data);
        });
      });

      // initial routes
      _.forEach(routes, function(n, key) {
        mill.route.update(key, n, function(err, data) {
          console.log("CMS: Initialize Routes", key, err, data);
        });
      });

      // inital users
      _.forEach(users, function(n, key) {
        mill.user.update(key, n, function(err, data) {
          console.log("CMS: Initialize Users", key, err, data);
        });
      });

    }

  };

};
