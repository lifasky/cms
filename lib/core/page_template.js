"use strict";

var async = require("async");

function Page(client) {
  this.client = client;
}

Page.prototype.get = function(view_id, cb) {
  var p = {
    id: "",
    theme_id: "main",
    // content_tmpl: "",
    view_content: "   .content\n    p This is content\n",
    style: "p {background: lightsteelblue;}",
    script_head: "console.log('HIHI Page Script Head');\n",
    script_end: "console.log('HIHI Page Script');\n"
  };
  cb(null, p);
};

module.exports = Page;

// page.getStyle = function(client, view, cb) {
//   /* set */
//   var data = "p {font-size: 18px;}";
//   cb(null, data);
// };

// page.getScriptHead = function(client, view, cb) {
//   /* set */
//   var data = "console.log('HIHI Script Head');\n";
//   cb(null, data);
// };

// page.getScriptEnd = function(client, view, cb) {
//   /* set */
//   var data = "console.log('HIHI Script');\n";
//   cb(null, data);
// };

// page.getThemeId = function(client, view, cb) {
//   /* set */
//   var data = "main";
//   cb(null, data);
// };

// page.getViewContent = function(client, view, cb) {
//   /* set */
//   var data = "   .content\n    p This is content\n";
//   cb(null, data);
// };

// page.getAdminTemplate = function(client, view, cb) {
//   /* set */
//   var data = "";
//   cb(null, data);
// };
