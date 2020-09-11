import React from 'react';
import '../App.css';
import '../css/common.css'
import axios from 'axios';
import '../components/Signup';
import { config } from "../config.js";
import NewChallenge from '../components/NewChallenge';


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
        axios.get(`${config.api}/getUserChallenges?id=${this.props.userId}`).then(res => {
            this.setState({
                ownedChallenges: res.data.owned,
                joinedChallenges: res.data.joined
            })
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
                                {challenge.challengeName} <br />
                            </div>
                        ))}
                        <br /><br />
                    Joined Challenges: <br />
                        {this.state.joinedChallenges.map(challenge => (
                            <div>
                                challenge.challengeName <br />
                            </div>
                        ))}
                    </p>
                </div>


            </div>
        );
    }
}

export default Challenges;
