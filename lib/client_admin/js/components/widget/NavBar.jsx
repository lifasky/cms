"use strict";

var React = require("react");
var $ = require("jquery");
var cx = require("classnames");

var NavBar = React.createClass({

  render: function() {
    var focusOn = this.props.focusOn;
    return (
      <nav className="navbar navbar-inverse">
        <div className="container-fluid">

          <div className="navbar-header">
            <button type="button" id="main-navbar-collapse-0" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#main-navbar-collapse-1" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#">WM</a>
          </div>

          <div className="collapse navbar-collapse" id="main-navbar-collapse-1">
            <ul className="nav navbar-nav navbar-right">
              <li className={cx({
                "active": focusOn === "develop"
              })}>
                <a href="/#develop">Development</a>
              </li>
              <li className={cx({
                "active": focusOn === "content"
              })}>
                <a href="/#content">Content</a>
              </li>
              <li className={cx({
                "active": focusOn === "users"
              })}>
                <a href="/#users">Users</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }

});

module.exports = NavBar;
