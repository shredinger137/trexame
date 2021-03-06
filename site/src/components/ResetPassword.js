/* eslint eqeqeq: "off", no-extend-native: "off", no-throw-literal: "off" */

import React, { useCallback, useState } from 'react';
import '../css/menu.css'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { config } from '../config'
import { useFirebaseApp } from 'reactfire';
import 'firebase/auth'


var ResetPassword = (props) => {

    const firebase = useFirebaseApp();


    const [email, setEmail] = useState("");
    const [emailHasBeenSent, setEmailHasBeenSent] = useState(false);
    const [message, setMessage] = useState(null);


    const sendResetEmail = event => {
        event.preventDefault();
        var email = document.getElementById("userEmail").value;
        document.getElementById("userEmail").value = "";
        
        firebase.auth()
            .sendPasswordResetEmail(email)
            .then(() => {
                setMessage("Please check your email for a reset link")
                setTimeout(() => { setEmailHasBeenSent(false) }, 3000);
            })
            .catch(() => {
                setMessage("Error resetting password");
            });

    };

    function submitReset(e) {

        e.preventDefault();

        axios.get(config.api + "/resetpassword?email=" + document.getElementById("email").value).then(res => {
            if (res && res.data) {
                console.log(res.data);

                if (res.data == true) {
                    document.getElementById("form").style.display = "none";
                    document.getElementById("submittedText").style.display = "block";
                } else {
                    document.getElementById("errorText").style.display = "block";
                }

            }
        })



    }



    return (
        <div style={{ margin: "0, auto", paddingTop: "20px" }}>

            <div style={{ display: "flex", justifyContent: "center" }}>
                <div className="width-25 w-50-md width-100-small" style={{ padding: "4px" }}>
                    <h3 className="title center">Reset Password</h3>
                    <form id="form" className="signup-form" onSubmit={sendResetEmail}>
                        <div class="mb-4">
                            <label className="form-label" htmlFor="email">
                                Email Address
              </label>
                            <input
                                type="email"
                                name="userEmail"
                                id="userEmail"
                                placeholder="Input your email"
                                className="width-100 px-3 py-2 form-input-shadow"
                            />
                        </div>
                        <div class="mb-6 text-center">
                            <button
                                className="w-75 submit-button-round-blue"
                                type="submit"
                            >
                                Reset
              </button>
                        </div>
                        <hr class="mb-6 border-t" />
                        <div id="alertText"></div>

                    </form>

                    <div id="submittedText" style={{ display: "none" }}>
                        <p>If an account exists with that email, we'll send a link to reset your password. Be sure to check your spam folder. If you run into any issues, contact <a href="mailto:admin@rrderby.org">admin@rrderby.org</a> for help.</p>
                    </div>

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
                        <Link to="/login"><span class="link-text-secondary">Login</span></Link>
                    </div>
                    <div id="errorText" style={{ display: "none" }}>
                        <p>An error occured. If this persists, contact <a href="mailto:admin@rrderby.org">admin@rrderby.org</a>.</p>
                    </div>




                </div>
            </div>
            {message}
        </div>
    );
}

export default ResetPassword;