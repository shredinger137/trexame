import React from 'react';
import '../css/menu.css'

var Header = (props) => {
    return (
        <>
            <div className="menuWrapper">
                <div className="menuSubWrapper roboto" id="mobileMenuWrapper">
                    {props.isLoggedIn ?
                        <span className="user lightText">{props.username}</span>
                        :
                        <a href="/login" className="user roboto">Login</a>
                    }

                    <ul>
                        {props.isLoggedIn ?
                            <>
                                <li><a href="/challenges">Challenges</a></li>
                                <li><a href="/account">Account</a></li>
                            </>
                            :
                            null
                        }

                        {props.isLoggedIn ?
                            <li className="signUpButton roboto"><span onClick={props.logOut} style={{ cursor: "pointer" }} className="roboto">Log Out</span></li>
                            :
                            <li className="signUpButton roboto"><a href="/signup">Sign Up</a></li>
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