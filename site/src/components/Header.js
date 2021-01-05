import React from 'react';
import '../css/menu.css';
import { AuthCheck } from 'reactfire';
import {Link} from 'react-router-dom';

var Header = (props) => {

   

    return (
        <>
            <div className="menuWrapper">

                <div className="menuSubWrapper roboto">



                    {props.isLoggedIn ?
                        <span className="user lightText">{props.username}</span>
                        :
                        <Link to="/login" className="user roboto">Login</Link>
                    }

                    <ul id="menu-list">
                        <AuthCheck>
                            <li><Link to="/challenges">Challenges</Link></li>
                            <li><Link to="/account">Account</Link></li>
                        </AuthCheck>

                        
                        {props.isLoggedIn ?
                            <li className="signUpButton roboto"><span onClick={props.logOut} style={{ cursor: "pointer" }} className="roboto">Log Out</span></li>
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