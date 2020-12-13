import React from 'react';
import axios from 'axios';
import '../components/Signup';
import { config } from "../config.js";
import Achievements from '../components/Achievements';

import "../css/dashboard.css"


class Dashboard extends React.Component {


    state = {
        marathonName: "",
        targetMiles: 0,
        userData: {
            progress: {},
            marathon: "bridging",
            name: ""
        },
        progressEntries: {},
        progressSorted: [],
        progressTotal: 0,
        progressTotalPercent: 0,
        marathonDistance: 42,
        marathonName: "",
        challengeId: ""
    };

    componentDidMount() {
        this.initDate();
        this.getMarathonData();
        this.getUserData();
    }

    componentDidUpdate(prevprops, prevstate) {
        if(this.props.userId != prevprops.userId){
            this.getUserData();
        }
        
    }

    initDate() {
        var d = new Date();
        var month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        document.getElementById('date').value = [year, month, day].join('-');

    }

    //TODO: Challenge isn't a state item.
    //Date should be in unix time

    handleAddMiles(event) {
        event.preventDefault();
        var newMiles = document.getElementById("addMiles").value;
        document.getElementById("addMiles").value = "";
        var newDate = document.getElementById("date").value;
        var unixTime = ((new Date(newDate)).getTime());
        this.initDate();
        console.log(unixTime);
        axios.get(`${config.api}/updateprogress?user=${this.props.userId}&distance=${newMiles}&date=${unixTime}&challenge=${this.state.challengeId}`).then(
            //put something here to load the latest data
        )
    }


    getUserData() {
        console.log("userdata");
        axios.get(`${config.api}/getUserChallengeData?user=${this.props.userId}&challenge=${this.state.challengeId}`).then(res => {
            console.log(res);
            this.setState({progressEntries: res.data });
            this.setState({progressSorted: this.getDates()})
        })
    }

    getMarathonData() {
        var challengeId = this.getMarathonId();
        if(challengeId){
            this.setState({challengeId: challengeId});
        }
        axios.get(`${config.api}/getChallengeData?challengeId=${challengeId}`).then(res => {
            this.setState({
                challengeName: res.data.challengeName,
                targetMiles: res.data.targetMiles,
                challengeAchievements: res.data.achievements
            });
            console.log(res.data.achievements);
          
        })
    }

    getMarathonId() {
        const params = new URLSearchParams(window.location.search);
        if (params && params.get("challenge")) {
            return params.get("challenge");
        }
    }

    

    handlePublicOption() {
        var value = document.getElementById("publicToggle").checked;
        axios.get(`${config.api}/updatePublicOption?user=${this.state.id}&value=${value}`);
    }

    handleNotFound() {
        document.getElementById("notFound").style.display = "block";
        document.getElementById("updateMilesForm").style.display = "none";
    }

    getDates() {
        
        var total = 0;
        var datesArray = [];
        console.log(this.state.progressEntries);

 
        for (var date in this.state.progressEntries) {
            console.log(date);
            var timestamp = new Date(Math.floor(date))
            var dateString = (timestamp.getMonth() + 1) + "-" + (timestamp.getUTCDate()) + "-" + (timestamp.getFullYear());
            datesArray.push([dateString, this.state.progressEntries[date]]);
            total = total + this.state.progressEntries[date];
        }
        this.setState({progressTotal: total, progressTotalPercent: ((total / this.state.marathonDistance)) * 100});
        return datesArray;
    }

    handleUpdateMarathon(event) {
        event.preventDefault();
        var newMarathonShortname = document.getElementById("marathon").value;
        axios.get(`${config.api}/updatemarathon?user=${this.state.id}&marathon=${newMarathonShortname}`).then(res => {
            this.getID();
        });
    }


    openOptionsModal() {

    }

    render() {

        return (
            <div className="App">
                <h2>Dashboard</h2>
                <div>
                    <div id="progress">
                        <div id="progressBar" style={{ width: this.state.progressTotalPercent + "%", maxWidth: "100%" }}>
                        </div>
                    </div>
                    <span id="progressText" style={{ width: "50vw" }}>{this.state.progressTotal} / {this.state.marathonDistance}</span>
                    <br />
                    <span>Your Marathon: {this.state.challengeName} ({this.state.targetMiles} miles)</span>
                    <br />
                    <br />
                    <form id="updateMilesForm" onSubmit={this.handleAddMiles.bind(this)}>
                        <br />
                        <table>
                            <tbody>
                                <tr>
                                    <td style={{ textAlign: "left" }}>
                                        <label htmlFor="addMiles"><span>Distance (miles):{" "}</span></label>
                                    </td>
                                    <td >
                                        <input id="addMiles"></input>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ textAlign: "left" }}>
                                        <label htmlFor="date"><span>Date:{" "}</span></label>
                                    </td>
                                    <td>
                                        <input id="date" type="date"></input>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <button type="submit">Submit</button>
                        <br /><br />
                      </form>
                    <br />
                    <br />
                    <div>
                        <span>Total: {this.state.progressTotal} / {this.state.marathonDistance}{" "} Miles</span>
                        <br /><br />
                    </div>
                    <table>
                        <tbody>
                            {this.state.progressSorted.map(
                                date => (
                                    <tr key={date[0]}>
                                        <td><span>{date[0]}:{"  "}</span></td><td><span>{"  "}{date[1]} Miles</span></td>
                                    </tr>
                                )

                            )}
                        </tbody>
                    </table>
                    <div id="notFound" style={{ display: "none" }}><p>The requested ID was not found. Please check your email for the correct link, or write to <a href="mailto:admin@rrderby.org">admin@rrderby.org</a> for help.</p></div>
                    <br />
                    <h3>Achievements: {this.state.marathonName}</h3>
                    <Achievements 
                        miles={this.state.progressTotal} 
                        marathon={this.state.userData.marathon}
                        achievements={this.state.challengeAchievements}
                        challengeId={this.state.challengeId} 
                    />
                    <br /><br />
                </div>
            </div>
        );
    }
}

export default Dashboard;
