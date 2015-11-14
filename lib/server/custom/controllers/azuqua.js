"use strict";

var Mill = require("../../mill");
var Azuqua = require("azuqua");

module.exports = function(client, root) {

  var mill = new Mill(client, root);

  return {

    customData: function(obj, cb) { // TEMP: for test
      mill.render(obj.page_id, obj.body, cb);
    },
    
    /*
    
     {
      "controller": "azuqua",
      "action": "preLoad_invokeFLO",
      "middleware": null,
      "params": {
        "alias": "4e06d2140dbbc6beac7a240b50f4aea0",
        "accessKey": "",
        "accessSecret": ""
      }
     }

    */
    preLoad_invokeFLO: function(obj, cb) {
      var self = this;
      var page_id = obj.routeConfig.page_id;
      var alias = obj.routeConfig.params.alias;
      var accessKey = obj.routeConfig.params.accessKey;
      var accessSecret = obj.routeConfig.params.accessSecret;
      var data = obj;
      delete data.routeConfig;
      var body = {};
      var azuqua = new Azuqua(accessKey, accessSecret);
      azuqua.invoke(alias, data, true, function(err, resp) {
        if (!err) {
          body = resp.data || {};
          body.success = true;
        } else {
          body.error = err.toString();
          body.success = false;
        }
        mill.render(page_id, body, cb); // cb(err, html)
      });
    },

    postLoad_invokeFLO: function(obj, cb) {
      var self = this;
      var alias = obj.routeConfig.params.alias;
      var accessKey = obj.routeConfig.params.accessKey;
      var accessSecret = obj.routeConfig.params.accessSecret;
      var data = obj;
      delete data.routeConfig;
      var body;
      var azuqua = new Azuqua(accessKey, accessSecret);
      azuqua.invoke(alias, data, true, function(err, resp) {
        if (!err) {
          body = resp.data || {};
          cb(null, body);
        } else {
          cb(err.toString());
        }
      });
    }

  };

};
