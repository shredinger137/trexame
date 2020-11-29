import React from 'react';
import { config } from "../config.js";
import axios from 'axios';
import '../css/modal.css';


class NewChallenge extends React.Component {

  componentDidUpdate(){

  }

  componentDidMount(){

  }

  stopProp = (e) => {
    e.stopPropagation();
  }

  createNewChallenge(e) {
    e.preventDefault();
    var marathonName = document.getElementById('challengeName').value;
    var targetMiles = document.getElementById('miles').value;

    axios.get(config.api + "/createChallenge" + "?name=" + marathonName + "&miles=" + targetMiles + "&id=" + this.props.userId).then(res => {
      //TODO: Respond to resolution
      console.log(res);
    }
    )
  }




  render() {
    return (
      <div className="modalWrapper" onClick={() => this.props.closeModal()}>
        <div className="modalInner" onClick={this.stopProp}>
          <br /><br /><br />
          <h3>New</h3><br /><br />
          <p>This doesn't do anything yet. {this.props.userId}</p>
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
