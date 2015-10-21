"use strict";

var Mill = require("../store");

module.exports = function(client) {

  var mill = new Mill(client);

  return {
    get: function(req, res) {
      var id = req.params.id;
      mill.page_tmpl.get(id, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    },

    create: function(req, res) {
      var tmpl = req.body.tmpl;
      mill.page_tmpl.create(tmpl, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    },

    delete: function(req, res) {
      var id = req.params.id;
      mill.page_tmpl.delete(id, function(err, data) {
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
      mill.page_tmpl.update(id, content, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    },

    updateSchema: function(req, res) {
      var id = req.params.id;
      var schema = req.body.schema;
      mill.page_tmpl.updateSchema(id, schema, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    },

    keys: function(req, res) {
      mill.page_tmpl.keys(function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    }
  };

};
