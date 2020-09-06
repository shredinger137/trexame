import React from 'react';
import '../App.css';
import { config } from "../config.js";
import axios from 'axios';
import '../css/common.css'
import '../css/modal.css'



class Login extends React.Component {

  submitLogin(e) {
    e.preventDefault();
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    axios.get(config.api + "/login?email=" + email + "&password=" + password, { withCredentials: true }).then(res => {
      if (res && res.data && res.data.result) {
        this.setState({ loginResponse: res.data.result });
        this.props.checkLogin();
      }
      console.log(res.data.result);
    })

  }

  

  stopProp = (e) => {
    e.stopPropagation();
  }

  render() {
    return (
      <div className="modalWrapper" onClick={() => this.props.handleLoginClick()}>
        <div className="modalInner" onClick={this.stopProp}>
          <br /><br /><br />
          <h3>Log In</h3><br /><br />
          <form onSubmit={this.submitLogin.bind(this)}>
            <label><span> Email Address:{" "}</span>
              <input type="email" id="email" />
            </label>
            <br />
            <label> <span>Password:{" "}</span>
              <input type="password" id="password"></input>
            </label>
            <br />
            <br /><br />
            <input type="submit" value="Log In" />
          </form>

        </div>
      </div>
    );
  }
}

export default Login;
