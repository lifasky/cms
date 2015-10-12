"use strict";

var async = require("async");
var jade = require("jade");
var Page_tmpl = require("./page_template");
var Theme_tmpl = require("./theme_template");
var Route = new require("./route");
var Theme = new require("./theme");
var Page = new require("./page");
var compiler = require("./compiler");
var _ = require("lodash");

function Mill(client) {
  this.client = client;
  this.page_tmpl = new Page_tmpl(client);
  this.theme_tmpl = new Theme_tmpl(client);
  this.route = new Route(client);
  this.theme = new Theme(client);
  this.page = new Page(client);
}

function defaultLayout() {
  var template = "" +
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
  return template;
}

function buildTemplate(view) {
  view = view || {};
  var sb = view.layout || defaultLayout();
  delete view.layout;
  var s;
  var i;
  var found;
  view = {
    head: view.head || "  title #{title}\n",
    header: view.header || "  .header\n",
    content: view.content || "   .content\n",
    footer: view.footer || "   .footer\n"
  };
  for (var k in view) {
    s = "{{" + k + "}}";
    found = sb.match(s);
    if (found && found.index > -1) {
      i = found.index;
      sb = sb.substring(0, i) + view[k] + sb.substring(i + s.length);
    }
  }
  return sb;
}

function compilePage(template, contents) {
  var fn = jade.compile(template);
  var html = fn(contents);
  return html;
}

Mill.prototype.render = function(path, cb) {
  var self = this;
  var html;
  var raw_template;
  var raw_content;
  async.waterfall(
    [
      function(callback) {
        // get page id
        self.route.get(path, function(err, _page_id) {
          callback(err, _page_id);
        });
      },
      function(_page_id, callback) {
        // get page view_id, theme_id, contents
        console.log("Page ID: ", _page_id);
        self.page.get(_page_id, function(err, data) {
          callback(err, data);
        });
      },
      function(data, callback) {
        // get theme templage
        self.theme_tmpl.get(data.theme_tmpl_id, function(err, theme_tmpl) {
          callback(err, data, theme_tmpl);
        });
      },
      function(data, theme_tmpl, callback) {
        // get page template
        self.page_tmpl.get(data.page_tmpl_id, function(err, page_tmpl) {
          callback(err, theme_tmpl, page_tmpl, data.content);
        });
      }
    ],
    function(err, theme, page, content) {
      if (!err) {
        // template
        raw_template = buildTemplate({
          layout: theme.layout,
          head: theme.view_head,
          header: theme.view_header,
          content: page.view_content,
          footer: theme.view_footer
        });
        // contents
        raw_content = _.extend({
          // theme
          style_theme: theme.style,
          script_head_theme: theme.script_head,
          script_end_theme: theme.script_end,
          // page
          style_page: page.style,
          script_head_page: page.script_head,
          script_end_page: page.script_end
        }, content);
        // compile
        html = compilePage(raw_template, raw_content);
        cb(null, html);
      } else {
        cb(err, null);
      }
    });
};

module.exports = Mill;
