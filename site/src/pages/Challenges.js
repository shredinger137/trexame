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
        //TODO: Get and list both owned and participating challenges.
        //API does not respond with joinedChallenges yet.

        axios.get(`${config.api}/getUserChallenges?id=${this.props.userId}`).then(res => {
            this.setState({
                ownedChallenges: res.data.owned,
                joinedChallenges: res.data.joined
            })
            console.log(this.state.joinedChallenges);
            console.log(this.state.ownedChallenges);
        })
    }

    getPublicChallenges() {

    }

    enrollInChallenge(challengeId) {
        axios.get(`${config.api}/enrollUserInChallenge?challenge=${challengeId}&user=${this.props.userId}`).then(res => {
            //TODO: Display request result; update challenges list
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
                        Available Challenges: This is not yet implemented!
                    </p>
                </div>


            </div>
        );
    }
}

export default Challenges;
