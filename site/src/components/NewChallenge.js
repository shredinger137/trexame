import React from 'react';
import '../App.css';
import { config } from "../config.js";
import axios from 'axios';
import '../css/common.css'
import '../css/modal.css'



class NewChallenge extends React.Component {
  

  stopProp = (e) => {
    e.stopPropagation();
  }

  createNewChallenge(e){
    e.preventDefault();
    var marathonName = document.getElementById('challengeName').value;
    var targetMiles = document.getElementById('miles').value;

    //TODO: API call that actually creates the thing and gets a response. Don't forget you need to get an ID and use credentials.
    //You should probably be checking credentials with every API call later.
    
  }


  render() {
    return (
      <div className="modalWrapper" onClick={() => this.props.closeModal()}>
        <div className="modalInner" onClick={this.stopProp}>
          <br /><br /><br />
          <h3>New</h3><br /><br />
          <p>This doesn't do anything yet</p>
          <form onSubmit={this.createNewChallenge.bind(this)}>
            <label><span> Challenge Name:{" "}</span>
              <input id="challengeName" />
            </label>
            <br />
            <label> <span>Target Miles:{" "}</span>
              <input type="number" id="miles"></input>
            </label>
            <br />
            <br /><br />
            <input type="submit" value="Log In" />
          </form>

        </div>
      </div>
    );
  }
}

export default NewChallenge;
