"use strict";

var jade = require("jade");
var async = require("async");
var Page_tmpl = require("./page_template");
var Theme_tmpl = require("./theme_template");
var Route = new require("./route");
var Page = new require("./page");

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

function init(route, page, path, cb) {

  async.waterfall([
    function(callback) {
      route.get(path, function(err, data) {
        callback(err, data);
      });
    },
    function(_page_id, callback) {
      console.log("Page ID: ", _page_id);
      page.get(_page_id, function(err, data) {
        callback(err, data);
      });
    }
  ], function(err, data) {
    cb(err, data);
  });

}

function render(theme_tmpl, page_tmpl, theme_tmpl_id, page_tmpl_id, contents, cb) {

  var html;
  var template;

  async.parallel(
    [
      function(callback) {
        theme_tmpl.get(theme_tmpl_id, callback);
      },
      function(callback) {
        page_tmpl.get(page_tmpl_id, callback);
      }
    ],
    function(err, results) {
      if (!err) {
        var theme = results[0];
        var page = results[1];
        // template
        template = buildTemplate({
          layout: theme.layout,
          head: theme.view_head,
          header: theme.view_header,
          content: page.view_content,
          footer: theme.view_footer
        });
        // content
        contents = contents || {};
        // theme
        contents.style_theme = theme.style;
        contents.script_head_theme = theme.script_head;
        contents.script_end_theme = theme.script_end;
        // page
        contents.style_page = page.style;
        contents.script_head_page = page.script_head;
        contents.script_end_page = page.script_end;
        // compile
        html = compilePage(template, contents);
        cb(null, html);
      } else {
        cb(err, null);
      }
    });
}

module.exports = function(client) {

  var page_tmpl = new Page_tmpl(client);
  var theme_tmpl = new Theme_tmpl(client);
  var route = new Route(client);
  var page = new Page(client);

  return function(path, cb) {
    console.log("Path: " + path);
    async.waterfall([
      function(callback) {
        init(route, page, path, callback);
      },
      function(_page, callback) {
        console.log("Page ID: ", _page.id);
        console.log("Theme Templage ID: ", _page.theme_tmpl_id);
        console.log("Page Templage ID: ", _page.page_tmpl_id);
        render(theme_tmpl, page_tmpl, _page.theme_tmpl_id, _page.page_tmpl_id, _page.contents, callback);
      }
    ], function(err, html) {
      cb(err, html);
    });
  };

};
