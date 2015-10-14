"use strict";

var async = require("async");
var Mill = require("../store");

module.exports = function(client) {

  var mill = new Mill(client);

  return {
    get: function(req, res) {
      var query = req.query;
      if (query.id) {
        var id = query.id;
        mill.user.get(id, function(err, data) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.status(200).send(data);
          }
        });
      } else {
        mill.user.getall(function(err, data) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.status(200).send(data);
          }
        });
      }
    },

    getall: function(req, res) {
      mill.user.getall(function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    },

    create: function(req, res) {
      var id = req.body.id;
      var user = req.body.user
      mill.user.create(id, user, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    },

    update: function(req, res) {
      var id = req.body.id;
      var content = req.body.content;
      mill.user.update(id, content, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    },

    delete: function(req, res) {
      var id = req.body.id;
      mill.user.delete(id, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send("success");
        }
      });
    },

    auth: function(req, res) {
      var id = req.body.id;
      var password = req.body.password;
      mill.user.auth(id, password, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    }

  };

};
