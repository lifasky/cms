"use strict";

var async = require("async");
var DB = require("./db");
var Page_tmpl = require("./page_template");
var Theme_tmpl = require("./theme_template");
var Route = new require("./route");
var Page = new require("./page");
var User = new require("./user");
var compiler = require("./lib/compiler");
var _ = require("lodash");

function Mill(db) {
  var client = new DB(db);
  this.page_tmpl = new Page_tmpl(client);
  this.theme_tmpl = new Theme_tmpl(client);
  this.route = new Route(client);
  this.page = new Page(client);
  this.user = new User(client);
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
        // get theme templage
        console.log("Page Template ID: ", data.theme_tmpl_id);
        self.theme_tmpl.get(data.theme_tmpl_id, function(err, theme_tmpl) {
          callback(err, data, theme_tmpl);
        });
      },
      function(data, theme_tmpl, callback) {
        // get page template
        console.log("Page Template ID: ", data.page_tmpl_id);
        self.page_tmpl.get(data.page_tmpl_id, function(err, page_tmpl) {
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
        content.content = _.extend(content, body);
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
        html = compiler(raw_template, raw_content);
        cb(null, html);
      } else {
        cb(err, null);
      }
      console.log("****** page rednering --> ended ******");
    });
}

Mill.prototype.show = function(path, cb) {
  var self = this;
  console.log("Path: ", path);
  self.route.get(path, function(err, page_id) {
    if (err) {
      cb(err);
    } else {
      self.render(page_id, {}, cb);
    }
  });
};

Mill.prototype.updatePageContent = function(page_id, content, cb) {
  var self = this;
  async.waterfall([
    function(callback) {
      self.page.get(page_id, function(err, data) {
        callback(err, data && data.page_tmpl_id);
      });
    },
    function(page_tmpl_id, callback) {
      self.page_template.get(page_tmpl_id, function(err, data) {
        callback(err, data && data.schema);
      });
    },
    function(schema, callback) {
      content = _.assign(schema, content);
      self.page.update(page_id, {"content": content}, callback);
    }
  ], function(err, data) {
    cb(err, data);
  });
};


module.exports = Mill;

