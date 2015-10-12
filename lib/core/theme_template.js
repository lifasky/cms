"use strict";

var async = require("async");

function Theme(client) {
  this.client = client;
}

Theme.prototype.get = function(t_id, cb) {
  var t = {
    id: "main",
    layout: "",
    // site_content_tmpl: "",
    view_head: "  title #{title}\n",
    view_header: "  .header This is header for navigation bar\n",
    view_footer: "   .footer This is footer\n",
    style: "p {color: red;}",
    script_head: "console.log('HIHI Theme Script Head');\n",
    script_end: "console.log('HIHI Theme Script');\n"
  };
  cb(null, t);
};

module.exports = Theme;


// theme.getHead = function(client, cb) {
//   /* set */
//   // view:theme:main:head
//   var data = "  title #{title}\n";
//   cb(null, data);
// };


// theme.getHeader = function(client, cb) {
//   /* set */
//   // view:theme:main:header
//   var data = "  .header This is header for navigation bar\n";
//   cb(null, data);
// };


// theme.getFooter = function(client, cb) {
//   /* set */
//   // view:theme:main:footer
//   var data = "   .footer This is footer\n";
//   cb(null, data);
// };


// theme.getStyle = function(client, cb) {
//   /* set */
//   // style:theme:main
//   var data = "p {color: red;}";
//   cb(null, data);
// };


// theme.getScriptHead = function(client, cb) {
//   /* set */
//   // script:theme:main:head
//   var data = "";
//   cb(null, data);
// };

// theme.getScriptEnd = function(client, cb) {
//   /* set */
//   // script:theme:main:end
//   var data = "";
//   cb(null, data);
// };
