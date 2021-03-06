"use strict";

var React = require("react");
var ExtendMenu = require("../widget/ExtendMenu.jsx");
var _ = require("lodash");
var ContentActions = require("../../actions/Content.actions");

var ThemeTmplMenu = React.createClass({
  render: function() {
    var item = this.props.item || {};
    var selectedContent = this.props.selectedContent || {};
    var child = [];
    var isFocusOn;
    child = _.map(item.submenu, function(n) {
      if (selectedContent.type === "theme_tmpl" && selectedContent.id === n.id) {
        isFocusOn = selectedContent;
      } else {
        isFocusOn = null;
      }
      return <LevelTwoItem key={n.id} item={n} isFocusOn={isFocusOn}/>;
    });
    return (
      <div className="editor_menu_item editor_menu_level_1 editor_menu_level_1_theme_tmpl">
        <ExtendMenu
          displace_name={item.displace_name}
          child={child}
        />
      </div>
    );
  },

  _onCreate: function() {
    var name = prompt("Name of the new Theme Template.");
    if (name) {
      ContentActions.theme_tmpl.create(name);
    }
  }

});

var LevelTwoItem = React.createClass({

  render: function() {
    var self = this;
    var item = this.props.item || {};
    var child = [];
    var isFocusOn
    child = _.map(item.submenu, function(n) {
      if (self.props.isFocusOn && self.props.isFocusOn.field === n._key) {
        isFocusOn = true;
      } else {
        isFocusOn = false;
      }
      n.id = item.id;
      if (n._key === "content") {
        return <LevelThreeItem key={n._key} item={n} isFocusOn={isFocusOn}/>;
      }
    });
    return (
      <div className="editor_menu_item editor_menu_level_2 editor_menu_level_2_theme_tmpl">
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
      ContentActions.theme_tmpl.delete(id);
    }
  }

});

var LevelThreeItem = React.createClass({
  render: function() {
    var item = this.props.item || {};
    return (
      <div 
        className={"editor_menu_item editor_menu_level_3 editor_menu_level_3_theme_tmpl " + (this.props.isFocusOn ? "active" : " ")} 
        onClick={this._onRender}
      >
        <span>{item._key}</span>
      </div>
    );
  },

  _onRender: function() {
    var id = this.props.item.id;
    var field = this.props.item._key;
    ContentActions.theme_tmpl.get(id, field);
  }

});

module.exports = ThemeTmplMenu;
