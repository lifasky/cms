"use strict";

var async = require("async");

var theme = exports = module.exports = {};

theme.getLayout = function(layout, client, content_tmpl, cb) {
  // TODO: for supporting mulpti-layouts
  this.layoutMainTempate(client, content_tmpl, cb);
};

theme.layoutMainTempate = function(client, content_tmpl, cb) {
  var comp = {};
  var self = this;
  async.parallel([
    function(callback) {
      self.getHeader(client, callback);
    },
    function(callback) {
      self.getNav(client, callback);
    },
    function(callback) {
      self.getFooter(client, callback);
    },
    function(callback) {
      self.getStyleGlobal(client, callback);
    },
    function(callback) {
      self.getScriptGlobal(client, callback);
    },
    function(callback) {
      self.getScriptGlobalHead(client, callback);
    }
  ], function(err, results) {
    if (!err) {
      comp = {
        header: results[0] || "  title #{title}\n",
        nav: results[1] || "  .nav\n",
        content: content_tmpl || "   .content\n",
        footer: results[2] || "   .footer\n"
      };
      var pageTemplate = self.layoutMain(comp);
      var stype_global = results[3];
      var script_global = results[4];
      var script_global_head = results[5];
      cb(null, {
        "pageTemplate": pageTemplate,
        "stype_global": stype_global,
        "script_global": script_global,
        "script_global_head": script_global_head
      });
    } else {
      cb(err, null);
    }
  });
};

theme.layoutMain = function(options) {
  options = options || {};
  var comp = {
    header: options.header || "  title #{title}\n",
    nav: options.nav || "  .nav\n",
    content: options.content || "   .content\n",
    footer: options.footer || "   .footer\n"
  };
  var template = "" + 
      "doctype html\n" + 
      "html(lang='en')\n" + 
      " head\n" + 
        comp.header + 
      "  style.\n" + 
      "   /* global stypes */\n" + 
      "   !{stype_global}" + "\n" + 
      "  style.\n" + 
      "   /* page stypes */\n" + 
      "   !{stype_page}" + 
          "\n" + 
      "  script.\n" + 
      "   !{script_global_head}" + 
          "\n" + 
      "  script.\n" + 
      "   !{script_page_head}" + 
          "\n" + 
      " body\n" + 
          comp.nav + 
      "  .body_full\n" + 
            comp.content + 
            comp.footer + 
            "\n" + 
      "  script.\n" + 
      "   /* global scripts */\n" + 
      "   !{script_global}" + 
          "\n" + 
      "  script.\n" + 
      "   /* page scripts */\n" + 
      "   !{script_page}";
  return template;
};


theme.getHeader = function(client, cb) {
  /* redis set */
  // jade:theme:main:header
  var data = "  title #{title}\n";
  cb(null, data);
};

theme.setHeader = function(client, value, cb) {};

theme.getNav = function(client, cb) {
  /* redis set */
  // jade:theme:main:nav
  var data = "  .nav This is navigation bar\n";
  cb(null, data);
};

theme.setNav = function(client, value, cb) {};

theme.getFooter = function(client, cb) {
  /* redis set */
  // jade:theme:main:footer
  var data = "   .footer This is footer\n";
  cb(null, data);
};

theme.setFooter = function(client, value, cb) {};

theme.getStyleGlobal = function(client, cb) {
  /* redis set */
  // style:theme:main:style
  var data = "p {color: red;}";
  cb(null, data);
};

theme.setStyleGlobal = function(client, value, cb) {};

theme.getScriptGlobal = function(client, cb) {
  /* redis set */
  // script:theme:main
  var data = "";
  cb(null, data);
};

theme.setScriptGlobal = function(client, value, cb) {};

theme.getScriptGlobalHead = function(client, cb) {
  /* redis set */
  // script:theme:main:head
  var data = "";
  cb(null, data);
};

theme.setScriptGlobalHead = function(client, value, cb) {};
