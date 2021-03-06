"use strict";

var React = require("react");

var ExtendMenu = React.createClass({
  getInitialState: function() {
    return {
      isExtend: false
    };
  },

  componentWillMount: function() {
    if (this.props.isExtend === true) {
      this.setState({isExtend: true});
    }
  },

  render: function() {
    var extendChild;
    return (
      <div className="extendMenu">
        <div className="extendMenu-warper">
          <div className="extendMenu-header" onClick={this._toggleExtend}>
            <div className="extendMenu-header-wrap">
              {this.state.isExtend ? <i className="fa fa-angle-down"></i> : <i className="fa fa-angle-right"></i>}
              <span>{this.props.displace_name}</span>
            </div>
          </div>
          {this.state.isExtend ? this.props.child : null}
        </div>
      </div>
    );
  },

  _toggleExtend: function() {
    this.setState({
      isExtend: !this.state.isExtend
    });
  }

});

module.exports = ExtendMenu;