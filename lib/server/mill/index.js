"use strict";

var async = require("async");
var DB = require("./lib/db");
var Page_tmpl = require("./lib/page_template");
var Theme_tmpl = require("./lib/theme_template");
var Route = new require("./lib/route");
var Page = new require("./lib/page");
var Api = new require("./lib/api");
var User = new require("./lib/user");
var compiler = require("./lib/compiler");
var _ = require("lodash");

function Mill(db, root, cb) {
  if (!db || !root) {
    console.log("ERROR: No db or root provided");
    return;
  }
  var client = new DB(db);
  root = root; // TODO: handle invalid input
  this.page_tmpl = new Page_tmpl(client, root);
  this.theme_tmpl = new Theme_tmpl(client, root);
  this.route = new Route(client, root);
  this.page = new Page(client, root);
  this.api = new Api(client, root);
  this.user = new User(client, root);
}

Mill.prototype.render = function(view, body, cb) {
  var self = this;
  var page_id = view;
  var html;
  var raw_template;
  var raw_content;
  console.log("****** page rednering --> started ******");
  async.waterfall(
    [
      function(callback) {
        // get page view_id, theme_id, contents
        console.log("Page ID: ", page_id);
        self.page.get(page_id, function(err, data) {
          callback(err, data);
        });
      },
      function(data, callback) {
        // get page templage
        console.log("Page Template ID: ", data.page_tmpl_id);
        self.page_tmpl.get(data.page_tmpl_id, function(err, page_tmpl) {
          callback(err, data, page_tmpl);
        });
      },
      function(data, page_tmpl, callback) {
        // get theme template
        console.log("Theme Template ID: ", page_tmpl.theme_id);
        self.theme_tmpl.get(page_tmpl.theme_id, function(err, theme_tmpl) {
          callback(err, theme_tmpl, page_tmpl, data);
        });
      }
    ],
    function(err, theme, page, content) {
      if (!err) {
        // template
        raw_template = {
          layout: theme.layout,
          head: theme.view_head,
          header: theme.view_header,
          content: page.view_content,
          footer: theme.view_footer
        };

        // contents
        content = content.content || {};
        content = _.extend(content, body);

        raw_content = _.extend({
          // theme
          style_theme: theme.style,
          script_head_theme: theme.script_head,
          script_end_theme: theme.script_end,
          // page
          style_page: page.style,
          script_head_page: page.script_head,
          script_end_page: page.script_end,
          // content
          content: content
        });
        // compile
        html = compiler(raw_template, raw_content);

        cb(null, html);
      } else {
        cb(err, null);
      }
      console.log("****** page rednering --> ended ******");
    });
}

Mill.prototype.newPage = function(content, cb) {
  var self = this;
  var page_tmpl_id = content.page_tmpl_id;
  var payload = {};
  async.waterfall([
    function(callback) {
      self.page_tmpl.get(page_tmpl_id, function(err, data) {
        var schema = {};
        try {
          schema = JSON.parse(data && data.schema);
        } catch (e) {}
        callback(err, schema);
      });
    },
    function(schema, callback) {
      _.assign(schema, content);
      self.page.create(null, schema, callback);
    }
  ], function(err, data) {
    cb(err, data);
  });
};


module.exports = Mill;
