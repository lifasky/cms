"use strict";

var async = require("async");
var util = require("./lib/util");
var _ = require("lodash");

/**
 * Class User
 * @class
 */
function User(client) {
  this.client = client;
  this.table = "mill:users";
  this.fields = [
    "id",
    "name",
    "password",
    "priority",

    // other info
    "created_at"
  ];
}

function getDate() {
  return util.getDate();
}

User.prototype.get = function(id, cb) {
  var client = this.client;
  var table = this.table;
  var key = id;
  client.get(table, key, function(err, data) {
    if (err) {
      console.log("ERROR: User.get:", err);
      cb(err);
    } else {
      cb(null, data);
    }
  });
};

User.prototype.getall = function(cb) {
  var client = this.client;
  var table = this.table;
  client.getall(table, function(err, data) {
    if (err) {
      console.log("ERROR: User.getall:", err);
      cb(err);
    } else {
      cb(null, data);
    }
  });
};

User.prototype.create = function(id, user, cb) {
  var client = this.client;
  var table = this.table;
  var key = id;
  var fields = this.fields;
  user.id = id;
  var value = _.pick(user, fields);
  value.created_at = getDate();
  client.create(table, key, value, function(err, data) {
    if (err) {
      console.log("ERROR: User.create:", err);
      cb(err);
    } else {
      delete value.password;
      cb(null, value);
    }
  });
};

User.prototype.delete = function(id, cb) {
  var client = this.client;
  var table = this.table;
  var key = id
  client.delete(table, key, function(err, data) {
    if (err) {
      console.log("ERROR: User.delete:", err);
      cb(err);
    } else {
      cb(null, data);
    }
  });
};

User.prototype.update = function(id, content, cb) {
  var client = this.client;
  var table = this.table;
  var key = id
  var fields = this.fields;
  content.id = id;
  var value = _.pick(content, fields);
  client.update(table, key, value, function(err, data) {
    if (err) {
      console.log("ERROR: User.update:", err);
      cb(err);
    } else {
      cb(null, value);
    }
  });
};

User.prototype.auth = function(id, password, cb) {
  var client = this.client;
  var table = this.table;
  var key = id;
  client.get(table, key, function(err, data) {
    if (err) {
      console.log("ERROR: User.get:", err);
      cb(err);
    } else if (data.password !== password) {
      cb(new Error("Incorrect Password"));
    } else {
      delete data.password;
      cb(null, data);
    }
  });
};

module.exports = User;
