import React, {useEffect, useState} from 'react';
import '../css/menu.css';
import { AuthCheck } from 'reactfire';
import {Link} from 'react-router-dom';
import firebase from 'firebase'
import { useAuth, useUser } from 'reactfire';


/*
    useEffect(() => {
        scrollToBottom();
        //uncomment to get a bunch of test entries in terminal
        //  document.getElementById("terminalData").innerHTML = `<span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br />`
    })

    */



var Header = () => {

    const { data: user } = useUser();
   
    function logOut() {
        firebase.auth().signOut().then(window.location.href = "/");
      }

    return (
        <>
            <div className="menuWrapper">

                <div className="menuSubWrapper roboto">



                    {user ?
                        <span className="user lightText">{user.displayName}</span>
                        :
                        <Link to="/login" className="user roboto">Login</Link>
                    }

                    <ul id="menu-list">
                        <AuthCheck>
                            <li><Link to="/challenges">Challenges</Link></li>
                            <li><Link to="/account">Account</Link></li>
                        </AuthCheck>

                        
                        {user ?
                            <li className="signUpButton roboto"><span onClick={logOut} style={{ cursor: "pointer" }} className="roboto">Log Out</span></li>
                            :
                            <li className="signUpButton roboto"><Link to="/signup">Sign Up</Link></li>
                        }
                    </ul>
                </div>
                <div id="menuToggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </>
    );
}

export default Header;