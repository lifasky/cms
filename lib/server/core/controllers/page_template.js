"use strict";

var Mill = require("../../mill");

module.exports = function(client, root) {

  var mill = new Mill(client, root);

  return {
    get: function(req, res) {
      var id = req.query.id;
      mill.page_tmpl.get(id, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    },

    getall: function(req, res) {
      mill.page_tmpl.getall(function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    },

    create: function(req, res) {
      var content = req.body.content;
      mill.page_tmpl.create(content, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    },

    delete: function(req, res) {
      var id = req.body.id;
      mill.page_tmpl.delete(id, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send("success");
        }
      });
    },

    update: function(req, res) {
      var id = req.body.id;
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
      var id = req.body.id;
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
    },

    list: function(req, res) {
      mill.page_tmpl.list(function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    }

  };

};
