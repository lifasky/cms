"use strict";

var React = require("react");
var ThemeTmplMenu = require("./ThemeTmplMenu.jsx");
var PageTmplMenu = require("./PageTmplMenu.jsx");
var PageMenu = require("./PageMenu.jsx");
var _ = require("lodash");

var SideBarMenu = React.createClass({
  render: function() {
    var menus = this.props.menus;
    return (
      <div>
        <span>CATEGORIES</span>
        <div className="SideBarMenu">
          <PageMenu item={menus[2]} selectedContent={this.props.selectedContent} />
          <ThemeTmplMenu item={menus[0]} selectedContent={this.props.selectedContent} />
        </div>
      </div>
    );
  }
});

module.exports = SideBarMenu;
