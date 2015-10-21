"use strict";

var AppDispatcher = require("../dispatcher/App.dispatcher");
var ContentConstants = require("../constants/Content.constants");

var ContentActions = {

  editor: {
    init: function() {
      AppDispatcher.dispatch({
        "actionType": ContentConstants.EDITOR_INIT
      });
    }
  },

  theme_tmpl: {

    get: function(id, field) {
      AppDispatcher.dispatch({
        "actionType": ContentConstants.THEME_TMPL_GET,
        "id": id,
        "field": field
      });
    },

    create: function(id, name) {
      var content = {
        "name": name
      };
      AppDispatcher.dispatch({
        "actionType": ContentConstants.THEME_TMPL_CREATE,
        "id": id,
        "content": content
      });
    },

    update: function(id, content) {
      AppDispatcher.dispatch({
        "actionType": ContentConstants.THEME_TMPL_UPDATE,
        "id": id,
        "content": content
      });
    },

    delete: function(id) {
      AppDispatcher.dispatch({
        "actionType": ContentConstants.THEME_TMPL_DELETE,
        "id": id
      });
    }

  },

  page_tmpl: {

    get: function(id, field) {
      AppDispatcher.dispatch({
        "actionType": ContentConstants.PAGE_TMPL_GET,
        "id": id,
        "field": field
      });
    },

    create: function(name) {
      var content = {
        "name": name
      };
      AppDispatcher.dispatch({
        "actionType": ContentConstants.PAGE_TMPL_CREATE,
        "content": content
      });
    },

    update: function(id, content) {
      AppDispatcher.dispatch({
        "actionType": ContentConstants.PAGE_TMPL_UPDATE,
        "id": id,
        "content": content
      });
    },

    delete: function(id) {
      AppDispatcher.dispatch({
        "actionType": ContentConstants.PAGE_TMPL_DELETE,
        "id": id
      });
    }

  },

  page: {

    get: function(id, field) {
      AppDispatcher.dispatch({
        "actionType": ContentConstants.PAGE_GET,
        "id": id,
        "field": field
      });
    },

    create: function(title) {
      var content = {
        "title": title
      };
      AppDispatcher.dispatch({
        "actionType": ContentConstants.PAGE_CREATE,
        "content": content
      });
    },

    update: function(id, content) {
      AppDispatcher.dispatch({
        "actionType": ContentConstants.PAGE_UPDATE,
        "id": id,
        "content": content
      });
    },

    delete: function(id) {
      AppDispatcher.dispatch({
        "actionType": ContentConstants.PAGE_DELETE,
        "id": id
      });
    },

    togglePublish: function(id) {
      AppDispatcher.dispatch({
        "actionType": ContentConstants.PAGE_TOGGLE_PUBLISH,
        "id": id
      });
    }

  },

  route: {

    get: function(url, field) {
      AppDispatcher.dispatch({
        "actionType": ContentConstants.ROUTE_GET,
        "url": url,
        "field": field
      });
    },

    create: function(url) {
      var content = {
        "page_id": null
      };
      AppDispatcher.dispatch({
        "actionType": ContentConstants.ROUTE_CREATE,
        "url": url,
        "content": content
      });
    },

    update: function(url, content) {
      AppDispatcher.dispatch({
        "actionType": ContentConstants.ROUTE_UPDATE,
        "url": url,
        "content": content
      });
    },

    delete: function(url) {
      AppDispatcher.dispatch({
        "actionType": ContentConstants.ROUTE_DELETE,
        "url": url
      });
    }

  }

};

module.exports = ContentActions;
