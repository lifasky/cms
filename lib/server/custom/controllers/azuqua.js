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
      var page_id = obj.page_id;
      var alais = obj.alais;
      var accessKey = obj.accessKey;
      var accessSecret = obj.accessSecret;
      var data = obj.data;
      var body;
      var azuqua = new Azuqua(accessKey, accessSecret);
      azuqua.invoke(alais, data, true, function(err, resp) {
        if (!err) {
          body = resp.data || {};
          mill.render(page_id, body, cb); // cb(err, html)
        } else {
          cb(err);
        }
      });
    },

    postLoad_invokeFLO: function(obj, cb) {
      var self = this;
      var alais = obj.alais;
      var accessKey = obj.accessKey;
      var accessSecret = obj.accessSecret;
      var data = obj.data;
      var body;
      var azuqua = new Azuqua(accessKey, accessSecret);
      azuqua.invoke(alais, data, true, function(err, resp) {
        if (!err) {
          body = resp.data || {};
          cb(null, body);
        } else {
          cb(err);
        }
      });
    }

  };

};
