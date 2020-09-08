import React from 'react';
import '../css/menu.css'

var Header = (props) => {
    console.log(props);
    return (
        <>
            <div className="menuWrapper">
                <div className="menuSubWrapper" id="mobileMenuWrapper">
                    {props.isLoggedIn ?
                        <span className="user">{props.username}</span>
                        :
                        <span className="user" onClick={props.handleLoginClick}>Login</span>
                    }

                    <ul>
                        {props.isLoggedIn ?
                            <>
                                <li><a href="/dashboard">Dashboard</a></li>
                                <li><a href="/challenges">Challenges</a></li>
                            </>
                            :
                            null
                        }

                        {props.isLoggedIn ?
                            <li className="signUpButton"><span onClick={props.logOut} style={{ cursor: "pointer" }}>Log Out</span></li>
                            :
                            <li className="signUpButton"><span onClick={props.handleSignUpClick} style={{ cursor: "pointer" }}>Sign Up</span></li>
                        }
                    </ul>
                </div>
                <div id="menuToggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <div id="offsetSpace" style={{ height: "75px" }}></div>
        </>
    );
}

export default Header;