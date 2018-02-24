import React, { Component } from "react";
import api from "../api";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {}
    };
  }

  handleFormSubmit = async e => {
    e.preventDefault();
    const payLoad = {
      name: this.name.value,
      email: this.email.value,
      password: this.password.value
    };
    const status = await api.register(payLoad);
    this.handleStatus(status);
  };

  handleStatus = status => {
    if (status !== "Response Added!") {
      let err = { errors: {} };
      if (status.code === 11000) {
        err.errors.email = "Duplicate email!";
      } else {
        Object.keys(status.errors).map(key => {
          err.errors[key] = status.errors[key].message;
        });
      }
      this.setState(err);
    } else {
      this.clearForm();
    }
  };

  clearForm = () => {
    this.name.value = "";
    this.email.value = "";
    this.password.value = "";
    this.password2.value = "";
  };

  render() {
    return (
      <div style={{ margin: "auto", width: 400 }}>
        <form onSubmit={this.handleFormSubmit}>
          <h2 style={{ textAlign: "center" }}>Register</h2>
          <hr />

          <label>User Name</label>
          <input
            type="text"
            style={{ margin: 10 }}
            ref={node => {
              this.name = node;
            }}
            required
            maxLength="50"
            autoFocus
          />
          <span style={{ color: "red" }}>*</span>
          <span style={{ color: "red", marginLeft: 8 }}>
            {this.state.errors.name}
          </span>
          <br />

          <label>Email Address</label>
          <input
            type="email"
            style={{ margin: 10 }}
            ref={node => {
              this.email = node;
            }}
            required
            maxLength="50"
          />
          <span style={{ color: "red" }}>*</span>
          <span style={{ color: "red", marginLeft: 8 }}>
            {this.state.errors.email}
          </span>
          <br />

          <label>Password</label>
          <input
            type="password"
            style={{ margin: 10 }}
            ref={node => {
              this.password = node;
            }}
            required
            maxLength="50"
          />
          <span style={{ color: "red" }}>*</span>
          <span style={{ color: "red", marginLeft: 8 }}>
            {this.state.errors.password}
          </span>
          <br />

          <label>Confirm Password</label>
          <input
            type="password"
            style={{ margin: 10 }}
            ref={node => {
              this.password2 = node;
            }}
            required
            maxLength="50"
          />
          <span style={{ color: "red" }}>*</span>
          <span style={{ color: "red", marginLeft: 8 }}>
            {this.state.errors.password2}
          </span>
          <br />

          <input
            type="submit"
            value="Submit!"
            style={{ display: "block", margin: "auto" }}
          />
        </form>
      </div>
    );
  }
}

export default Register;