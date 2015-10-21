"use strict";

var Mill = require("../store");

module.exports = function(client) {

  var mill = new Mill(client);

  return {

    show: function(req, res) {
      var path = req.path;
      mill.show(path, function(err, html) {
        if (!err) {
          res.send(html);
        } else {
          var page_id = "404";
          mill.render(page_id, {"log": err.toString()}, function(err, html) {
            if (!err) {
              res.send(html);
            } else {
              res.send(err.toString());
            }
          });
        }
      });
    },

    get: function(req, res) {
      var id = req.params.id;
      mill.page.get(id, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    },

    search: function(req, res) {
      var query = req.query;
      if (query.page_tmpl_id) {
        var page_tmpl_id = query.page_tmpl_id;
        mill.page.getPagesByPageTmpl(page_tmpl_id, function(err, data) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.status(200).send(data);
          }
        });
      } else {
        mill.page.getall(function(err, data) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.status(200).send(data);
          }
        });
      }
    },

    create: function(req, res) {
      var content = req.body.content;
      mill.page.create(content, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    },

    delete: function(req, res) {
      var id = req.params.id;
      mill.page.delete(id, function(err, data) {
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
      mill.page.update(id, content, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    },

    getPagesByPageTmpl: function(req, res) {
      var page_tmpl_id = req.params.id;
      mill.page.getPagesByPageTmpl(page_tmpl_id, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    },

    publish: function(req, res) {
      var id = req.params.id;
      mill.page.publish(id, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send("success");
        }
      });
    },

    unPublish: function(req, res) {
      var id = req.params.id;
      mill.page.unPublish(id, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send("success");
        }
      });
    },

    updateContent: function(req, res) {
      var id = req.params.id;
      var content = req.body.content;
      mill.page.update(id, content, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    }

  };

};
