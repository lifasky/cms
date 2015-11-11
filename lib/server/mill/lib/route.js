"use strict";

/*
  
  Examples:

  "/api/page/keys": {
      "get": {
        "page_id": "xxx" // default display
      },
      "post": {
        "type": "redirect", // redirect to next
        "next": "xxx",
        "middleware": null
      },
      "delete": {
        "type": "action", // take action
        "page_id": "xxx", // optional, if provided, then render page
        "controller": "page",
        "action": "invokeFlo",
        "params": {
          "alias": "4e06d2140dbbc6beac7a240b50f4aea0"
        },
        "middleware": null
      }
  }

 */

var async = require("async");
var _ = require("lodash");
var util = require("./util");

/**
 * Class Route
 * @class
 */
function Route(client, root) {
  this.client = client;
  this.table = root + ":routes";
  this.fields = [
    "url",
    "get",
    "post",
    "delete",
    "put"
  ];
}

function getDate() {
  return util.getDate();
}

Route.prototype.get = function(url, cb) {
  var client = this.client;
  var table = this.table;
  var key = url;
  client.get(table, key, function(err, data) {
    if (err) {
      console.log("ERROR: Route.get:", err);
      cb(err);
    } else {
      cb(null, data);
    }
  });
};

Route.prototype.getall = function(cb) {
  var client = this.client;
  var table = this.table;
  client.getall(table, function(err, data) {
    if (err) {
      console.log("ERROR: Route.getall:", err);
      cb(err);
    } else {
      cb(null, data);
    }
  });
};

Route.prototype.create = function(url, content, cb) {
  var client = this.client;
  var table = this.table;
  var fields = this.fields;
  var key = url;
  var value = _.pick(content, fields);
  value.url = url;
  value.created_at = getDate();
  client.create(table, key, value, function(err, data) {
    if (err) {
      console.log("ERROR: Route.create:", err);
      cb(err);
    } else {
      cb(null, value);
    }
  });
};

Route.prototype.update = function(url, content, cb) {
  var client = this.client;
  var table = this.table;
  var fields = this.fields;
  var key = url;
  var value = _.pick(content, fields);
  value.url = url;
  value.updated_at = getDate();
  client.update(table, key, value, function(err, data) {
    if (err) {
      console.log("ERROR: Route.update:", err);
      cb(err);
    } else {
      cb(null, value);
    }
  });
};

Route.prototype.delete = function(url, cb) {
  var client = this.client;
  var table = this.table;
  var key = url;
  client.delete(table, key, function(err, data) {
    if (err) {
      console.log("ERROR: Route.delete:", err);
      cb(err);
    } else {
      cb(null, data);
    }
  });
};

// Route.prototype.createMupltiUrls = function(page_id, urls, cb) {
//   if (!urls || !urls[0]) {
//     return cb(new Error("Route MupltiUrls: Input Syntax Error"));
//   }
//   var client = this.client;
//   var table = this.table;
//   var key;
//   var value;
//   async.each(urls, function(url, callback) {
//     key = url;
//     value = {
//       "url": url,
//       "page_id": page_id
//     };
//     client.create(table, key, value, callback);
//   }, function(err) {
//     if (err) {
//       console.log("ERROR: Route.MupltiUrls:", err);
//       cb(err);
//     } else {
//       cb(null);
//     }
//   });
// };

Route.prototype.getUrlsByPageId = function(page_id, cb) {
  var client = this.client;
  var table = this.table;
  var source = function(n) {
    if (n.get && n.get.page_id === page_id) {
      return true;
    }
    if (n.post && n.post.page_id === page_id) {
      return true;
    }
    if (n.delete && n.delete.page_id === page_id) {
      return true;
    }
    if (n.put && n.put.page_id === page_id) {
      return true;
    }
  };
  client.findKeys(table, source, function(err, data) {
    if (err) {
      console.log("ERROR: Route.getUrlsByPageId:", err);
      cb(err);
    } else {
      cb(null, data);
    }
  });
};

module.exports = Route;
