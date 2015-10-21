"use strict";

var async = require("async");
var Mill = require("../../mill");

module.exports = function(client) {

  var mill = new Mill(client);

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
      console.log(content)
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

    createMupltiUrls: function(req, res) {
      var page_id = req.params.page_id;
      var urls = req.body.urls;

      async.each(urls, function(url, callback) {
        mill.route.get(url, function(err, data) {
          if (data) {
            callback(new Error("Url", url, "already exist."));
          } else {
            callback(null);
          }
        });
      }, function(err) {
        if (err) {
          res.status(400).send(err);
        } else {

          mill.route.createMupltiUrls(page_id, urls, function(err, data) {
            if (err) {
              res.status(400).send(err);
            } else {
              res.status(200).send("success");
            }
          });

        }
      });

    },

    getUrlsByPageId: function(req, res) {
      var page_id = req.params.page_id;
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
