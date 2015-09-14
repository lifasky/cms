"use strict";

var jade = require("jade");
var async = require("async");
var page_tmpl = require("./page_template");
var theme_tmpl = require("./theme_template");

function render(client, view, contents, cb) {
  if (!view) {
    return cb(new Error("No view provided."));
  }
  var html;
  contents = contents || {};
  page_tmpl.getTemplate(client, view, function (err, tmpl) {
    if (!err) {
      theme_tmpl.getLayout(client, tmpl.layout, tmpl.content_tmpl, function(err, data) {
        if (!err) {
          contents.stype_global = data.stype_global;
          contents.stype_page = tmpl.stype_page;
          contents.script_global = data.script_global;
          contents.script_page = tmpl.script_page;
          contents.script_global_head = data.script_global_head;
          contents.script_page_head = tmpl.script_page_head;
          html = renderPage(data.pageTemplate, contents);
          cb(null, html);
        } else {
          cb(err, null);
        }
      });
    } else {
      cb(err, null);
    }
  });
}

function renderPage(template, contents) {
  var fn = jade.compile(template);
  var html = fn(contents);
  return html;
}

module.exports = render;
