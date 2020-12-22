import React from 'react';
import '../App.css';
import { config } from "../config.js";
import axios from 'axios';
import { useHistory } from "react-router-dom";


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

<div class="container mx-auto">
				<div class="w-full xl:w-3/4 lg:w-11/12 flex justify-center">
					<div class="w-full lg:w-1/2 bg-white p-5 rounded-lg lg:rounded-l-none">
						<h3 class="pt-4 text-2xl text-center">Log In</h3>
						<form class="px-8 pt-6 pb-8 mb-4 bg-white rounded" onSubmit={this.submitLogin.bind(this)}>
							<div class="mb-4">
								<label class="block mb-2 text-sm font-bold text-gray-700" for="username">
									Email
								</label>
								<input
									class="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
									id="email"
									type="text"
									placeholder="Username"
								/>
							</div>
							<div class="mb-4">
								<label class="block mb-2 text-sm font-bold text-gray-700" for="password">
									Password
								</label>
								<input
									class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
									id="password"
									type="password"
									placeholder="******************"
								/>
							</div>
							<div class="mb-4">
								<input class="mr-2 leading-tight" type="checkbox" id="checkbox_id" />
								<label class="text-sm" for="checkbox_id">Remember Me (this doesn't do anything)</label>
							</div>
							<div class="mb-6 text-center">
								<button
									class="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
									type="submit"
								>
									Sign In
								</button>
							</div>
							<hr class="mb-6 border-t" />
							<div class="text-center">
								<a
									class="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
									href="/signup"
								>
									Create an Account
								</a>
							</div>
							<div class="text-center">
								<a
									class="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
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
