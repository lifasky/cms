"use strict";

var React = require("react");

var Main = React.createClass({

  render: function() {
    return (
      <div className="wm_container">
        <nav className="navbar navbar-inverse">
          <div className="container-fluid">
            <div className="navbar-header">
              <a className="navbar-brand" href="/">WM</a>
            </div>
          </div>
        </nav>

        <center>
          <div className="wm_logo_box">WM</div>
        </center>

        <div className="list-group">
          <a href="/#develop" className="list-group-item">
            Development
          </a>
          <a href="/#content" className="list-group-item">
            Content Management
          </a>
          <a href="/#api" className="list-group-item disabled">
            API
            <span className="hint"> (coming soon)</span>
          </a>
          <a href="/#users" className="list-group-item disabled">
            Users Management 
            <span className="hint"> (coming soon)</span>
          </a>
          <a href="/#seo" className="list-group-item disabled">
            SEO 
            <span className="hint"> (coming soon)</span>
          </a>
          <a href="/#dns" className="list-group-item disabled">
            DNS 
            <span className="hint"> (coming soon)</span>
          </a>
        </div>
      </div>
    );
  }

});

module.exports = Main;