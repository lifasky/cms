"use strict";

var React = require("react");
var CodeEditor = require("./components/codeEditor/Main.jsx");
var ContentManager = require("./components/contentManager/Main.jsx");
var UserManager = require("./components/UserManager/Main.jsx");

var Content = CodeEditor;

React.render(
  <Content />,
  document.getElementById("app_admin")
);
