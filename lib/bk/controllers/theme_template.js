"use strict";

var Mill = require("../store");

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

    create: function(req, res) {
      var tmpl = req.body.templ;
      mill.theme_tmpl.create(function(err, data) {
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
    }

  };

};
