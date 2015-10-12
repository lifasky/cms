"use strict";

var async = require("async");

function Page(client) {
  this.client = client;
}

Page.prototype.get = function(p_id, cb) {
  var page = {
    id: p_id,
  	title: "Hi CMS",
  	theme_tmpl_id: "t_tmpl_001",
  	page_tmpl_id: "p_tmpl_001",
  	content: {
  		page_title: "Hello World"
  	}
  }
  cb(null, page);
};

module.exports = Page;



/*

id:

url:
redirect_urls:

title:
description:
keywords:

theme_tmpl_id:
page_tmpl_id:

publish:

content: {}
draft_content: {}

*/