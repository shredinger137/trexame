import React from 'react';
import '../App.css';
import { config } from "../config.js";
import axios from 'axios';

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
      }
      console.log(res.data.result);
    })
  }


  stopProp = (e) => {
    e.stopPropagation();
  }

  render() {
    return (

      <div className="loginWrapper">
        <div>
          <h3>Log In</h3><br />
          {this.props.isLoggedIn ? 
        
            null 
            :

        
      
      

          <form onSubmit={this.submitLogin.bind(this)}>
            <div className="form grid-2 formWrapper grid-1-small" style={{ margin: "0 auto" }}>
              <label>
                Email Address:
            </label>
              <input type="email" id="email" />
              <label>Password:</label>
              <input type="password" id="password"></input>
            </div>
            <br />
            <input type="submit" value="Log In" />
            <br /><br />
            <span onClick={() => { this.setState({ forgotPassword: !this.state.forgotPassword }) }} style={{ cursor: "pointer" }}>Reset Password</span>
          </form>
           }

          {this.state.forgotPassword ?
            <div>
              <p>Put a form here to recover your password </p>
            </div>
            :
            null
          }
       
        </div>

      </div>
    );
  }
}

export default Login;
