import * as React from "react";

import "./config.css";
import Sample from "./sample.json";

export default class Config extends React.Component {
  constructor(props) {
    super(props);
    this.state = { config: undefined };
  }

  loadDbFile() {
    let newState = { ...this.state };
    newState.config = {
      path: "sample.json",
      data: Sample
    };
    this.setState(newState);
  }

  onChangeUserActiveState(userIndex) {
    let newState = { ...this.state };
    newState.config.data.users[userIndex].active = !newState.config.data.users[
      userIndex
    ].active;

    this.setState(newState);
  }

  onAddRole(event, userIndex) {
    if (event.keyCode === 13 && event.currentTarget.value !== "") {
      let newState = { ...this.state };
      newState.config.data.users[userIndex].roles.push(
        event.currentTarget.value
      );
      this.setState(newState);
      event.currentTarget.value = "";
    }
  }

  onAddUser(event) {
    if (event.keyCode === 13 && event.currentTarget.value !== "") {
      let newUser = {
        name: event.currentTarget.value,
        active: true,
        roles: []
      };

      let newState = { ...this.state };
      newState.config.data.users.push(newUser);
      this.setState(newState);
      event.currentTarget.value = "";
    }
  }

  renderFile(config) {
    return (
      <React.Fragment>
        <h1>
          Config name : {config.data.name} ({config.path})
        </h1>{" "}
        <p>{config.data.description}</p>
        <div className="userlist">
          <span>User List :</span>
          <br />
          <ul className="grid-container">
            {config.data.users && config.data.users.length > 0
              ? config.data.users.map((user, userIndex) => {
                  let roles =
                    user.roles && user.roles.length > 0
                      ? user.roles.join(",")
                      : null;

                  return (
                    <li className="grid-item" key={userIndex}>
                      {user.name}
                      <br />
                      Is active :{" "}
                      <input
                        type="checkbox"
                        checked={user.active}
                        onChange={() => this.onChangeUserActiveState(userIndex)}
                      />
                      <br />
                      Roles : {roles}
                      <br />
                      <input
                        className="addrole"
                        type="text"
                        placeholder="Add Role"
                        onKeyUp={event => this.onAddRole(event, userIndex)}
                      />
                    </li>
                  );
                })
              : null}
          </ul>
          <input
            type="text"
            placeholder="Add User"
            onKeyUp={event => this.onAddUser(event)}
          />
        </div>
      </React.Fragment>
    );
  }

  render() {
    return (
      <div>
        {this.state.config !== null && this.state.config !== undefined ? (
          this.renderFile(this.state.config)
        ) : (
          <React.Fragment>
            <span>No data to display ¯\_(ツ)_/¯</span>
            <br />
            <input
              className="load"
              type="button"
              onClick={event => this.loadDbFile(event)}
              value="Load file"
            />
          </React.Fragment>
        )}
      </div>
    );
  }
}
