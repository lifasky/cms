"use strict";

var async = require("async");
var _ = require("lodash");
var uuid = require("node-uuid");
var util = require("./util");

/**
 * Class PageTemplate
 * @class
 */
function PageTemplate(client, site) {
  this.client = client;
  this.table = site + ":page_tmpls";
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
    "tags",
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

PageTemplate.prototype.getall = function(cb) {
  var client = this.client;
  var table = this.table;
  client.getall(table, function(err, data) {
    if (err) {
      console.log("ERROR: PageTemplate.getall:", err);
      cb(err);
    } else {
      cb(null, data);
    }
  });
};

PageTemplate.prototype.create = function(content, cb) {
  var client = this.client;
  var table = this.table;
  var key = uuid.v4();
  var fields = this.fields;
  var value = _.pick(content, fields);
  value.created_at = getDate();
  value.id = key;
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
  var value = _.pick(content, fields);
  value.id = id;
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

PageTemplate.prototype.list = function(cb) {
  var client = this.client;
  var table = this.table;
  var list = [];
  client.getall(table, function(err, data) {
    if (err) {
      console.log("ERROR: PageTemplate.list:", err);
      cb(err);
    } else {
      _.forEach(data, function(n, key) {
        list.push({"id": key, "name": n.name});
      });
      list = _.sortBy(list, "name");
      cb(null, list);
    }
  });
};

module.exports = PageTemplate;
