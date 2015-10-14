"use strict";

var async = require("async");
var _ = require("lodash");
var uuid = require("node-uuid");
var util = require("../lib/util");

/**
 * Class PageTemplate
 * @class
 */
function PageTemplate(client) {
  this.client = client;
  this.table = "mill:page_tmpls";
  this.fields = [
    "id",
    "name",
    "theme_id",
    "schema",
    "view_content",
    "style",
    "script_head",
    "script_end",
    
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

PageTemplate.prototype.get = function(id, cb) {
  var client = this.client;
  var table = this.table;
  var key = id;
  client.get(table, key, function(err, data) {
    if (err) {
      console.log("ERROR: PageTemplate.get:", err);
      cb(err);
    } else {
      cb(null, data);
    }
  });
};

PageTemplate.prototype.create = function(tmpl, cb) {
  var client = this.client;
  var table = this.table;
  var key = uuid.v4();;
  var fields = this.fields;
  tmpl.id = key;
  var value = _.pick(tmpl, fields);
  value.created_at = getDate();
  client.create(table, key, value, function(err, data) {
    if (err) {
      console.log("ERROR: PageTemplate.create:", err);
      cb(err);
    } else {
      cb(null, value);
    }
  });
};

PageTemplate.prototype.delete = function(id, cb) {
  var client = this.client;
  var table = this.table;
  var key = id
  client.delete(table, key, function(err, data) {
    if (err) {
      console.log("ERROR: PageTemplate.delete:", err);
      cb(err);
    } else {
      cb(null, data);
    }
  });
};

PageTemplate.prototype.update = function(id, content, cb) {
  var client = this.client;
  var table = this.table;
  var key = id
  var fields = this.fields;
  content.id = id;
  var value = _.pick(content, fields);
  value.updated_at = getDate();
  client.update(table, key, value, function(err, data) {
    if (err) {
      console.log("ERROR: PageTemplate.update:", err);
      cb(err);
    } else {
      cb(null, value);
    }
  });
};

PageTemplate.prototype.updateSchema = function(id, schema, cb) {
  var client = this.client;
  var table = this.table;
  var key = id
  var value = {
    "schema": schema
  };
  value.updated_at = getDate();
  client.update(table, key, value, function(err, data) {
    if (err) {
      console.log("ERROR: PageTemplate.updateSchema:", err);
      cb(err);
    } else {
      cb(null, value);
    }
  });
};

PageTemplate.prototype.keys = function(cb) {
  var client = this.client;
  var table = this.table;
  client.keys(table, function(err, data) {
    if (err) {
      console.log("ERROR: PageTemplate.keys:", err);
      cb(err);
    } else {
      cb(null, data);
    }
  });
};

module.exports = PageTemplate;
