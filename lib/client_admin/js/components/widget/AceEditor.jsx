"use strict";

var React = require("react");
var brace  = require("brace");
var AceEditor  = require("react-ace-wrapper");
require("brace/theme/monokai");
require("brace/mode/json");
require("brace/mode/javascript");
require("brace/mode/css");
require("brace/mode/jade");
require("brace/mode/text");

var Editor = React.createClass({
  render: function() {
    return (
      <AceEditor
        mode={this.props.mode || "text"}
        theme="monokai"
        height="800px"
        width="100%"
        onChange={this._onChnage}
        value={this.props.value || "null"}
        editorProps={{$blockScrolling: true}}
        name="editor"
      />
    );
  },

  _onChnage: function(val) {
    this.props.handleChange(val);
  }

});


module.exports = Editor;
