"use strict";

var jade = require("jade");

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

module.exports = function(raw_template, contents) {
  var template = buildTemplate({
    layout: raw_template.layout,
    head: raw_template.view_head,
    header: raw_template.view_header,
    content: raw_template.view_content,
    footer: raw_template.view_footer
  });
  var fn = jade.compile(template);
  var html = fn(contents);
  return html;
}
