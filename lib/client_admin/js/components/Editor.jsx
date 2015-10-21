"use strict";

var React = require("react");
var $ = require("jquery");
var ContentActions = require("../actions/Content.actions");
var ContentStore = require("../stores/Content.stores");
var CodeEditor = require("./CodeEditor.jsx");
var SideBarMenu = require("./SideBarMenu.jsx");
var _ = require("lodash");

function getState() {
  return {
    user: {},
    menus: ContentStore.getMenus() || [],
    selectedContent: ContentStore.getSelectedContent() || {},
    onLoading: ContentStore.getState()
  };
}

var Editor = React.createClass({
  getInitialState: function() {
    return getState();
  },

  componentWillMount: function() {
    ContentActions.editor.init();
  },

  componentDidMount: function() {
    ContentStore.addChangeListener(this._onChange);
    $(document).on({
      ajaxStart: function() {
        ContentStore.emitChange();
      }
    });
  },

  componentWillUnmount: function() {
    ContentStore.removeChangeListener(this._onChange);
    $(document).off({
      ajaxStart: function() {
        ContentStore.emitChange();
      }
    });
  },

  render: function() {
    return (
      <div className="row">

        <div className="col-lg-3 col-md-3 col-sm-3">
          <SideBarMenu 
            menus={this.state.menus} 
            selectedContent={this.state.selectedContent}
          />
        </div>

        <div className="col-lg-9 col-md-9 col-sm-9">
          {this.state.onLoading ?
            <div className="loading_screen"></div>
            : null
          }
          <div className="row">
            <div className="col-lg-8 col-md-8 col-sm-8">
              {!_.isEmpty(this.state.selectedContent) ?
                this.state.selectedContent.type_displace_name + " / " + this.state.selectedContent.name + " / " + this.state.selectedContent.field  
                : "EDITOR"
              }
            </div>
            <div className="col-lg-4 col-md-4 col-sm-4">
              {!_.isEmpty(this.state.selectedContent) ?
                <button className="pull-right" onClick={this._onSave}>
                  Save
                </button>
              : null
              }
            </div>
          </div>
          <CodeEditor 
            mode={this.state.selectedContent.mode}
            value={this.state.selectedContent.value}
            handleChange={this._onContentChange}
          />
        </div>

      </div>
    );
  },

  _onChange: function() {
    this.setState(getState());
  },

  _onContentChange: function(value) {
    var content = _.assign(this.state.selectedContent, {"value": value});
    this.setState({
      selectedContent: content
    });
  },

  _onSave: function() {
    var id = this.state.selectedContent.id;
    var type = this.state.selectedContent.type;
    var field = this.state.selectedContent.field;
    var value = this.state.selectedContent.value;
    var content = {};
    content[field] = value;
    ContentActions[type]["update"](id, content);
  }

});

module.exports = Editor;
