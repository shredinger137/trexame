import React from 'react';
import axios from 'axios';
import { config } from "../config.js";

class Admin extends React.Component {

  state = {
    challengeId: "",
    challengeData: {}
  }


  componentDidMount(){
    this.getChallengeId();
  }

  componentDidUpdate(prevprops, prevstate){
    if(prevstate.challengeId != this.state.challengeId){
      this.getChallengeData();
    }
  }

  getChallengeId(){
      const params = new URLSearchParams(window.location.search);
      if (params && params.get("challenge")) {
          this.setState({challengeId: params.get("challenge")});
          this.getChallengeData();
    } else return false;
  }

  getChallengeData(){
    axios.get(`${config.api}/getChallengeData?challengeId=${this.state.challengeId}&admin=true`).then(res => {
      this.setState({challengeData: res.data})
    })
  }

  saveData(e){
    e.preventDefault();
    var challengeDataUpdated = `challengeName=${document.getElementById("name").value}&targetMiles=${document.getElementById("miles").value}&description=${document.getElementById("description").value}`;
    console.log(challengeDataUpdated);
    axios.get(`${config.api}/updateChallengeData?challengeId=${this.state.challengeId}&${encodeURI(challengeDataUpdated)}`).then(res => {

    })

  }

  render() {
    return (
      <div className="App">
        <p>Challenge Admin</p>
        <br /><br />
        <form id="challengeForm" onSubmit={this.saveData.bind(this)}>
          <div className="form grid-2 formWrapper" style={{ margin: "0 auto", width: "80vw" }}>
            <label>
              Challenge Name:
            </label>
            <input type="text" id="name" defaultValue={this.state.challengeData.challengeName}/>
            <label>Target Miles:</label>
            <input type="number" id="miles" defaultValue={this.state.challengeData.targetMiles}></input>
            <label>Description:</label>
            <textarea id="description" defaultValue={this.state.challengeData.description}></textarea>
          </div>
          <br />
          <input type="submit" value="Update" />

        </form>
      </div>
    );
  }
}

export default Admin;
