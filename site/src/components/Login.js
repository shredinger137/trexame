import React from 'react';
import '../App.css';
import { config } from "../config.js";
import axios from 'axios';
import {Link} from "react-router-dom";

import '../css/gridLayout.css';
import '../css/forms.css';

//TODO: Login seems to be broken now.
//checkLogin didn't respond with a cookie I guess?

class Login extends React.Component {

  state = {
    forgotPassword: false
  }

  submitLogin(e) {
    console.log('submit');
    e.preventDefault();
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    axios.get(config.api + "/login?email=" + email + "&password=" + password, { withCredentials: true }).then(res => {
      console.log(res);
      if (res && res.data && res.data.result) {
        this.setState({ loginResponse: res.data.result });
        this.props.checkLogin();
        if(res.data.result == "validLogin"){
          window.location.href = "/challenges";
        }
      }
      console.log(res.data.result);
    })
  }


  stopProp = (e) => {
    e.stopPropagation();
  }

  render() {
    return (

<div style={{margin: "0, auto", paddingTop: "20px"}}>
      <div style={{display: "flex", justifyContent: "center"}}>
        <div className="width-50 width-100-small" style={{padding: "4px"}}>
          <h3 className="title center">Log In</h3>
          <form className="signup-form" onSubmit={this.submitLogin.bind(this)}>
            <div class="mb-4">
              <label className="form-label" htmlFor="email">
                Email Address
              </label>
              <input
                className="width-100 px-3 py-2 form-input-shadow"
                id="email"
                type="email"
                placeholder="yourname@email.com"
              />
            </div>
            <div class="mb-4">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                className="width-100 px-3 py-2 form-input-shadow"
                id="password"
                type="password"
				placeholder="******************"
              />
            </div>
            <div class="mb-6 text-center">
              <button
                className="w-75 submit-button-round-blue"
                type="submit"
              >
                Log In
              </button>
            </div>
            <hr class="mb-6 border-t" />
            <div id="alertText"></div>
            <div class="text-center">
			<Link to="/signup">
              <span
                className="link-text-secondary"
              >
                No account? Create one here.
              </span>
			  </Link>
            </div>
            <div class="text-center">
              <a
                className="link-text-secondary"
                href="./forgot-password.html"
              >
                Reset Password
              </a>
            </div>
          </form>
        </div>
      </div>
  </div>
    );
  }
}

export default Login;
