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
      <div class="container mx-auto">
      <div class="w-full xl:w-3/4 lg:w-11/12 flex justify-center">
        <div class="w-full lg:w-1/2 bg-white p-5 rounded-lg lg:rounded-l-none">
          <h3 class="pt-4 text-2xl text-center">Create Account</h3>
          <form class="px-8 pt-6 pb-8 mb-4 bg-white rounded" onSubmit={this.handleSignupSubmit.bind(this)}>
            <div class="mb-4">
              <label class="block mb-2 text-sm font-bold text-gray-700" htmlFor="name">
                Name
              </label>
              <input
                class="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Namey McNameface"
              />
            </div>
            <div class="mb-4">
              <label class="block mb-2 text-sm font-bold text-gray-700" htmlFor="email">
                Email Address
              </label>
              <input
                class="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="yourname@email.com"
              />
            </div>
            <div class="mb-4">
              <label class="block mb-2 text-sm font-bold text-gray-700" htmlFor="password">
                Password
              </label>
              <input
                class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="******************"
              />
            </div>
            <div class="mb-6 text-center">
              <button
                class="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Sign Up
              </button>
            </div>
            <hr class="mb-6 border-t" />
            <div id="alertText"></div>
            <div class="text-center">
              <a
                class="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
                href="/login"
              >
                Already have an account? Log in.
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

export default Signup;
