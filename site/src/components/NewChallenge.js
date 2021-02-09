import React from 'react';
import { config } from "../config.js";
import axios from 'axios';
import '../css/modal.css';
import firebase from 'firebase/app';

import 'firebase/auth'


class NewChallenge extends React.Component {

  componentDidUpdate() {

  }

  componentDidMount() {

  }

  stopProp = (e) => {
    e.stopPropagation();
  }

  createNewChallenge(e) {
    e.preventDefault();
    var marathonName = document.getElementById('challengeName').value;
    var targetMiles = document.getElementById('miles').value;
    var openEnrollment = document.getElementById('openEnrollment').value;


    firebase.auth().currentUser.getIdToken(false).then(idToken => {

      axios.post(`${config.api}/challenge`, {
        name: marathonName,
        miles: targetMiles,
        id: this.props.userId,
        //userId should be received through firebase, TODO
        authorization: idToken,
        public: openEnrollment

      }).then(res => {
        console.log(res)
      })

    })
  }




  render() {
    return (
      <div className="modalWrapper" onClick={() => this.props.closeModal()}>
        <div className="modalInner" onClick={this.stopProp}>
          <br /><br /><br />
          <h3>New Challenge</h3><br /><br />
          <form onSubmit={this.createNewChallenge.bind(this)}>
            <label><span> Challenge Name:{" "}</span>
              <input id="challengeName" />
            </label>
            <br />
            <label> <span>Target Miles:{" "}</span>
              <input type="number" id="miles"></input>
            </label>
            <label> <span>Open Enrollment?{" "}</span>
              <input type="checkbox" id="openEnrollment"></input>
            </label>
            <br />
            <br /><br />
            <input type="submit" value="Create" />
          </form>

        </div>
      </div>
    );
  }
}

export default NewChallenge;
