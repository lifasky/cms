"use strict";

var React = require("react");
var $ = require("jquery");
var ContentActions = require("../../actions/Content.actions");
var ContentStore = require("../../stores/Content.stores");
var Editor = require("./Editor.jsx");
var SideBarMenu = require("./SideBarMenu.jsx");
var NavBar = require("../widget/NavBar.jsx");
var _ = require("lodash");

function getState() {
  return {
    user: {},
    menus: ContentStore.getMenus() || [],
    typeof_selectedContent: typeof ContentStore.getSelectedContent(),
    selectedContent: ContentStore.getSelectedContent() || {},
    onLoading: ContentStore.getState()
  };
}

var Main = React.createClass({

  getInitialState: function() {
    return getState();
  },

  componentWillMount: function() {
    ContentActions.init.editor();
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
      <div className="wm_container wm_code_editor_container">
        <NavBar focusOn={"develop"} />
        <div className="row wm_code_editor_main">

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
                <span className="code_editor_title">
                  {!_.isEmpty(this.state.selectedContent) ?
                    this.state.selectedContent.type_displace_name + " / " + this.state.selectedContent.name + " / " + this.state.selectedContent.field  
                    : "EDITOR"
                  }
                </span>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-4">
                {!_.isEmpty(this.state.selectedContent) ?
                  <button className="pull-right btn btn-default btn-sm btn-save" onClick={this._onSave}>
                    Save
                  </button>
                : null
                }
              </div>
            </div>
            <Editor 
              mode={this.state.selectedContent.mode}
              value={this.state.selectedContent.value}
              handleChange={this._onContentChange}
            />
          </div>

        </div>
      </div>
    );
  },

  _onChange: function() {
    this.setState(getState());
  },

  _onContentChange: function(value) {
    var content = this.state.selectedContent;
    _.assign(content, {
      "value": value
    });
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
    if (this.state.typeof_selectedContent === "object" && typeof value === "string") {
      try {
        value = JSON.parse(value);
      } catch (e) {}
    }
    content[field] = value;
    ContentActions[type]["update"](id, content);
  }

});

module.exports = Main;
