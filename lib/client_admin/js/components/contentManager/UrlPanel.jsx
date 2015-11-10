"use strict";

var React = require("react");
var _ = require("lodash");
var ContentActions = require("../../actions/Content.actions");

var UrlPanel = React.createClass({
  render: function() {
    var urls = this.props.urls;
    var page_id = this.props.page_id;
    return (
      <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
        <label>Path</label>
        <ul className="list-group">
          {
            _.map(urls, function(n, key) {
              return <UrlItem key={key} url={n} page_id={page_id} />;
            })
          }
          <li onClick={this._onAdd} className="list-group-item">
            <center>
              <i className="fa fa-plus"></i>
            </center>
          </li>
        </ul>
      </div>
    );
  },

  _onAdd: function() {
    var page_id = this.props.page_id;
    var url = prompt("Please enter a new URL.");
    if (url) {
      ContentActions.route.create(url, page_id);
    }
  }

});

var UrlItem = React.createClass({
  render: function() {
    var url = this.props.url;
    var page_id = this.props.page_id;
    return (
      <li className="list-group-item">
        {url}
        <i onClick={this._onDelete} className="fa fa-times pull-right"></i>
      </li>
    );
  },

  _onDelete: function() {
    var url = this.props.url;
    var c = confirm("Are you sure?");
    if (c) {
      ContentActions.route.delete(url);
    }
  }

});

module.exports = UrlPanel;
