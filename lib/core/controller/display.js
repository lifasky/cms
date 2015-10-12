"use strict";

var Mill = require("../mill");

module.exports = function(client, middleware) {

  var mill = new Mill(client);

  return function(req, res, next) {
    var path = req.path;
    console.log("****** page rednering --> started ******");
    mill.render(path, function(err, html) {
      if (!err) {
        res.send(html);
      } else {
        res.send(err);
      }
      console.log("****** page rednering --> ended ******");
    });
  };

};
