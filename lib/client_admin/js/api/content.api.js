"use strict";

var ajax = require("../util/ajax");
var _ = require("lodash");

module.exports.theme_tmpl = {

  get: function(id, cb) {
    var url = "/api/theme_tmpl/" + id;
    ajax.get(url, null, cb);
  },

  create: function(id, content, cb) {
    var url = "/api/theme_tmpl/";
    var data = {
      "id": id,
      "content": content
    }
    ajax.post(url, data, cb);
  },

  update: function(id, content, cb) {
    var url = "/api/theme_tmpl/" + id;
    var data = {
      "content": content
    }
    ajax.put(url, data, cb);
  },

  delete: function(id, cb) {
    var url = "/api/theme_tmpl/" + id;
    ajax.delete(url, null, cb);
  },

  list: function(cb) {
    var url = "/api/theme_tmpl/list";
    ajax.get(url, null, cb);
  }

};

module.exports.page_tmpl = {

  get: function(id, cb) {
    var url = "/api/page_tmpl/" + id;
    ajax.get(url, null, cb);
  },

  create: function(content, cb) {
    var url = "/api/page_tmpl/";
    var data = {
      "content": content
    }
    ajax.post(url, data, cb);
  },

  update: function(id, content, cb) {
    var url = "/api/page_tmpl/" + id;
    var data = {
      "content": content
    }
    ajax.put(url, data, cb);
  },

  delete: function(id, cb) {
    var url = "/api/page_tmpl/" + id;
    ajax.delete(url, null, cb);
  },

  list: function(cb) {
    var url = "/api/page_tmpl/list";
    ajax.get(url, null, cb);
  }

};

module.exports.page = {

  get: function(id, cb) {
    var url = "/api/page/" + id;
    ajax.get(url, null, cb);
  },

  create: function(content, cb) {
    var url = "/api/page/";
    var data = {
      "content": content
    }
    ajax.post(url, data, cb);
  },

  update: function(id, content, cb) {
    var url = "/api/page/" + id;
    var data = {
      "content": content
    }
    ajax.put(url, data, cb);
  },

  delete: function(id, cb) {
    var url = "/api/page/" + id;
    ajax.delete(url, null, cb);
  },

  list: function(cb) {
    var url = "/api/page/list";
    ajax.get(url, null, cb);
  }

};

module.exports.route = {
  get: function(path, cb) {
    var url = "/api/route" + "?url=" + path;
    ajax.get(url, null, cb);
  },

  create: function(path, content, cb) {
    var url = "/api/route";
    var data = {
      "url": path,
      "content": content
    }
    ajax.post(url, data, cb);
  },

  update: function(path, content, cb) {
    var url = "/api/route";
    var data = {
      "url": path,
      "content": content
    }
    ajax.put(url, data, cb);
  },

  delete: function(path, cb) {
    var url = "/api/route";
    var data = {
      "url": path
    }
    ajax.delete(url, data, cb);
  },

  getall: function(cb) {
    var url = "/api/route/all";
    ajax.get(url, null, cb);
  }

};

module.exports.user = {

};

function show(err, data) {
  if (err) {
    console.log(err);
  } else {
    console.log(JSON.stringify(data, null, "  "));
  }
}
