"use strict";

var AppDispatcher = require("../dispatcher/App.dispatcher");
var EventEmitter = require("events").EventEmitter;
var ContentConstants = require("../constants/Content.constants");
var api = require("../api/content.api");
var _ = require("lodash");
var async = require("async");
var uuid = require("node-uuid");
var util = require("../util/util");

var CHANGE_EVENT = "change";
var LOAD_EVENT = "load";

var _onload = false;
var _selected_content = null;

var _schemas = {
  "theme_tmpl": {
    "layout": {
      "mode": null
    },
    "content": {
      "content_editor": true,
      "mode": "json"
    },
    "view_head": {
      "mode": "jade"
    },
    "view_header": {
      "mode": "jade"
    },
    "view_footer": {
      "mode": "jade"
    },
    "style": {
      "mode": "css"
    },
    "script_head": {
      "mode": "javascript"
    },
    "script_end": {
      "mode": "javascript"
    },
    "_config": {
      "mode": "json",
      "content_editor": true,
      "fields": [
        "id",
        "name"
      ]
    }
  },
  "page_tmpl": {
    "schema": {
      "content_editor": true,
      "mode": "json"
    },
    "view_content": {
      "mode": "jade"
    },
    "style": {
      "mode": "css"
    },
    "script_head": {
      "mode": "javascript"
    },
    "script_end": {
      "mode": "javascript"
    },
    "_config": {
      "mode": "json",
      "content_editor": true,
      "fields": [
        "id",
        "name",
        "theme_id"
      ]
    }
  },
  "page": {
    "content": {
      "content_editor": true,
      "mode": "json"
    },
    "_config": {
      "mode": "json",
      "content_editor": true,
      "fields": [
        "id",
        // "urls",

        // template
        "theme_tmpl_id",
        "page_tmpl_id",

        // config
        "publish",

        // seo
        "title",
        "description",
        "keywords",
      ]
    }
  },
  "route": {
    "_config": {
      "mode": "json",
      "content_editor": true,
      "fields": [
        "url",
        "page_id"
      ]
    }
  }
};

var _menus = [{
  "id": "theme_tmpl",
  "displace_name": "Theme Templates",
  "submenu": []
}, {
  "id": "page_tmpl",
  "displace_name": "Page Templates",
  "submenu": []
}, {
  "id": "page",
  "displace_name": "Pages",
  "submenu": []
}, {
  "id": "route",
  "displace_name": "Routes",
  "submenu": []
}];

function _formatSelectedContent(data, type, field, type_displace_name) {
  var schema = _schemas[type][field];
  _selected_content = {};
  _selected_content.id = data.id;
  _selected_content.type = type;
  _selected_content.type_displace_name = type_displace_name;
  _selected_content.field = field;
  _selected_content.name = data.name;
  _selected_content.mode = schema.mode;
  _selected_content.content_editor = schema.content_editor;
  if (field !== "_config") {
    _selected_content.value = data[field];
  } else {
    _selected_content.value = _.pick(data, schema.fields);
  }
  if (typeof _selected_content.value === "object") {
    _selected_content.value = JSON.stringify(_selected_content.value, null, "  ");
  }
}

/**
 * Initialize Editor
 */
function initializeEditor(cb) {
  _onload = true;
  async.parallel([
    function(callback) {
      api.theme_tmpl.list(function(err, data) {
        if (!err) {
          _.forEach(data, function(n) {
            n.type = "theme_tmpl";
            n.submenu = util.toArray(_schemas.theme_tmpl);
            _menus[0].submenu.push(n);
          });
        }
        callback(err, null);
      });
    },
    function(callback) {
      api.page_tmpl.list(function(err, data) {
        if (!err) {
          _.forEach(data, function(n) {
            n.type = "page_tmpl";
            n.submenu = util.toArray(_schemas.page_tmpl);
            _menus[1].submenu.push(n);
          });
        }
        callback(err, null);
      });
    },
    function(callback) {
      api.page.list(function(err, data) {
        if (!err) {
          _.forEach(data, function(n) {
            n.name = n.title;
            n.type = "page";
            n.submenu = util.toArray(_schemas.page);
            _menus[2].submenu.push(n);
          });
        }
        callback(err, null);
      });
    },
    function(callback) {
      api.route.getall(function(err, data) {
        if (!err) {
          _.forEach(data, function(n) {
            n.id = n.url;
            n.name = n.url;
            n.type = "route";
            n.submenu = util.toArray(_schemas.route);
            _menus[3].submenu.push(n);
          });
        }
        callback(err, null);
      });
    }
  ], function(err, results) {
    _onload = false;
    _selected_content = {};
    cb(null);
  });
}

