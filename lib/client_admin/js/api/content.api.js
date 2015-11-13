"use strict";

var ajax = require("../util/ajax");
var _ = require("lodash");

var PREFIX = "/api";

module.exports.theme_tmpl = {

  get: function(id, cb) {
    var url = "/api/theme_tmpl?id=" + id;
    ajax.get(url, null, cb);
  },

  create: function(content, cb) {
    var url = "/api/theme_tmpl";
    var data = {
      "content": content
    };
    ajax.post(url, data, cb);
  },

  update: function(id, content, cb) {
    var url = "/api/theme_tmpl";
    var data = {
      "id": id,
      "content": content
    };
    ajax.put(url, data, cb);
  },

  delete: function(id, cb) {
    var url = "/api/theme_tmpl";
    var data = {
      "id": id
    };
    ajax.delete(url, data, cb);
  },

  list: function(cb) {
    var url = "/api/theme_tmpl/list";
    ajax.get(url, null, cb);
  }

};

module.exports.page_tmpl = {

  get: function(id, cb) {
    var url = "/api/page_tmpl?id=" + id;
    ajax.get(url, null, cb);
  },

  create: function(content, cb) {
    var url = "/api/page_tmpl";
    var data = {
      "content": content
    };
    ajax.post(url, data, cb);
  },

  update: function(id, content, cb) {
    var url = "/api/page_tmpl";
    var data = {
      "id": id,
      "content": content
    };
    ajax.put(url, data, cb);
  },

  delete: function(id, cb) {
    var url = "/api/page_tmpl"
    var data = {
      "id": id
    };
    ajax.delete(url, data, cb);
  },

  list: function(cb) {
    var url = "/api/page_tmpl/list";
    ajax.get(url, null, cb);
  }

};

module.exports.page = {

  get: function(id, cb) {
    var url = "/api/page?id=" + id;
    ajax.get(url, null, cb);
  },

  create: function(content, cb) {
    var url = "/api/page";
    var data = {
      "content": content
    };
    ajax.post(url, data, cb);
  },

  update: function(id, content, cb) {
    var url = "/api/page";
    var data = {
      "id": id,
      "content": content
    };
    ajax.put(url, data, cb);
  },

  delete: function(id, cb) {
    var url = "/api/page";
    var data = {
      "id": id
    };
    ajax.delete(url, data, cb);
  },

  list: function(cb) {
    var url = "/api/page/list";
    ajax.get(url, null, cb);
  }

};

module.exports.api = {

  get: function(id, cb) {
    var url = "/api/api?id=" + id;
    ajax.get(url, null, cb);
  },

  create: function(content, cb) {
    var url = "/api/api";
    var data = {
      "content": content
    };
    ajax.post(url, data, cb);
  },

  update: function(id, content, cb) {
    var url = "/api/api";
    var data = {
      "id": id,
      "content": content
    };
    ajax.put(url, data, cb);
  },

  delete: function(id, cb) {
    var url = "/api/api";
    var data = {
      "id": id
    };
    ajax.delete(url, data, cb);
  },

  list: function(cb) {
    var url = "/api/api/list";
    ajax.get(url, null, cb);
  }

};

module.exports.route = {
  get: function(_url, cb) {
    var url = "/api/route" + "?url=" + _url;
    ajax.get(url, null, cb);
  },

  create: function(_url, content, cb) {
    var url = "/api/route";
    var data = {
      "url": _url,
      "content": content
    };
    ajax.post(url, data, cb);
  },

  update: function(_url, content, cb) {
    var url = "/api/route";
    var data = {
      "url": _url,
      "content": content
    };
    ajax.put(url, data, cb);
  },

  delete: function(_url, cb) {
    var url = "/api/route";
    var data = {
      "url": _url
    };
    ajax.delete(url, data, cb);
  },

  getall: function(cb) {
    var url = "/api/route/all";
    ajax.get(url, null, cb);
  },

  getUrlsByPageId: function(page_id, cb) {
    var url = "/api/route/page?page_id=" + page_id;
    ajax.get(url, null, cb);
  },

  getUrlsByApiId: function(api_id, cb) {
    var url = "/api/route/api?api_id=" + api_id;
    ajax.get(url, null, cb);
  }

};

module.exports.user = {
  get: function(id, cb) {
    var url = "/api/user?id=" + id;
    ajax.get(url, null, cb);
  },

  create: function(id, user, cb) {
    var url = "/api/user";
    var data = {
      "id": id,
      "user": user
    }
    ajax.post(url, data, cb);
  },

  update: function(id, content, cb) {
    var url = "/api/user";
    var data = {
      "id": id,
      "content": content
    }
    ajax.put(url, data, cb);
  },

  delete: function(id, cb) {
    var url = "/api/user";
    var data = {
      "id": id
    }
    ajax.delete(url, data, cb);
  },

  getall: function(cb) {
    var url = "/api/user/all";
    ajax.get(url, null, cb);
  }

};

function show(err, data) {
  if (err) {
    console.log(err);
  } else {
    console.log(JSON.stringify(data, null, "  "));
  }
}
