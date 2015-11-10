"use strict";

var $ = require("jquery");

function parseError(xhr) {
  var error = {};
  error.status = xhr.status;
  try {
    var j = JSON.parse(xhr.responseText);
    if (j) {
      error.message = j.error || xhr.responseText || xhr.statusText;
    }
  } catch (e) {
    error.message = xhr.statusText;
  }
  return error;
}

function execute(url, method, data, cb) {
  var payload = null;
  if (data) {
    payload = JSON.stringify(data);
  }
  return $.ajax({
      url: url,
      type: method,
      dataType: "json", // json
      contentType: "application/json; charset=utf-8",
      data: payload,
      async: true,
      cache: false,
      timeout: 120000 //2min
    })
    .done(function(res, status, req) {
      if (status === 0 || status >= 400) {
        console.log("ajax err: ", res);
        cb({
          error: res
        }, null);
      } else {
        // console.log("ajax success: ", res);
        cb(null, res);
      }
    })
    .fail(function(xhr) {
      var err = parseError(xhr);
      if (status !== 0 && err.status < 400) {
        // console.log("ajax success: ", err);
        cb(null, err);
      } else {
        console.log("ajax err: ", err);
        cb(err);
      }
    });
}

module.exports = {
  get: function(url, data, cb) {
    execute(url, "GET", data, cb);
  },
  post: function(url, data, cb) {
    execute(url, "POST", data, cb);
  },
  put: function(url, data, cb) {
    execute(url, "PUT", data, cb);
  },
  delete: function(url, data, cb) {
    execute(url, "DELETE", data, cb);
  }
};
