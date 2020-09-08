import React from 'react';
import '../App.css';
import '../css/common.css'
import axios from 'axios';
import '../components/Signup';
import { config } from "../config.js";
import NewChallenge from '../components/NewChallenge';


class Challenges extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
       challenges: {},
       showNewChallenge: false
    };

    componentDidMount() {

    }

    closeModal(){
        this.setState({showNewChallenge: false});
    }


    render() {

        return (
            <div className="App">
                <h2>Challenges</h2>
                <br />
                {this.state.showNewChallenge ? <NewChallenge closeModal={this.closeModal.bind(this)}/> : null}
                <span onClick={() => {this.setState({showNewChallenge: true})}}>New Challenge</span>
                <br/>
                <div className="grid-3 grid-1-sm">
                    <p>This would be where challenges would go if they existed. Also, haven't made the grids in CSS yet.</p>
                </div>


            </div>
        );
    }
}

export default Challenges;
