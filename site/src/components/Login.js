import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFirebaseApp, useAuth } from 'reactfire';

import 'firebase/auth'
import axios from 'axios';
import { config } from '../config';
import googleLogo from '../images/btn_google_signin_dark_normal_web.png';


import '../css/gridLayout.css';
import '../css/forms.css';

import firebase from 'firebase/app';

const provider = new firebase.auth.GoogleAuthProvider();


const LoginFirebase = (props) => {

    // User State
    const [user, setUser] = useState({
      email: '',
      password: '',
      error: '',
    });
    

  const reactAuth = useAuth();


  const signInWithGoogle = async () => {
    await reactAuth.signInWithPopup(provider);
  };



  const handleChange = e => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
      error: '',
    })
  };


  const firebase = useFirebaseApp();

  const handleSubmit = e => {
    e.preventDefault();
    firebase.auth().signInWithEmailAndPassword(user.email, user.password).then(response => {


      firebase.auth().currentUser.getIdToken(false).then(idToken => {

        axios.post(`${config.api}/login/${response.user.uid}`, {
          name: response.user.displayName,
          email: response.user.email,
          userId: response.user.uid,
          authorization: idToken

        }).then(response => {
          console.log("post")
          //notice we're not using the response; might want to for error handling or whatever
          window.location.href = "/challenges";
        });

      }).catch(function (error) {
        console.log(error);
      });
    })
      .catch(error => {
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

            {props.reset ?
              <>

                <h3 className="title center">New Password</h3>
                <form className="signup-form" onSubmit={this.changePassword.bind(this)}>
                  <div className="mb-4">
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
                  <div className="mb-6 text-center">
                    <button
                      className="w-75 submit-button-round-blue"
                      type="submit"
                    >
                      Change Password
               </button>
                  </div>
                  <hr className="mb-6 border-t" />
                  <div id="alertText"></div>
                  <div className="text-center">
                    <Link to="/signup">
                      <span
                        className="link-text-secondary"
                      >
                        No account? Create one here.
               </span>
                    </Link>
                  </div>
                  <div className="text-center">
                    <Link to="/resetpassword"><span class="link-text-secondary">Reset Password</span></Link>
                  </div>

                </form>
              </>
              :
              <>

                <h3 className="title center">Log In</h3>
                <p>New update has totally revamped accounts. It has advantages, but if you'd made one before you'll have to do it again. 'Sign in with Google' does that. Challenges still exist- ask and we can set your new account as owner.</p>
                <form className="signup-form" onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label" htmlFor="email">
                      Email Address
              </label>
                    <input type="text" placeholder="yourname@trexa.me" name="email" onChange={handleChange} className="width-100 px-3 py-2 form-input-shadow" required />
                  </div>
                  <div className="mb-4">
                    <label className="form-label text-center" htmlFor="password">
                      Password
              </label>
                    <input type="password" placeholder="******************" name="password" onChange={handleChange} className="width-100 px-3 py-2 form-input-shadow" required /><br />
                  </div>
                  <div className="mb-6 text-center">
                    <img src={googleLogo} style={{ maxWidth: "150px" }} onClick={signInWithGoogle} />
                    <button
                      className="w-75 submit-button-round-blue"
                      type="submit"
                    >
                      Log In
              </button>
                  </div>
                  <hr className="mb-6 border-t" />
                  {user.error && <h4>{user.error}</h4>}
                  <div className="text-center">
                    <Link to="/signup">
                      <span
                        className="link-text-secondary"
                      >
                        No account? Create one here.
              </span>
                    </Link>
                  </div>
                  <div className="text-center">
                    <Link to="/resetpassword"><span className="link-text-secondary">Reset Password</span></Link>
                  </div>

                </form>
              </>
            }
          </div>

        </div>

      </div>

    </>
  )
};

export default LoginFirebase;