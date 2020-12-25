import React from 'react';
import axios from 'axios';
import '../components/Signup';
import { config } from "../config.js";
import NewChallenge from '../components/NewChallenge';
import '../css/modal.css';
import '../css/common.css';


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

    componentDidUpdate() {

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
                    <p>Owned Challenges:<br />
                        {this.state.ownedChallenges.map(challenge => (
                            <div>
                                <a href={`/dashboard?challenge=${challenge.challengeId}`}>
                                    {challenge.challengeName} <a href={`/challenge-admin?challenge=${challenge.challengeId}`}>[Admin]</a>
                                </a>
                            </div>
                        ))}
                        <br /><br />
                    Joined Challenges: <br />
                        {this.state.joinedChallenges.map(challenge => (
                            <div>
                                <a href={`/dashboard?challenge=${challenge.challengeId}`}>
                                    {challenge.challengeName}
                                </a><br />
                            </div>
                        ))}
                        <br /><br />
                        Available Challenges: <br />
                        {this.state.notEnrolled.map(challenge => (
                            <div>
                                <a href={`/dashboard?challenge=${challenge.challengeId}`}>
                                    {challenge.challengeName}
                                </a><span style={{cursor: "pointer"}} onClick={() => {this.enrollInChallenge(challenge.challengeId)}}>{` `}[Enroll]</span><br />
                            </div>
                        ))}
                        <br /><br />
                    </p>
                </div>


            </div>
        );
    }
}

export default Challenges;
