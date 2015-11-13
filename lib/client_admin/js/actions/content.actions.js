"use strict";

var AppDispatcher = require("../dispatcher/App.dispatcher");
var ContentConstants = require("../constants/Content.constants");

var ContentActions = {

  init: {
    editor: function() {
      AppDispatcher.dispatch({
        "actionType": ContentConstants.INIT_EDITOR
      });
    },

    user_admin: function() {
      AppDispatcher.dispatch({
        "actionType": ContentConstants.INIT_USER_ADMIN
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

    create: function(name) {
      var content = {
        "name": name
      };
      AppDispatcher.dispatch({
        "actionType": ContentConstants.THEME_TMPL_CREATE,
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

    create: function(page_tmpl_id) {
      var content = {
        "page_tmpl_id": page_tmpl_id,
        "title": "New Page"
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

  api: {

    get: function(id, field) {
      AppDispatcher.dispatch({
        "actionType": ContentConstants.API_GET,
        "id": id,
        "field": field
      });
    },

    create: function(name) {
      var content = {
        "name": name
      };
      AppDispatcher.dispatch({
        "actionType": ContentConstants.API_CREATE,
        "content": content
      });
    },

    update: function(id, content) {
      AppDispatcher.dispatch({
        "actionType": ContentConstants.API_UPDATE,
        "id": id,
        "content": content
      });
    },

    delete: function(id) {
      AppDispatcher.dispatch({
        "actionType": ContentConstants.API_DELETE,
        "id": id
      });
    },

    togglePublish: function(id) {
      AppDispatcher.dispatch({
        "actionType": ContentConstants.API_TOGGLE_PUBLISH,
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

    create: function(url, page_id) {
      var content = {
        "page_id": page_id
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

  },

  user: {

    getall: function(field) {
      AppDispatcher.dispatch({
        "actionType": ContentConstants.USER_GET_ALL
      });
    },

    create: function(id) {
      var content = {
        "id": id
      };
      AppDispatcher.dispatch({
        "actionType": ContentConstants.USER_CREATE,
        "id": id
      });
    },

    update: function(id, content) {
      AppDispatcher.dispatch({
        "actionType": ContentConstants.USER_UPDATE,
        "id": id,
        "content": content
      });
    },

    delete: function(id) {
      AppDispatcher.dispatch({
        "actionType": ContentConstants.USER_DELETE,
        "id": id
      });
    }

  }

};

module.exports = ContentActions;
