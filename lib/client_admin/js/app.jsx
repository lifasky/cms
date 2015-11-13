"use strict";

var React = require("react");
var Home = require("./components/home/Main.jsx");
var CodeEditor = require("./components/codeEditor/Main.jsx");
var ContentManager = require("./components/contentManager/Main.jsx");
var UsersManager = require("./components/UsersManager/Main.jsx");

var App = React.createClass({
  
  getInitialState: function() {
    return {
      route: window.location.hash.substr(1)
    };
  },  
 
  componentDidMount: function() {
    console.log("window.location", window.location);
    var self = this;
    window.addEventListener("hashchange", function() {
        self.setState({
          route: window.location.hash.substr(1)
        });
      }
    );
  },

  render: function() {
    var hash = this.state.route;
 	var Child;
    switch(hash) {
      case "develop":
        Child = <CodeEditor />;
        break;
      case "content":
        Child = <ContentManager />;
        break;
      case "users":
        Child = <UsersManager />;
        break;
      default:
        Child = <Home />;
        break;
    }
    return (
      <div>
        {Child}
      </div>
    );
  }

});

React.render(
  <App />,
  document.getElementById("app_admin")
);
