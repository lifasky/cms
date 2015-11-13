"use strict";

var React = require("react");
var ExtendMenu = require("../widget/ExtendMenu.jsx");
var _ = require("lodash");
var ContentActions = require("../../actions/Content.actions");

var PageTmplMenu = React.createClass({
  render: function() {
    var item = this.props.item || {};
    var selectedContent = this.props.selectedContent || {};
    var child = [];
    var isFocusOn
    child = _.map(item.submenu, function(n) {
      if (selectedContent.type === "page_tmpl" && selectedContent.id === n.id) {
        isFocusOn = selectedContent;
      } else {
        isFocusOn = null;
      }
      return <LevelTwoItem key={n.id} item={n} isFocusOn={isFocusOn}/>;
    });
    return (
      <div className="editor_menu_item editor_menu_level_1 editor_menu_level_1_page_tmpl">
        <i 
          onClick={this._onCreate}
          className="fa fa-plus-circle pull-right"
        ></i>
        <ExtendMenu
          isExtend={true} 
          displace_name={item.displace_name}
          child={child}
        />
      </div>
    );
  },

  _onCreate: function() {
    var page_tmpl_id = prompt("ID of Page Template.");
    if (page_tmpl_id) {
      ContentActions.page_tmpl.create(page_tmpl_id);
    }
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
      <div className="editor_menu_item editor_menu_level_2 editor_menu_level_2_page_tmpl">
        <i className="fa fa-trash-o pull-right" onClick={this._onDelete}></i>
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
      ContentActions.page_tmpl.delete(id);
    }
  }

});

var LevelThreeItem = React.createClass({
  render: function() {
    var item = this.props.item || {};
    var displace_name = item._key + (item.mode ? "." + item.mode : "");
    return (
      <div 
        className={"editor_menu_item editor_menu_level_3 editor_menu_level_3_page_tmpl " + (this.props.isFocusOn ? "active" : " ")} 
        onClick={this._onRender}
      >
        <span>{displace_name}</span>
      </div>
    );
  },

  _onRender: function() {
    var id = this.props.item.id;
    var field = this.props.item._key;
    ContentActions.page_tmpl.get(id, field);
  }

});

module.exports = PageTmplMenu;
