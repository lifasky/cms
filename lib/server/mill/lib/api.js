"use strict";

var async = require("async");
var _ = require("lodash");
var uuid = require("node-uuid");
var util = require("./util");

/**
 * Class Api
 * @class
 */
function Api(client, root) {
  this.client = client;
  this.table = root + ":apis";
  this.fields = [
    "id",
    "name",

    "tags",

    // config
    "publish",

    // dynamic action
    "controller",
    "action",
    "params",
    "middleware",

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

Api.prototype.get = function(id, cb) {
  var client = this.client;
  var table = this.table;
  var key = id;
  client.get(table, key, function(err, data) {
    if (err) {
      console.log("ERROR: Api.get:", err);
      cb(err);
    } else {
      cb(null, data);
    }
  });
};

Api.prototype.getall = function(cb) {
  var client = this.client;
  var table = this.table;
  client.getall(table, function(err, data) {
    if (err) {
      console.log("ERROR: Api.getall:", err);
      cb(err);
    } else {
      cb(null, data);
    }
  });
};

Api.prototype.create = function(id, content, cb) {
  var client = this.client;
  var table = this.table;
  var key = id || uuid.v4();
  var fields = this.fields;
  var value = _.pick(content, fields);
  value.created_at = getDate();
  value.id = key;
  client.create(table, key, value, function(err, data) {
    if (err) {
      console.log("ERROR: Api.create:", err);
      cb(err);
    } else {
      cb(null, value);
    }
  });
};

Api.prototype.delete = function(id, cb) {
  var client = this.client;
  var table = this.table;
  var key = id;
  client.delete(table, key, function(err, data) {
    if (err) {
      console.log("ERROR: Api.delete:", err);
      cb(err);
    } else {
      cb(null, data);
    }
  });
};

Api.prototype.update = function(id, content, cb) {
  var client = this.client;
  var table = this.table;
  var key = id
  var fields = this.fields;
  var value = _.pick(content, fields);
  value.id = id;
  value.updated_at = getDate();
  client.update(table, key, value, function(err, data) {
    if (err) {
      console.log("ERROR: Api.update:", err);
      cb(err);
    } else {
      cb(null, value);
    }
  });
};

Api.prototype.publish = function(id, cb) {
  var client = this.client;
  var table = this.table;
  var key = id
  var value = {
    "publish": true
  };
  value.updated_at = getDate();
  client.update(table, key, value, function(err, data) {
    if (err) {
      console.log("ERROR: Api.publish:", err);
      cb(err);
    } else {
      cb(null, data);
    }
  });
};

Api.prototype.unPublish = function(id, cb) {
  var client = this.client;
  var table = this.table;
  var key = id
  var value = {
    "publish": false
  };
  value.updated_at = getDate();
  client.update(table, key, value, function(err, data) {
    if (err) {
      console.log("ERROR: Api.unPublish:", err);
      cb(err);
    } else {
      cb(null, data);
    }
  });
};

Api.prototype.keys = function(cb) {
  var client = this.client;
  var table = this.table;
  client.keys(table, function(err, data) {
    if (err) {
      console.log("ERROR: Api.keys:", err);
      cb(err);
    } else {
      cb(null, data);
    }
  });
};

Api.prototype.list = function(cb) {
  var client = this.client;
  var table = this.table;
  var list = [];
  client.getall(table, function(err, data) {
    if (err) {
      console.log("ERROR: Api.list:", err);
      cb(err);
    } else {
      _.forEach(data, function(n, key) {
        list.push({
          "id": key,
          "name": n.name,
          "publish": n.publish || false
        });
      });
      list = _.sortBy(list, "name");
      cb(null, list);
    }
  });
};

module.exports = Api;
