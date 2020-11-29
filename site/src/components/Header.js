import React from 'react';
import '../css/menu.css'

var Header = (props) => {
    return (
        <>
            <div className="menuWrapper">
                <div className="menuSubWrapper" id="mobileMenuWrapper">
                    {props.isLoggedIn ?
                        <span className="user lightText">{props.username}</span>
                        :
                        <a href="/login" className="user lightText">Login</a>
                    }

                    <ul>
                        {props.isLoggedIn ?
                            <>
                                <li><a href="/challenges" className="lightText">Challenges</a></li>
                            </>
                            :
                            null
                        }

                        {props.isLoggedIn ?
                            <li className="signUpButton"><span className="lightText" onClick={props.logOut} style={{ cursor: "pointer" }}>Log Out</span></li>
                            :
                            <li className="signUpButton"><a href="/signup" className="lightText">Sign Up</a></li>
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