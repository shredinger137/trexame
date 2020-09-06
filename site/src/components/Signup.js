import React from 'react';
import '../App.css';
import '../css/common.css'
import '../css/modal.css'
import axios from 'axios';
import { config } from "../config.js";
var route = require('../img/route.jpg');

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
      <div className="modalWrapper" onClick={() => this.props.handleSignUpClick()}>
        <div className="modalInner" onClick={this.stopProp}>
          <br /><br /><br />
          <h3>Create an Account</h3><br /><br />
          <form onSubmit={this.handleSignupSubmit.bind(this)}>
            <label><span> Name:{" "}</span>
              <input type="text" id="name" />
            </label>
            <br />
            <label> <span>Email:{" "}</span>
              <input type="email" id="email"></input>
            </label>
            <br />
            <label> <span>Password:{" "}</span>
              <input type="password" id="password"></input>
            </label>
            <br />
            <br /><br />
            <input type="submit" value="Submit" />
          </form>
        <br /><br />
        <div id="alerts"><p id="alertText"></p></div>
        </div>
      </div>
    );
  }
}

export default Signup;
