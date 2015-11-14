"use strict";

var React = require("react");
var $ = require("jquery");
var ContentActions = require("../../actions/Content.actions");
var ContentStore = require("../../stores/Content.stores");
var NavBar = require("../widget/NavBar.jsx");
var _ = require("lodash");

function getState() {
  return {
    users: ContentStore.getUsers() || {},
    onLoading: ContentStore.getState()
  };
}

var Main = React.createClass({

  getInitialState: function() {
    return getState();
  },

  componentWillMount: function() {
    ContentActions.init.user_admin();
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
    var users = this.state.users;
    return (
      <div className="wm_container wm_users_manager_container">
        <NavBar focusOn={"users"} />
        <div className="wm_users_manager_main">
          <label>USERS</label>
          <ul className="list-group">
            {
              _.map(users, function(n, key) {
                return <UserItem key={key} user={n} />;
              })
            }
            <li onClick={this._onAdd} className="list-group-item list-group-item-add">
              <center>
                <i className="fa fa-plus"></i>
              </center>
            </li>
          </ul>
        </div>
      </div>
    );
  },

  _onAdd: function() {
    var email = prompt("Please enter a new user Email.");
    ContentActions.user.create(email);
  },

  _onChange: function() {
    this.setState(getState());
  }

});

var UserItem = React.createClass({
  render: function() {
    var user = this.props.user;
    return (
      <li className="list-group-item">
        {user.id}
        <i onClick={this._onDelete} className="fa fa-times pull-right"></i>
      </li>
    );
  },

  _onDelete: function() {
    var id = this.props.user.id;
    var c = confirm("Are you sure?");
    if (c) {
      ContentActions.user.delete(id);
    }
  }

});

module.exports = Main;