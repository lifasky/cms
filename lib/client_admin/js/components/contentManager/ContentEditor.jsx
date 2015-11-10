"use strict";

var React = require("react");
var _ = require("lodash");

function getCloNum(len) {
  switch (len) {
    case (1):
      return 12;
    case (2):
      return 6;
    case (3):
      return 4;
    case (4):
      return 3;
    default:
      return 3;
  }
}

var ContentEditor = React.createClass({

  render: function() {
    var content = this.props.content;
    if (typeof content !== "object") {
      try {
        content = JSON.parse(content);
      } catch(e) {}
    }
    if (content && !content[0]) {
      content = [content];
    }
    return (
      <div>
        <Section content={content} handleChange={this._handleChange} />
      </div>
    );
  },

  _handleChange: function(content) {
    var old_content = this.props.content;
    var isObject = true;
    if (typeof old_content !== "object") {
      try {
        old_content = JSON.parse(old_content);
        isObject = false;
      } catch(e) {}
    }
    if (old_content && !old_content[0]) {
      content = content[0];
    }
    if (!isObject) {
      content = JSON.stringify(content);
    }
    this.props.handleChange(content);
  }

});

var Section = React.createClass({
  render: function() {
    var self = this;
    var content = this.props.content;
    content = _.map(content, function(n, key) {
      return <SectionItem key={key} index={key} content={n} handleChange={self._handleChange} />;
    });
    return (
      <div>
        {content}
      </div>
    );
  },

  _handleChange: function(index, obj) {
    var content = this.props.content;
    _.assign(content[index], obj);
    this.props.handleChange(content);
  }

});

var SectionItem = React.createClass({
  render: function() {
    var self = this;
    var content = this.props.content;
    content = _.map(content, function(n, key) {
      switch(key) {
        case "buckets":
          return (<Bucket key={key} content={n} handleChange={self._handleChange} />);
        case "long_description":
          return (
            <TextAreaItem clo={12} key={key} label={key} value={n} handleChange={self._handleChange} />
          );
        default:
          return (
            <InputTextItem clo={12} key={key} label={key} value={n} handleChange={self._handleChange} />
          );
      }
    });
    return (
      <div className="box-section">
        <div className="row">
          {content}
        </div>
      </div>
    );
  },

  _handleChange: function(obj) {
    var index = this.props.index;
    var content = this.props.content;
    _.assign(content, obj);
    this.props.handleChange(index, content);
  }

});

var Bucket = React.createClass({
  render: function() {
    var self = this;
    var content = this.props.content;
    var num = getCloNum(content.length);
    content = _.map(content, function(n, key) {
      return (
        <BucketItem key={key} index={key} clo={num} content={n} handleChange={self._handleChange} />
      );
    });
    return (
      <div className="row">
        {content}
      </div>
    );
  },

  _handleChange: function(index, obj) {
    var content = this.props.content;
    _.assign(content[index], obj);
    this.props.handleChange(index, {"buckets": content});
  }

});

var BucketItem = React.createClass({
  render: function() {
    var self = this;
    var num = this.props.clo || 12;
    var content = this.props.content;
    return (
      <div className={"col-lg-" + num + " col-md-" + num + " col-sm-" + num + " col-xs-" + num}>
        <div className="box-bucket">
          <SectionItem content={content} handleChange={self._handleChange} />;
        </div>
      </div>
    );
  },

  _handleChange: function(obj) {
    var index = this.props.index;
    var content = this.props.content;
    _.assign(content, obj);
    this.props.handleChange(index, content);
  }

});

var InputTextItem = React.createClass({
  render: function() {
    var num = this.props.num || 12;
    var label = this.props.label;
    var value = this.props.value;
    return (
      <div className={"col-lg-" + num + " col-md-" + num + " col-sm-" + num + " col-xs-" + num}>
        <div className="form-group">
          <label htmlFor={label}>{label}</label>
          <input 
            type="text" 
            className="form-control" 
            name={label} 
            value={value} 
            ref="textInput"
            onChange={this._onChange} 
            readOnly={label==="id"}
          />
        </div>
      </div>
    );
  },

  _onChange: function() {
    var textInput = this.refs.textInput.getDOMNode().value;
    var obj = {};
    obj[this.props.label] = textInput;
    this.props.handleChange(obj);
  }

});

var TextAreaItem = React.createClass({
  render: function() {
    var num = this.props.num || 12;
    var value = this.props.value;
    return (
      <div className={"col-lg-" + num + " col-md-" + num + " col-sm-" + num + " col-xs-" + num}>
        <div className="form-group">
          <label htmlFor="description">description</label>
          <textarea 
            className="form-control" 
            rows="3" value={value}
            ref="textAreaInput"
            onChange={this._onChange} 
          />
        </div>
      </div>
    );
  },

  _onChange: function() {
    var textAreaInput = this.refs.textAreaInput.getDOMNode().value;
    var obj = {};
    obj[this.props.label] = textAreaInput;
    this.props.handleChange(obj);
  }

});

module.exports = ContentEditor;
