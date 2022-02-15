import React from 'react';
import '../css/menu.css';
import { AuthCheck } from 'reactfire';
import { Link } from 'react-router-dom';
import 'firebase/auth'
import { useUser } from 'reactfire';
import firebase from 'firebase/app'


/*
    useEffect(() => {
        scrollToBottom();
        //uncomment to get a bunch of test entries in terminal
        //  document.getElementById("terminalData").innerHTML = `<span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br /><span style={{ paddingLeft: ".75rem" }}>test</span><br />`
    })

    */



var Header = () => {

    const userLogoStyle = {
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        marginTop: "8px",
        backgroundColor: "#4F2937",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: "10px"
    }

    const { data: user } = useUser();

    function logOut() {
        firebase.auth().signOut().then(window.location.href = "/");
    }



    return (
        <>
            <div className="menuWrapper">

                <div className="menuSubWrapper roboto">



                    {user ?
                        <div style={userLogoStyle}>
                            <p>{user.displayName.substr(0, 1)}</p>
                        </div>
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