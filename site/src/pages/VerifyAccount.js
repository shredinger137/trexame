import React from 'react';
import axios from 'axios';
import { config } from "../config.js";

class VerifyAccount extends React.Component {

  state = {
    challengeId: "",
    challengeData: {},
    challengeAchievements: [],
    newSubmissionImage: ""
  }


  componentDidMount() {
   
  }

  componentDidUpdate(prevprops, prevstate) {

  }


  render() {
    return (
      <div className="App">
          Verify


      </div >
    );
  }
}

export default VerifyAccount;
