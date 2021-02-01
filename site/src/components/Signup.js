import React, { useState } from 'react';
import { useFirebaseApp } from 'reactfire';
import 'firebase/auth'
import axios from 'axios';
import { config } from "../config.js";
import {Link} from "react-router-dom";

const Signup = () => {

  const firebase = useFirebaseApp();

  const [user, setUser] = useState({
    nickname: '',
    email: '',
    password: '',
    error: '',
  });

  const handleChange = e => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
      error: '',
    })
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    await firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(result => {
        console.log(result);
        result.user.updateProfile({
          displayName: user.name,
        })

        axios({
          method: 'post',
          url: `${config.api}/users`,
          data: {
            name: user.name,
            email: user.email,
            userId: result.user.uid
          }
        });

      }).catch(error => {
        console.log(error);
        setUser({
          ...user,
          error: error.message,
        })
      })
  }

  return (
    <>
      <div style={{ margin: "0, auto", paddingTop: "20px" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="width-25 w-50-md width-100-small" style={{ padding: "4px" }}>
            <h3 className="title center">Create Account</h3>
            <form className="signup-form" onSubmit={handleSubmit}>
              <div style={{ marginBottom: ".25rem" }}>
                <label class="form-label" htmlFor="name">
                  Name
              </label>
                <input
                  name="name"
                  className="width-100 px-3 py-2 form-input-shadow"
                  id="name"
                  type="text"
                  placeholder="Namey McNameface"
                  onChange={handleChange}
                />
              </div>
              <div style={{ marginBottom: ".25rem" }}>
                <label className="form-label" htmlFor="email">
                  Email Address
              </label>
                <input
                  name="email"
                  className="width-100 px-3 py-2 form-input-shadow"
                  id="email"
                  type="email"
                  placeholder="yourname@email.com"
                  required
                  onChange={handleChange}
                />
              </div>
              <div style={{ marginBottom: ".25rem" }}>
                <label className="form-label" htmlFor="password">
                  Password
              </label>
                <input
                  name="password"
                  className="width-100 px-3 py-2 form-input-shadow"
                  id="password"
                  type="password"
                  placeholder="******************"
                  required
                  onChange={handleChange}
                />
              </div>
              <div style={{ marginBottom: ".25rem" }} class="center">
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
      {user.error && <h4>{user.error}</h4>}
    </>
  )
};

export default Signup;