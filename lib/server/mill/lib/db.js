"use strict";

var async = require("async");
var _ = require("lodash");

/**
 * Class DB
 * @class
 */
function DB(client) {
  this.client = client;
}

/**
 * Called after doing asynchronous stuff.
 * @callback DB~Callback
 * @param {error} err
 * @param {object} data
 */

/**
 * Get
 * @param  {string} table
 * @param  {string} key
 * @param  {DB~Callback} cb
 */
DB.prototype.get = function(table, key, cb) {
  if (!table || !key || !cb) {
    return cb(new Error("DB Get: Input Syntax Error"));
  }
  var client = this.client;
  client.hget(table, key, function(err, data) {
    if (err) {
      cb(err);
    } else if (!data) {
      cb(new Error("DB Get: Not Found"));
    } else {
      try {
        data = JSON.parse(data);
      } catch (e) {}
      cb(null, data);
    }
  });
};

/**
 * Get All
 * @param  {string} table
 * @param  {DB~Callback} cb
 */
DB.prototype.getall = function(table, cb) {
  if (!table || !cb) {
    return cb(new Error("DB Getall: Input Syntax Error"));
  }
  var client = this.client;
  client.hgetall(table, function(err, data) {
    if (err) {
      cb(err);
    } else if (!data) {
      cb(new Error("DB Getall: Not Found"));
    } else {
      try {
        _.forEach(data, function(n, key) {
          data[key] = JSON.parse(n);
        });
      } catch (e) {}
      cb(null, data);
    }
  });
};

/**
 * Update
 * @param  {string} table
 * @param  {string} key
 * @param  {object} value
 * @param  {DB~Callback} cb
 */
DB.prototype.update = function(table, key, value, cb) {
  if (!table || !key || !value || !cb) {
    return cb(new Error("DB Update: Input Syntax Error"));
  }
  var client = this.client;
  client.hget(table, key, function(err, data) {
    if (err) {
      cb(err);
    } else if (!data) {
      cb(new Error("DB Update: Not Found"));
    } else {
      try {
        data = JSON.parse(data);
      } catch (e) {}
      data = _.extend(data, value);
      data = JSON.stringify(data);
      client.hset(table, key, data, function(err, data) {
        cb(err, data);
      });
    }
  });
};

/**
 * Create
 * @param  {string} table
 * @param  {string} key
 * @param  {object} value
 * @param  {DB~Callback} cb
 */
DB.prototype.create = function(table, key, value, cb) {
  if (!table || !key || !value || !cb) {
    return cb(new Error("DB Create: Input Syntax Error"));
  }
  var client = this.client;
  client.hget(table, key, function(err, data) {
    if (err) {
      cb(err);
    } else if (data) {
      cb(new Error("DB Create: Already Exist"));
    } else {
      value = JSON.stringify(value);
      client.hset(table, key, value, function(err, data) {
        cb(err, data);
      });
    }
  });
};

/**
 * Delete
 * @param  {string} table
 * @param  {string} key
 * @param  {DB~Callback} cb
 */
DB.prototype.delete = function(table, key, cb) {
  if (!table || !key || !cb) {
    return cb(new Error("DB Delete: Input Syntax Error"));
  }
  var client = this.client;
  client.hget(table, key, function(err, data) {
    if (err) {
      cb(err);
    } else if (!data) {
      cb(new Error("DB Delete: Not Found"));
    } else {
      client.hdel(table, key, function(err, data) {
        cb(err, data);
      });
    }
  });
};

/**
 * Keys
 * @param  {string} table
 * @param  {DB~Callback} cb
 */
DB.prototype.keys = function(table, cb) {
  if (!table || !cb) {
    return cb(new Error("DB Keys: Input Syntax Error"));
  }
  var client = this.client;
  client.hkeys(table, function(err, data) {
    if (err) {
      cb(err);
    } else if (!data) {
      cb(new Error("DB Keys: Not Found"));
    } else {
      cb(null, data);
    }
  });
};

/**
 * Filter
 * Find the all values which match the provided pattern
 * @param  {string} table
 * @param  {object} source
 * @param  {DB~Callback} cb
 */
DB.prototype.filter = function(table, source, cb) {
  if (!table || !cb) {
    return cb(new Error("DB Filter: Input Syntax Error"));
  }
  var client = this.client;
  client.hgetall(table, function(err, data) {
    if (err) {
      cb(err);
    } else if (!data) {
      cb(new Error("DB Filter: Not Found"));
    } else {
      try {
        _.forEach(data, function(n, key) {
          data[key] = JSON.parse(n);
          data[key]._key = key;
        });
      } catch (e) {}
      data = _.filter(data, source);
      cb(null, data);
    }
  });
};

/**
 * Find
 * Find the first value which match the provided pattern
 * @param  {string} table
 * @param  {object} source
 * @param  {DB~Callback} cb
 */
DB.prototype.find = function(table, source, cb) {
  if (!table || !cb) {
    return cb(new Error("DB Find: Input Syntax Error"));
  }
  var client = this.client;
  var result;
  client.hgetall(table, function(err, data) {
    if (err) {
      cb(err);
    } else if (!data) {
      cb(new Error("DB Find: Not Found"));
    } else {
      try {
        _.forEach(data, function(n, key) {
          data[key] = JSON.parse(n);
          data[key]._key = key;
        });
      } catch (e) {}
      data = _.find(data, source);
      cb(null, data);
    }
  });
};

/**
 * FindKey
 * Find the keys which match the provided pattern
 * @param  {string} table
 * @param  {object/function} source
 * @param  {DB~Callback} cb
 */
DB.prototype.findKeys = function(table, source, cb) {
  if (!table || !cb) {
    return cb(new Error("DB FindKey: Input Syntax Error"));
  }
  var client = this.client;
  client.hgetall(table, function(err, data) {
    if (err) {
      cb(err);
    } else if (!data) {
      cb(new Error("DB FindKey: Not Found"));
    } else {
      try {
        _.forEach(data, function(n, key) {
          data[key] = JSON.parse(n);
          data[key]._key = key;
        });
      } catch (e) {}
      data = _.filter(data, source);
      data = _.pluck(data, "_key");
      cb(null, data);
    }
  });
};


module.exports = DB;