/**
 * Theme Template
 */
function theme_tmpl_get(id, field, cb) {
  _onload = true;
  api.theme_tmpl.get(id, function(err, data) {
    _onload = false;
    _formatSelectedContent(data, "theme_tmpl", field, "Theme Templates");
    cb(null);
  });
}

function theme_tmpl_update(id, content, cb) {
  _onload = true;
  api.theme_tmpl.update(id, content, function(err, data) {
    _onload = false;
    cb(null);
  });
}

function theme_tmpl_delete(id, cb) {
  _onload = true;
  api.theme_tmpl.delete(id, function(err, data) {
    _onload = false;
    if (!err) {
      _.remove(_menus[0].submenu, {
        "id": id
      });
    }
    cb(null);
  });
}

function theme_tmpl_create(id, content, cb) {
  _onload = true;
  api.theme_tmpl.create(id, content, function(err, data) {
    _onload = false;
    if (!err) {
      data.type = "theme_tmpl";
      data.submenu = util.toArray(_schemas.theme_tmpl);
      _menus[0].submenu.push(data);
    }
    cb(null);
  });
}

/**
 * Page Template
 */
function page_tmpl_get(id, field, cb) {
  _onload = true;
  api.page_tmpl.get(id, function(err, data) {
    _onload = false;
    _formatSelectedContent(data, "page_tmpl", field, "Page Templates");
    cb(null);
  });
}

function page_tmpl_update(id, content, cb) {
  _onload = true;
  if (content._config) {
    content = content._config;
  }
  api.page_tmpl.update(id, content, function(err, data) {
    _onload = false;
    cb(null);
  });
}

function page_tmpl_delete(id, cb) {
  _onload = true;
  api.page_tmpl.delete(id, function(err, data) {
    _onload = false;
    if (!err) {
      _.remove(_menus[1].submenu, {
        "id": id
      });
    }
    cb(null);
  });
}

function page_tmpl_create(content, cb) {
  _onload = true;
  api.page_tmpl.create(content, function(err, data) {
    _onload = false;
    if (!err) {
      data.type = "page_tmpl";
      data.submenu = util.toArray(_schemas.page_tmpl);
      _menus[1].submenu.push(data);
    }
    cb(null);
  });
}

/** 
 * Page
 */
function page_get(id, field, cb) {
  _onload = true;
  api.page.get(id, function(err, data) {
    _onload = false;
    _formatSelectedContent(data, "page", field, "Pages");
    cb(null);
  });
}

function page_update(id, content, cb) {
  _onload = true;
  if (content._config) {
    content = content._config;
  }
  api.page.update(id, content, function(err, data) {
    _onload = false;
    cb(null);
  });
}

function page_delete(id, cb) {
  _onload = true;
  api.page.delete(id, function(err, data) {
    _onload = false;
    if (!err) {
      _.remove(_menus[2].submenu, {
        "id": id
      });
    }
    cb(null);
  });
}

function page_create(content, cb) {
  _onload = true;
  api.page.create(content, function(err, data) {
    _onload = false;
    if (!err) {
      data.type = "page";
      data.name = data.title;
      data.submenu = util.toArray(_schemas.page);
      _menus[2].submenu.push(data);
    }
    cb(null);
  });
}

function page_toggle_publish(id, cb) {
  var status;
  var target = _.find(_menus[2].submenu, _.matchesProperty("id", id));
  if (target) {
    status = !target.publish;
  }
  api.page.update(id, {
    "publish": status
  }, function(err, data) {
    _onload = false;
    if (!err) {
      target.publish = status;
    }
    cb(null);
  });
}


/**
 * Route
 */
function route_get(url, field, cb) {
  _onload = true;
  api.route.get(url, function(err, data) {
    _onload = false;
    var type = "route";
    var schema = _schemas[type][field];
    _selected_content = {};
    _selected_content.id = data.url;
    _selected_content.type = type;
    _selected_content.type_displace_name = "Routes";
    _selected_content.field = field;
    _selected_content.name = data.url;
    _selected_content.mode = schema.mode;
    _selected_content.content_editor = schema.content_editor;
    if (field !== "_config") {
      _selected_content.value = data[field];
    } else {
      _selected_content.value = _.pick(data, schema.fields);
    }
    if (typeof _selected_content.value === "object") {
      _selected_content.value = JSON.stringify(_selected_content.value, null, "  ");
    }

    cb(null);
  });
}

