"use strict";

var React = require("react");
var ExtendMenu = require("../widget/ExtendMenu.jsx");
var _ = require("lodash");
var ContentActions = require("../../actions/Content.actions");

var ApiMenu = React.createClass({
  render: function() {
    var item = this.props.item || {};
    var selectedContent = this.props.selectedContent || {};
    var child = [];
    child = _.map(item.submenu, function(n) {
      return <LevelThreeItem key={n.id} item={n} />;
    });
    var isFocusOn
    child = _.map(item.submenu, function(n) {
      if (selectedContent.type === "api" && selectedContent.id === n.id) {
        isFocusOn = selectedContent;
      } else {
        isFocusOn = null;
      }
      return <LevelTwoItem key={n.id} item={n} isFocusOn={isFocusOn}/>;
    });
    return (
      <div className="editor_menu_item editor_menu_level_1 editor_menu_level_1_api">
        <i 
          onClick={this._onCreate}
          className="fa fa-plus-circle pull-right"
        ></i>
        <ExtendMenu 
          displace_name={item.displace_name}
          child={child}
        />
      </div>
    );
  },

  _onCreate: function() {
    var name = prompt("Name of the new Api.");
    if (!name) {
      name = "New Api";
    }
    ContentActions.api.create(name);
  }

});

var LevelTwoItem = React.createClass({
  
  render: function() {
    var self = this;
    var item = this.props.item || {};
    var child = [];
    var isFocusOn;
    child = _.map(item.submenu, function(n) {
      if (self.props.isFocusOn && self.props.isFocusOn.field === n._key) {
        isFocusOn = true;
      } else {
        isFocusOn = false;
      }
      n.id = item.id;
      return <LevelThreeItem key={n._key} item={n} isFocusOn={isFocusOn}/>;
    });
    return (
      <div className="editor_menu_item editor_menu_level_2 editor_menu_level_2_api">
        <i className="fa fa-trash-o pull-right" onClick={this._onDelete}></i>
        <i className={"fa fa-power-off pull-right " + (item.publish ? "active" : " ")} onClick={this._togglePublish}></i>
        <ExtendMenu 
          displace_name={item.name}
          child={child}
        />
      </div>
    );
  },

  _onDelete: function() {
    var id = this.props.item.id;
    var c = confirm("Are you sure?");
    if (c) {
      ContentActions.api.delete(id);
    }
  },

  _onReview: function() {
    var id = this.props.item.id;
  },

  _togglePublish: function() {
    var id = this.props.item.id;
    ContentActions.api.togglePublish(id);
  },

});

var LevelThreeItem = React.createClass({
  render: function() {
    var item = this.props.item || {};
    var displace_name = item._key + (item.mode ? "." + item.mode : "");
    return (
      <div 
        className={"editor_menu_item editor_menu_level_3 editor_menu_level_3_api " + (this.props.isFocusOn ? "active" : " ")} 
        onClick={this._onRender}
      >
        <span>{displace_name}</span>
      </div>
    );
  },

  _onRender: function() {
    var id = this.props.item.id;
    var field = this.props.item._key;
    ContentActions.api.get(id, field);
  }

});


module.exports = ApiMenu;
