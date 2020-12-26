import React from 'react';
import '../App.css';
import { config } from "../config.js";
import axios from 'axios';
import { Link } from "react-router-dom";

import '../css/gridLayout.css';
import '../css/forms.css';

//TODO: Reset password should go as a prop to this one. Since we need to toglle showing the main section.

class Login extends React.Component {

  state = {
    forgotPassword: false,
    string: ""
  }

  componeneDidMount() {
    console.log(this.props)
  }

  changePassword(e) {
    e.preventDefault();
  }

  getResetData() {

    const params = new URLSearchParams(window.location.search);
    if (params && params.get("string")) {
      var string = params.get("string");
      axios.get(`${config.api}/checkResetLink?string=${string}`).then(res => {
        if(res && res.data && res.data == true){
          this.setState({string: string})
        } else {
          this.setState({string: false})
          //this should do some sort of error thing
        }
      })
    }
    else {
      //error state - don't show the form
    }
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
        if (res.data.result == "validLogin") {
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

      <div style={{ margin: "0, auto", paddingTop: "20px" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="width-25 w-50-md width-100-small" style={{ padding: "4px" }}>

            {this.props.reset ?
              <>

                <h3 className="title center">New Password</h3>
                <form className="signup-form" onSubmit={this.changePassword.bind(this)}>
                  <div class="mb-4">
                    <label className="form-label text-center" htmlFor="newPassword">
                      New Password
               </label>
                    <input
                      className="width-100 px-3 py-2 form-input-shadow"
                      id="newPassword"
                      type="password"
                      placeholder="******************"
                      required
                    />
                  </div>
                  <div class="mb-6 text-center">
                    <button
                      className="w-75 submit-button-round-blue"
                      type="submit"
                    >
                      Change Password
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
                    <Link to="/resetpassword"><span class="link-text-secondary">Reset Password</span></Link>
                  </div>

                </form>
              </>
              :
              <>

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
                      required
                    />
                  </div>
                  <div class="mb-4">
                    <label className="form-label text-center" htmlFor="password">
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
                    <Link to="/resetpassword"><span class="link-text-secondary">Reset Password</span></Link>
                  </div>

                </form>
              </>
            }
          </div>

        </div>

      </div>
    );
  }
}

export default Login;
