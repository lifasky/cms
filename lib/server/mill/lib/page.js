"use strict";

var async = require("async");
var _ = require("lodash");
var uuid = require("node-uuid");
var util = require("./util");

/**
 * Class Page
 * @class
 */
function Page(client, root) {
  this.client = client;
  this.table = root + ":pages";
  this.fields = [
    "id",

    "tags",

    // template
    "page_tmpl_id",

    // config
    "publish",

    // seo
    "title",
    "description",
    "keywords",

    // content
    "content",

    // dynamic action
    "requiedPreload",
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

Page.prototype.getall = function(cb) {
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

Page.prototype.create = function(id, content, cb) {
  var client = this.client;
  var table = this.table;
  var key = id || uuid.v4();
  var fields = this.fields;
  var value = _.pick(content, fields);
  value.created_at = getDate();
  value.id = key;
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
  client.delete(table, key, function(err, data) {
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
  var value = _.pick(content, fields);
  value.id = id;
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
  var value = {
    "content": content
  };
  value.updated_at = getDate();
  client.update(table, key, value, function(err, data) {
    if (err) {
      console.log("ERROR: Page.updateContent:", err);
      cb(err);
    } else {
      cb(null, data);
    }
  });
};

Page.prototype.keys = function(cb) {
  var client = this.client;
  var table = this.table;
  client.keys(table, function(err, data) {
    if (err) {
      console.log("ERROR: Page.keys:", err);
      cb(err);
    } else {
      cb(null, data);
    }
  });
};

Page.prototype.list = function(cb) {
  var client = this.client;
  var table = this.table;
  var list = [];
  client.getall(table, function(err, data) {
    if (err) {
      console.log("ERROR: Page.list:", err);
      cb(err);
    } else {
      _.forEach(data, function(n, key) {
        list.push({
          "id": key,
          "title": n.title,
          "publish": n.publish || false
        });
      });
      list = _.sortBy(list, "title");
      cb(null, list);
    }
  });
};

module.exports = Page;
