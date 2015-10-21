"use strict";

var Mill = require("../../mill");

module.exports = function(client) {

  var mill = new Mill(client);

  return {
    get: function(req, res) {
      var id = req.params.id;
      mill.theme_tmpl.get(id, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    },

    getall: function(req, res) {
      mill.theme_tmpl.getall(function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    },

    create: function(req, res) {
      var id = req.body.id;
      var content = req.body.content;
      mill.theme_tmpl.create(id, content, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    },

    delete: function(req, res) {
      var id = req.params.id;
      mill.theme_tmpl.delete(id, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send("success");
        }
      });
    },

    update: function(req, res) {
      var id = req.params.id;
      var content = req.body.content;
      mill.theme_tmpl.update(id, content, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    },

    updateContent: function(req, res) {
      var id = req.params.id;
      var content = req.body.content;
      mill.theme_tmpl.updateContent(id, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    },

    keys: function(req, res) {
      mill.theme_tmpl.keys(function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    },

    list: function(req, res) {
      mill.theme_tmpl.list(function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    }

  };

};
