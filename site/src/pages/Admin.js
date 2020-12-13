import React from 'react';
import axios from 'axios';
import { config } from "../config.js";

class Admin extends React.Component {

  state = {
    challengeId: "",
    challengeData: {},
    challengeAchievements: [],
    newSubmissionImage: ""
  }


  componentDidMount() {
    this.getChallengeId();
  }

  componentDidUpdate(prevprops, prevstate) {
    if (prevstate.challengeId != this.state.challengeId) {
      this.getChallengeData();
    }
  }

  getChallengeId() {
    const params = new URLSearchParams(window.location.search);
    if (params && params.get("challenge")) {
      this.setState({ challengeId: params.get("challenge") });
      this.getChallengeData();
    } else return false;
  }

  getChallengeData() {
    axios.get(`${config.api}/getChallengeData?challengeId=${this.state.challengeId}&admin=true`).then(res => {
      this.setState({ challengeData: res.data });
      if (res.data.achievements) {
        this.setState({ challengeAchievements: res.data.achievements });
      }
    })
  }

  saveData(e) {
    e.preventDefault();
    var challengeDataUpdated = `challengeName=${document.getElementById("name").value}&targetMiles=${document.getElementById("miles").value}&description=${document.getElementById("description").value}`;
    console.log(challengeDataUpdated);
    axios.get(`${config.api}/updateChallengeData?challengeId=${this.state.challengeId}&${encodeURI(challengeDataUpdated)}`).then(res => {

    })

  }

  //TODO: Handle response on both of these.

  submitNewAchievement(e) {
    console.log("new");
    e.preventDefault();
    var newAchivementData = `name=${document.getElementById("newAchievementName").value}&distance=${document.getElementById("newAchievementDistance").value}&description=${document.getElementById("newAchievementDescription").value}&image=${this.state.newSubmissionImage}`;
    axios.get(`${config.api}/submitNewAchievement?challengeId=${this.state.challengeId}&${encodeURI(newAchivementData)}`).then(res => {
      this.getChallengeData();
      document.getElementById("newAchievementName").value = "";
      document.getElementById("newAchievementDistance").value = "";
      document.getElementById("newAchievementDescription").value = "";
    })
  }

  handleImageUpload(e) {
  
    e.preventDefault();
    var file = e.target.files[0];
    const data = new FormData();
    data.append('file', file);
    data.append('challengeId', this.state.challengeId);
    const headerConfig = {
      headers: {
        'content-type': 'multipart/form-data' 
      }
    };

    axios.post(`${config.api}/uploadImage?challengeId=${this.state.challengeId}`, data, headerConfig).then(res => {
      if(res && res.data){
        this.setState({newSubmissionImage: res.data});
      }
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
            <input type="text" id="name" defaultValue={this.state.challengeData.challengeName} />
            <label>Target Miles:</label>
            <input type="number" id="miles" defaultValue={this.state.challengeData.targetMiles}></input>
            <label>Description:</label>
            <textarea id="description" defaultValue={this.state.challengeData.description}></textarea>
          </div>
          <br />
          <input type="submit" value="Update" />
          </form>
          <br /><br />
          <p>Challenge Achievements</p>
          <br />
          <form id="newAchivementForm" onSubmit={this.submitNewAchievement.bind(this)}>
            <div className="achievementEditWrapper form grid-2 formWrapper" style={{ margin: "0 auto", width: "80vw" }}>
              <label>Name:</label>
              <input id="newAchievementName" required>
              </input>
              <label>Distance (Miles): </label>
              <input type="number" id="newAchievementDistance" required></input>
              <label>Description:</label>
              <textarea id="newAchievementDescription"></textarea>
              <label>Image:</label>
              <input type="file" onChange={this.handleImageUpload.bind(this)} accept="image/png, image/jpeg" required></input>
                          </div>


            <input type="submit" value="Add New Achivement" />
            <br />
          
          </form>
          {this.state.newSubmissionImage ? 
              <div className="achievementsItemWrapper">
                <img src={`${config.uploadedImagesRoot}/${this.state.challengeId}/${this.state.newSubmissionImage}`} style={{width: "150px"}}></img>
              </div>
                 : null}
          {this.state.challengeAchievements.map(achievement => (
            <form>
              <div className="achievementEditWrapper form grid-2 formWrapper" style={{ margin: "0 auto", width: "80vw" }}>
                <label>Name:</label>
                <span style={{textAlign: "left"}}>
                {achievement.name}
                </span>
                <label>Distance (Miles): </label>
                <span style={{textAlign: "left"}}>
                {achievement.distance}
                </span>
                <label>Description:</label>
                <span style={{textAlign: "left"}}>{achievement.description}</span>
                <label>Image:</label>
                <img src={`${config.uploadedImagesRoot}/${this.state.challengeId}/${achievement.image}`} style={{width: "150px"}} />
              </div>
              <br />
            </form>
          ))}

     
      </div >
    );
  }
}

export default Admin;