function route_update(url, content, cb) {
  _onload = true;
  if (content._config) {
    try {
      content = JSON.parse(content._config);
    } catch(e) {}
  }
  api.route.update(url, content, function(err, data) {
    _onload = false;
    cb(null);
  });
}

function route_delete(url, cb) {
  _onload = true;
  api.route.delete(url, function(err, data) {
    _onload = false;
    if (!err) {
      _.remove(_menus[3].submenu, {
        "id": url
      });
    }
    cb(null);
  });
}

function route_create(url, content, cb) {
  _onload = true;
  api.route.create(url, content, function(err, data) {
    _onload = false;
    if (!err) {
      console.log(data)
      data.type = "route";
      data.id = data.url
      data.name = data.url
      data.submenu = util.toArray(_schemas.route);
      _menus[3].submenu.push(data);
    }
    cb(null);
  });
}

var ContentStore = _.assign({}, EventEmitter.prototype, {

  getState: function() {
    return _onload;
  },

  getMenus: function() {
    return _menus;
  },

  getSelectedContent: function() {
    return _selected_content;
  },

  emitChange: function(err) {
    if (!err) {
      this.emit(CHANGE_EVENT);
    }
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }


});


// Register callback to handle all updates
AppDispatcher.register(function(action) {
  // console.log("XXX Action:", action);

  switch (action.actionType) {

    // Initialize Editor
    case ContentConstants.EDITOR_INIT:
      initializeEditor(function(err) {
        ContentStore.emitChange();
      });
      break;

      // Theme Template
    case ContentConstants.THEME_TMPL_GET:
      theme_tmpl_get(action.id, action.field, function(err) {
        ContentStore.emitChange();
      });
      break;

    case ContentConstants.THEME_TMPL_UPDATE:
      theme_tmpl_update(action.id, action.content, function(err) {
        ContentStore.emitChange();
      });
      break;

    case ContentConstants.THEME_TMPL_DELETE:
      theme_tmpl_delete(action.id, function(err) {
        ContentStore.emitChange();
      });
      break;

    case ContentConstants.THEME_TMPL_CREATE:
      theme_tmpl_create(action.id, action.content, function(err) {
        ContentStore.emitChange();
      });
      break;

      // Page Template
    case ContentConstants.PAGE_TMPL_GET:
      page_tmpl_get(action.id, action.field, function(err) {
        ContentStore.emitChange();
      });
      break;

    case ContentConstants.PAGE_TMPL_UPDATE:
      page_tmpl_update(action.id, action.content, function(err) {
        ContentStore.emitChange();
      });
      break;

    case ContentConstants.PAGE_TMPL_DELETE:
      page_tmpl_delete(action.id, function(err) {
        ContentStore.emitChange();
      });
      break;

    case ContentConstants.PAGE_TMPL_CREATE:
      page_tmpl_create(action.content, function(err) {
        ContentStore.emitChange();
      });
      break;

      // Page
    case ContentConstants.PAGE_GET:
      page_get(action.id, action.field, function(err) {
        ContentStore.emitChange();
      });
      break;

    case ContentConstants.PAGE_UPDATE:
      page_update(action.id, action.content, function(err) {
        ContentStore.emitChange();
      });
      break;

    case ContentConstants.PAGE_DELETE:
      page_delete(action.id, function(err) {
        ContentStore.emitChange();
      });
      break;

    case ContentConstants.PAGE_CREATE:
      page_create(action.content, function(err) {
        ContentStore.emitChange();
      });
      break;

    case ContentConstants.PAGE_TOGGLE_PUBLISH:
      page_toggle_publish(action.id, function(err) {
        ContentStore.emitChange();
      });
      break;

      // Route    
    case ContentConstants.ROUTE_GET:
      route_get(action.url, action.field, function(err) {
        ContentStore.emitChange();
      });
      break;

    case ContentConstants.ROUTE_UPDATE:
      route_update(action.url, action.content, function(err) {
        ContentStore.emitChange();
      });
      break;

    case ContentConstants.ROUTE_DELETE:
      route_delete(action.url, function(err) {
        ContentStore.emitChange();
      });
      break;

    case ContentConstants.ROUTE_CREATE:
      route_create(action.url, action.content, function(err) {
        ContentStore.emitChange();
      });
      break;

    default:
      // no op
  }
});

module.exports = ContentStore;