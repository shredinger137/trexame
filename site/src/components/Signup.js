import React from 'react';
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
      <div>
        <h3>Create an Account</h3><br />
        <form onSubmit={this.handleSignupSubmit.bind(this)}>
          <div className="grid-2 formWrapper loginWrapper">
            <label className="lightText">Name:</label>
            <input type="text" id="name" />
            <label className="lightText">Email:</label>
            <input type="email" id="email"></input>
            <label className="lightText">Password:
            </label>
            <input type="password" id="password"></input>
          </div>
          <br />
          <br /><br />
          <input type="submit" value="Submit" />
        </form>
        <br /><br />
        <div id="alerts"><p id="alertText"></p></div>
      </div>
    );
  }
}

export default Signup;
