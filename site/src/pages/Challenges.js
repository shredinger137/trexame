import React from 'react';
import axios from 'axios';
import '../components/Signup';
import { config } from "../config.js";
import NewChallenge from '../components/NewChallenge';
import '../css/modal.css';
import '../css/common.css';
import 'firebase/auth';


/*

      
      //this gets us an ID token; we should do something with it....
      firebase.auth().currentUser.getIdToken(false).then(idToken => {
        
        axios.get(`${config.api}/users/${response.uid}`, {headers: {'Authorization': idToken}})

        //no response requested here - intention is to do a 'get info', and on the other side if the account doesn't exist but the authorization is correct we have to create it.
        //Might be better to use this logic everywhere EXCEPT here, since we don't actually do anything with the information on this page.
        //Alternative would be to have the user info as a global element, but that seems ineffecient given the lack of challenge data needed.
        //So maybe tweak the API to only deliver some data?

        window.location.href = "/challenges";
      }).catch(function(error) {
        console.log(error);
      });
*/


class Challenges extends React.Component {
    state = {
        ownedChallenges: [],
        joinedChallenges: [],
        notEnrolled: [],
        showNewChallenge: false
    };

    componentDidMount() {
        this.getUserChallenges();

    }

    closeModal() {
        this.setState({ showNewChallenge: false });
    }


    getUserChallenges() {

        axios.get(`${config.api}/getUserChallenges?id=${this.props.userId}`).then(res => {
            this.setState({
                ownedChallenges: res.data.owned,
                joinedChallenges: res.data.joined,
                notEnrolled: res.data.notEnrolled
            })
        })
    }

    getPublicChallenges() {

    }

    enrollInChallenge(challengeId) {
        axios.get(`${config.api}/enrollUserInChallenge?challenge=${challengeId}&user=${this.props.userId}`).then(res => {
            this.getUserChallenges();
        })
    }


    render() {

        return (
            <div className="App">
                <h2>Challenges</h2>
                <br />
                {this.state.showNewChallenge ?
                    <NewChallenge
                        closeModal={this.closeModal.bind(this)}
                        userId={this.props.userId}
                    />
                    :
                    null}
                <span onClick={() => { this.setState({ showNewChallenge: true }) }}>New Challenge</span>
                <br />
                <div className="grid-3 grid-1-sm">
                    <p>Owned Challenges:</p><br />
                        {this.state.ownedChallenges.map(challenge => (
                            <div key={challenge.challengeName}>
                                <a href={`/dashboard?challenge=${challenge.challengeId}`}>
                                    {challenge.challengeName}</a> <a href={`/challenge-admin?challenge=${challenge.challengeId}`}>[Admin]</a>
                            </div>
                        ))}
                        <br /><br />
                    Joined Challenges: <br />
                        {this.state.joinedChallenges.map(challenge => (
                            <div key={challenge.challengeName + "div"}>
                                <a href={`/dashboard?challenge=${challenge.challengeId}`}>
                                    {challenge.challengeName}
                                </a><br />
                            </div>
                        ))}
                        <br /><br />
                        <p>Available Challenges:</p> <br />
                        {this.state.notEnrolled.map(challenge => (
                            <div key={challenge.challengeName + "div"}>
                                <a href={`/dashboard?challenge=${challenge.challengeId}`}>
                                    {challenge.challengeName}
                                </a><span style={{cursor: "pointer"}} onClick={() => {this.enrollInChallenge(challenge.challengeId)}}>{` `}[Enroll]</span><br />
                            </div>
                        ))}
                        <br /><br />
                </div>


            </div>
        );
    }
}

export default Challenges;
