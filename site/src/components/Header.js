import React from 'react';
import '../css/menu.css'

var Header = (props) => {

    function menuToggle() {
        var button = document.getElementById("menuButton");
        var menu = document.getElementById("primary-menu");
        var transparentListener = document.getElementById("fullPageListener");
        if (button) {
            button.classList.toggle("change");
        } else { console.log("Didn't find"); }
        if (menu && menu.style) {
            menu.classList.toggle("menuExpanded");
            menu.classList.toggle("menu");
            //we use 'menu' as shorthand for a hidden menu in the CSS as a Wordpress workaround
            transparentListener.classList.toggle("show");
        }
    }

    /*
                       <div class="menubutton" id="menuButton" onClick={menuToggle}>
                        <div class="bar1"></div>
                        <div class="bar2"></div>
                        <div class="bar3"></div>
                    </div>

            */

    return (
        <>
            <div className="menuWrapper">

                <div className="menuSubWrapper roboto">

 

                    {props.isLoggedIn ?
                        <span className="user lightText">{props.username}</span>
                        :
                        <a href="/login" className="user roboto">Login</a>
                    }

                    <ul id="menu-list">
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