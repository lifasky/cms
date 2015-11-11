"use strict";

var Mill = require("../../mill");

module.exports = function(client, root) {

  var mill = new Mill(client, root);

  return {

    show: function(req, res, next) {
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
              next();
            }
          });
        }
      });
    },

    get: function(req, res) {
      var id = req.query.id;
      mill.page.get(id, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    },

    getall: function(req, res) {
      mill.page.getall(function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    },

    create: function(req, res) {
      var content = req.body.content;
      mill.newPage(content, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    },

    delete: function(req, res) {
      var id = req.body.id;
      mill.page.delete(id, function(err, data) {
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
      mill.page.update(id, content, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    },

    getPagesByPageTmpl: function(req, res) {
      var page_tmpl_id = req.body.page_tmpl_id;
      mill.page.getPagesByPageTmpl(page_tmpl_id, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    },

    publish: function(req, res) {
      var id = req.body.id;
      mill.page.publish(id, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send("success");
        }
      });
    },

    unPublish: function(req, res) {
      var id = req.body.id;
      mill.page.unPublish(id, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send("success");
        }
      });
    },

    updateContent: function(req, res) {
      var id = req.body.id;
      var content = req.body.content;
      mill.page.update(id, content, function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    },

    keys: function(req, res) {
      mill.page.keys(function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    },

    list: function(req, res) {
      mill.page.list(function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(200).send(data);
        }
      });
    }

  };

};
