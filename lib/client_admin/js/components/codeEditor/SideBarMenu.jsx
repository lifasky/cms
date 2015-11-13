"use strict";

var React = require("react");
var ThemeTmplMenu = require("./ThemeTmplMenu.jsx");
var PageTmplMenu = require("./PageTmplMenu.jsx");
var PageMenu = require("./PageMenu.jsx");
var RouteMenu = require("./RouteMenu.jsx");
var ApiMenu = require("./ApiMenu.jsx");
var _ = require("lodash");

var SideBarMenu = React.createClass({
  render: function() {
    var menus = this.props.menus;
    return (
      <div className="sidebar_menu_container">
        <span className="sidebar_menu_title">FOLDERS</span>
        <div className="SideBarMenu">
          <PageMenu item={menus[2]} selectedContent={this.props.selectedContent} />
          <PageTmplMenu item={menus[1]} selectedContent={this.props.selectedContent} />
          <ThemeTmplMenu item={menus[0]} selectedContent={this.props.selectedContent} />
          <RouteMenu item={menus[3]} selectedContent={this.props.selectedContent} />
          <ApiMenu item={menus[4]} selectedContent={this.props.selectedContent} />
        </div>
      </div>
    );
  }
});

module.exports = SideBarMenu;
