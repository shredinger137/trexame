import React from 'react';
import axios from 'axios';
import { config } from "../config.js";
import {Link} from "react-router-dom";
import '../css/common.css'


class Signup extends React.Component {

  handleSignupSubmit(event) {
    document.getElementById("alertText").innerHTML = "";
    event.preventDefault();
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    this.setState({ email: email });
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    axios.get(`${config.api}/signup?name=${name}&email=${email}&password=${password}`).then(res => {
      if (res.data == true) {
        document.getElementById("alertText").innerHTML = "Success";
      } else {
        document.getElementById("alertText").innerHTML = res.data;
      }
    })
  }

  stopProp = (e) => {
    e.stopPropagation();


  }

  render() {
    return (
      <div style={{margin: "0, auto", paddingTop: "20px"}}>
      <div style={{display: "flex", justifyContent: "center"}}>
        <div className="width-25 w-50-md width-100-small" style={{padding: "4px"}}>
          <h3 className="title center">Create Account</h3>
          <form className="signup-form" onSubmit={this.handleSignupSubmit.bind(this)}>
            <div style={{marginBottom: ".25rem"}}>
              <label class="form-label" htmlFor="name">
                Name
              </label>
              <input
                className="width-100 px-3 py-2 form-input-shadow"
                id="name"
                type="text"
                placeholder="Namey McNameface"
                required
              />
            </div>
            <div style={{marginBottom: ".25rem"}}>
              <label className="form-label" htmlFor="email">
                Email Address
              </label>
              <input
                className="width-100 px-3 py-2 form-input-shadow"
                id="email"
                type="email"
                placeholder="yourname@email.com"
                required
              />
            </div>
            <div style={{marginBottom: ".25rem"}}>
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                className="width-100 px-3 py-2 form-input-shadow"
                id="password"
                type="password"
                placeholder="******************"
                required
              />
            </div>
            <div style={{marginBottom: ".25rem"}} class="center">
              <button
                className="w-75 submit-button-round-blue"
                type="submit"
              >
                Sign Up
              </button>
            </div>
            <hr class="mb-6 border-t" />
            <div id="alertText"></div>
            <div class="center">
              <Link to="/login"><span class="link-text-secondary">Already have an account? Log in.</span></Link>
            </div>
            <div class="text-center">
              <Link to="/resetpassword"><span class="link-text-secondary">Reset Password</span></Link>
            </div>
          </form>
        </div>
      </div>
  </div>
    );
  }
}

export default Signup;
