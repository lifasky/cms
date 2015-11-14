"use strict";

var React = require("react");
var _ = require("lodash");
var ContentStore = require("../../stores/Content.stores");
var UrlPanel = require("./UrlPanel.jsx");

function getHint(key) {
  switch (key) {
    case "title":
      return <label className="hint"> &nbsp; Displayed in Browser title bar and in search results. Make it more descriptive. Less than 70 characters are recommended.</label>;
    case "keywords":
      return <label className="hint"> &nbsp; Separate keywords with comma. <strong>Example</strong>: <i>smartsheet, http, zendesk</i></label>;
    case "description":
      return <label className="hint"> &nbsp; Less than 150 characters are recommended.</label>
  }
}

var ConfigEditor = React.createClass({

  render: function() {
    var content = this.props.content;
    // only developer allow to modify actions;
    delete content.requiedPreload;
    delete content.controller;
    delete content.action;
    delete content.middleware;
    delete content.params;
    return (
      <div>
        <Section content={content} handleChange={this._handleChange} />
      </div>
    );
  },

  _handleChange: function(content) {
    this.props.handleChange(content);
  }

});

var Section = React.createClass({
  render: function() {
    var self = this;
    var content = this.props.content;
    return (
      <div>
        <SectionItem content={content} handleChange={self._handleChange} />
      </div>
    );
  },

  _handleChange: function(obj) {
    var content = this.props.content;
    _.assign(content, obj);
    this.props.handleChange(content);
  }

});

var SectionItem = React.createClass({
  render: function() {
    var self = this;
    var content = this.props.content;
    content = _.map(content, function(n, key) {
      switch(key) {
        case "description":
          return (
            <TextAreaItem clo={12} key={key} label={key} value={n} handleChange={self._handleChange} />
          );
        case "page_tmpl_id":
          return (
            <PageTmplId key={key} label={key} value={n} handleChange={self._handleChange} />
          );
        case "urls":
          return (
            <UrlPanel key={key} page_id={content.id} urls={n} />
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
    var content = this.props.content;
    _.assign(content, obj);
    this.props.handleChange(content);
  }

});


var InputTextItem = React.createClass({
  render: function() {
    var num = this.props.num || 12;
    var label = this.props.label;
    var value = this.props.value;
    var hint;
    if (getHint(label)) {
      hint = getHint(label);
    }
    return (
      <div className={"col-lg-" + num + " col-md-" + num + " col-sm-" + num + " col-xs-" + num}>
        <div className="form-group">
          <label htmlFor={label}>{label}</label>
          {hint}
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
    var hint;
    if (getHint("description")) {
      hint = <label className="hint">{getHint("description")}</label>;
    }
    return (
      <div className={"col-lg-" + num + " col-md-" + num + " col-sm-" + num + " col-xs-" + num}>
        <div className="form-group">
          <label htmlFor="description">description</label>
          {hint}
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

var PageTmplId = React.createClass({
  getInitialState: function() {
    return {
      menus: ContentStore.getMenus() || []
    };
  },

  render: function() {
    var self = this;
    var page_tmpl = this.state.menus[1] || [];
    var page_tmpl_id = this.props.value;
    var display = "Dropdown";
    _.forEach(page_tmpl.submenu, function(n, key) {
      if (n.id === page_tmpl_id) {
        display = n.name;
        n.selected = true;
      } else {
        n.selected = false;
      }
    });
    return (
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <div className="box_page_tmpl_dropdown">
          <label>{page_tmpl.displace_name}</label>
          <div className="dropdown">
            <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
              {display}
              <span className="caret"></span>
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
              {
                _.map(page_tmpl.submenu, function(n, key) {
                  return <PageTmplIdItem key={key} page_tmpl={n} handleClick={self._onChange} />
                })
              }
            </ul>
          </div>
        </div>
        <br/>
      </div>
    );
  },

  _onChange: function(id) {
    var obj = {"page_tmpl_id": id};
    this.props.handleChange(obj);
  }

});

var PageTmplIdItem = React.createClass({
  render: function() {
    var page_tmpl = this.props.page_tmpl;
    return (
      <li onClick={this._onClick}>
        {page_tmpl.selected ?
          <i className="fa fa-check"></i>
          :
          null
        }
        <label>{page_tmpl.name}</label>
      </li>
    );
  },

  _onClick: function() {
    this.props.handleClick(this.props.page_tmpl.id);
  }

});

module.exports = ConfigEditor;
