"use strict";

var async = require("async");
var _ = require("lodash");
var uuid = require("node-uuid");
var util = require("./lib/util");

/**
 * Class ThemeTemplate
 * @class
 */
function ThemeTemplate(client) {
  this.client = client;
  this.table = "mill:theme_tmpls";
  this.fields = [
    "id",
    "name",
    "layout",
    "content",
    "view_head",
    "view_header",
    "view_footer",
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

ThemeTemplate.prototype.get = function(id, cb) {
  var client = this.client;
  var table = this.table;
  var key = id;
  client.get(table, key, function(err, data) {
    if (err) {
      console.log("ERROR: ThemeTemplate.get:", err);
      cb(err);
    } else {
      cb(null, data);
    }
  });
};

ThemeTemplate.prototype.getall = function(cb) {
  var client = this.client;
  var table = this.table;
  client.getall(table, function(err, data) {
    if (err) {
      console.log("ERROR: ThemeTemplate.getall:", err);
      cb(err);
    } else {
      cb(null, data);
    }
  });
};

ThemeTemplate.prototype.create = function(tmpl, cb) {
  var client = this.client;
  var table = this.table;
  var key = uuid.v4();
  var fields = this.fields;
  tmpl.id = key;
  var value = _.pick(tmpl, fields);
  value.created_at = getDate();
  client.create(table, key, value, function(err, data) {
    if (err) {
      console.log("ERROR: ThemeTemplate.create:", err);
      cb(err);
    } else {
      cb(null, value);
    }
  });
};

ThemeTemplate.prototype.delete = function(id, cb) {
  var client = this.client;
  var table = this.table;
  var key = id
  client.delete(table, key, function(err, data) {
    if (err) {
      console.log("ERROR: ThemeTemplate.delete:", err);
      cb(err);
    } else {
      cb(null, data);
    }
  });
};

ThemeTemplate.prototype.update = function(id, content, cb) {
  var client = this.client;
  var table = this.table;
  var key = id
  var fields = this.fields;
  content.id = id;
  var value = _.pick(content, fields);
  value.updated_at = getDate();
  client.update(table, key, value, function(err, data) {
    if (err) {
      console.log("ERROR: ThemeTemplate.update:", err);
      cb(err);
    } else {
      cb(null, value);
    }
  });
};

ThemeTemplate.prototype.updateContent = function(id, content, cb) {
  var client = this.client;
  var table = this.table;
  var key = id
  var value = {
    "content": content
  };
  value.updated_at = getDate();
  client.update(table, key, value, function(err, data) {
    if (err) {
      console.log("ERROR: ThemeTemplate.updateContent:", err);
      cb(err);
    } else {
      cb(null, value);
    }
  });
};

ThemeTemplate.prototype.keys = function(cb) {
  var client = this.client;
  var table = this.table;
  client.keys(table, function(err, data) {
    if (err) {
      console.log("ERROR: ThemeTemplate.keys:", err);
      cb(err);
    } else {
      cb(null, data);
    }
  });
};

ThemeTemplate.prototype.list = function(cb) {
  var client = this.client;
  var table = this.table;
  var list = [];
  client.getall(table, function(err, data) {
    if (err) {
      console.log("ERROR: ThemeTemplate.list:", err);
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

module.exports = ThemeTemplate;
