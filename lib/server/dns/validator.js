"use strict";

var form = require("express-form"),
    filter = form.filter,
    field = form.field,
    validate = form.validate;

form.configure({
  flashErrors: false
});

RegExp.prototype.toJSON = function() { return this.source; };


var customFilters = {
  stripNonNumeric: function(value){
    if(value){
      return value.replace(/[^0-9]+/g, "");
    }else{
      return value;
    }
  }
};

function applyFilters(filters, field){
  filters.forEach(function(_filter){
    var fn = customFilters[_filter];
    if(typeof fn === "function"){
      field.custom(fn);
    }
  });
}

module.exports = function(rules){
  var _rules = [];
  for(var key in rules){
    var r = rules[key];
    var field = form.field(key, r.label);
    if(r.trim !== false){
      field.trim();
    }
    if(r.filters){
      applyFilters(r.filters, field);
    }
    if(r.required){
      field.required("", r.error);
    }
    if(r.maxLength){
      field.maxLength(r.maxLength);
    }
    if(r.minLength){
      field.minLength(r.minLength);
    }
    if(r.email){
      field.isEmail();
    }
    if(r.equals){
      field.equals(r.equals, r.error);
    }
    if(r.regex){
      var rgx = new RegExp(r.regex);
      field.is(rgx, r.error);
    }


    _rules.push(field);
  }
  return form.apply(null, _rules);
};


