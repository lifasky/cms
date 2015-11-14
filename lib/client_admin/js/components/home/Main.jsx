"use strict";

var React = require("react");
var NavBar = require("../widget/NavBar.jsx");

var Main = React.createClass({

  render: function() {
    return (
      <div className="wm_container">

        <NavBar />

        <div className="section_head">
          <center>
            <div className="wm_logo_box"><span className="red">red</span><span className="white">studio</span></div>
          </center>
        </div>

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