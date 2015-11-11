"use strict";

var async = require("async");
var Mill = require("../../mill");

module.exports = function(client, root) {

  var mill = new Mill(client, root);

  return {
    get: function(req, res) {
      var url = req.query.url;
      mill.route.get(url, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    },

    getall: function(req, res) {
      mill.route.getall(function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    },

    create: function(req, res) {
      var url = req.body.url;
      var content = req.body.content
      mill.route.create(url, content, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    },

    update: function(req, res) {
      var url = req.body.url;
      var content = req.body.content;
      mill.route.update(url, content, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    },

    delete: function(req, res) {
      var url = req.body.url;
      mill.route.delete(url, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send("success");
        }
      });
    },

    getUrlsByPageId: function(req, res) {
      var page_id = req.query.page_id;
      mill.route.getUrlsByPageId(page_id, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    }

  };

};
