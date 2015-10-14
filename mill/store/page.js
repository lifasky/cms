"use strict";

var async = require("async");
var _ = require("lodash");
var uuid = require("node-uuid");
var util = require("../lib/util");

/**
 * Class Page
 * @class
 */
function Page(client) {
  this.client = client;
  this.table = "mill:pages";
  this.fields = [
    "id",
    "urls",

    // template
    "theme_tmpl_id",
    "page_tmpl_id",

    // config
    "publish",

    // seo
    "title",
    "description",
    "keywords",

    // content
    "content",

    // other info
    "created_at",
    "created_by",
    "updated_at",
    "updated_by"
  ];
}

function getDate() {
  return util.getDate();
}

Page.prototype.get = function(id, cb) {
  var client = this.client;
  var table = this.table;
  var key = id;
  client.get(table, key, function(err, data) {
    if (err) {
      console.log("ERROR: Page.get:", err);
      cb(err);
    } else {
      cb(null, data);
    }
  });
};

Page.prototype.getall = function(id, cb) {
  var client = this.client;
  var table = this.table;
  client.getall(table, function(err, data) {
    if (err) {
      console.log("ERROR: Page.getall:", err);
      cb(err);
    } else {
      cb(null, data);
    }
  });
};

Page.prototype.create = function(content, cb) {
  var client = this.client;
  var table = this.table;
  var key = uuid.v4();
  var fields = this.fields;
  content.id = key;
  var value = _.pick(content, fields);
  value.created_at = getDate();
  client.create(table, key, value, function(err, data) {
    if (err) {
      console.log("ERROR: Page.create:", err);
      cb(err);
    } else {
      cb(null, value);
    }
  });
};

Page.prototype.delete = function(id, cb) {
  var client = this.client;
  var table = this.table;
  var key = id;
  client.hdel(table, key, function(err, data) {
    if (err) {
      console.log("ERROR: Page.delete:", err);
      cb(err);
    } else {
      cb(null, data);
    }
  });
};

Page.prototype.update = function(id, content, cb) {
  var client = this.client;
  var table = this.table;
  var key = id
  var fields = this.fields;
  content.id = id;
  var value = _.pick(content, fields);
  value.updated_at = getDate();
  client.update(table, key, value, function(err, data) {
    if (err) {
      console.log("ERROR: Page.update:", err);
      cb(err);
    } else {
      cb(null, value);
    }
  });
};

Page.prototype.getPagesByPageTmpl = function(page_tmpl_id, cb) {
  var client = this.client;
  var table = this.table;
  var source = {
    "page_tmpl_id": page_tmpl_id
  };
  var urls = [];
  client.findKeys(table, source, function(err, data) {
    if (err) {
      console.log("ERROR: Page.getPagesByPageTmpl:", err);
      cb(err);
    } else {
      cb(null, data);
    }
  });
};

Page.prototype.publish = function(id, cb) {
  var client = this.client;
  var table = this.table;
  var key = id
  var value = {
    "publish": true
  };
  value.updated_at = getDate();
  client.update(table, key, value, function(err, data) {
    if (err) {
      console.log("ERROR: Page.publish:", err);
      cb(err);
    } else {
      cb(null, data);
    }
  });
};

Page.prototype.unPublish = function(id, cb) {
  var client = this.client;
  var table = this.table;
  var key = id
  var value = {
    "publish": false
  };
  value.updated_at = getDate();
  client.update(table, key, value, function(err, data) {
    if (err) {
      console.log("ERROR: Page.unPublish:", err);
      cb(err);
    } else {
      cb(null, data);
    }
  });
};

Page.prototype.updateContent = function(id, content, cb) {
  var client = this.client;
  var table = this.table;
  var key = id
  var value = {};
  client.get(table, key, function(err, data) {
    if (err) {
      console.log("ERROR: Page.updateContent:", err);
      cb(err);
    } else {
      data = _.extend(data.content, content);
      value = {
        "content": data.content
      };
      value.updated_at = getDate();
      client.update(table, key, value, function(err, data) {
        if (err) {
          console.log("ERROR: Page.updateContent:", err);
          cb(err);
        } else {
          cb(null, value);
        }
      });
    }
  });
};

module.exports = Page;
