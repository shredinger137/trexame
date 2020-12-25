import React from 'react';
import axios from 'axios';
import '../components/Signup';
import { config } from "../config.js";
import Achievements from '../components/Achievements';

import "../css/common.css"
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
        marathonDistance: 0,
        marathonName: "",
        challengeId: ""
    };

    componentDidMount() {
        this.initDate();
        this.getMarathonData();
        //  this.getUserData();
    }

    componentDidUpdate(prevprops, prevstate) {
        if (this.props.userId != prevprops.userId) {
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

    handleAddMiles(event) {
        event.preventDefault();
        var newMiles = document.getElementById("addMiles").value;
        document.getElementById("addMiles").value = "";
        var newDate = document.getElementById("date").value;
        var unixTime = ((new Date(newDate)).getTime());
        this.initDate();
        axios.get(`${config.api}/updateprogress?user=${this.props.userId}&distance=${newMiles}&date=${unixTime}&challenge=${this.state.challengeId}`).then(res => {
            this.getUserData()
        }

        )
    }

    handleDeleteDate(value) {
        axios.get(`${config.api}/updateprogress?user=${this.props.userId}&distance=0&date=${value}&challenge=${this.state.challengeId}`).then(res => {
            this.getUserData()
        }
        )
    }


    getUserData() {
        axios.get(`${config.api}/getUserChallengeData?user=${this.props.userId}&challenge=${this.state.challengeId}`).then(res => {
            this.setState({ progressEntries: res.data });
            this.setState({ progressSorted: this.getDates() });
        })
    }

    getMarathonData() {
        var challengeId = this.getMarathonId();
        if (challengeId) {
            this.setState({ challengeId: challengeId });
        }
        axios.get(`${config.api}/getChallengeData?challengeId=${challengeId}`).then(res => {
            this.setState({
                challengeName: res.data.challengeName,
                marathonDistance: res.data.targetMiles,
                challengeAchievements: res.data.achievements,
                challengeUnits: res.data.targetUnits
            });

            this.getUserData()


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

        for (var date in this.state.progressEntries) {
            var timestamp = new Date(Math.floor(date))
            var dateString = (timestamp.getMonth() + 1) + "-" + (timestamp.getUTCDate()) + "-" + (timestamp.getFullYear());
            datesArray.push([dateString, this.state.progressEntries[date], date]);
            total = total + this.state.progressEntries[date];
        }
        this.setState({ progressTotal: total, progressTotalPercent: Math.floor(((total / this.state.marathonDistance)) * 100) });
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
                <h2>{this.state.challengeName}</h2>
                <div>
                    <div id="progress-header" style={{ textAlign: "left", width: "75vw", margin: "0 auto", marginBottom: "10px" }}>
                        <span style={{ fontWeight: 700 }}>Overall<br /></span>
                        <span>{this.state.progressTotal} of {this.state.marathonDistance}  {this.state.challengeUnits} ({this.state.progressTotalPercent}%)</span>
                    </div>
                    <div id="progress">
                        <div id="progressBar" style={{ width: this.state.progressTotalPercent + "%", maxWidth: "100%" }}>
                        </div>
                    </div>
                    <div className="width-25 width-75-sm" style={{ margin: "0 auto", marginTop: "30px" }}>
                        <h4 style={{ marginBlockStart: 0, marginBlockEnd: 0, marginBottom: "5px" }}>New Entry</h4>
                        <form id="updateMilesForm" className="grid-2" onSubmit={this.handleAddMiles.bind(this)}>
                            <label className="form-label" htmlFor="addMiles" style={{ textAlign: "right", marginRight: "15px" }}>
                                Distance ({this.state.challengeUnits})
                            </label>
                            <input
                                className="width-100 px-3 py-2 form-input-shadow"
                                id="addMiles"
                                type="number"
                            />
                            <label className="form-label" htmlFor="date" style={{ textAlign: "right", marginRight: "15px" }}>
                                Date
                            </label>
                            <input
                                className="width-100 px-3 py-2 form-input-shadow"
                                id="date"
                                type="date"
                            />
                            <div></div>
                            <button type="submit" className="submit-button-round-blue">Submit</button>
                        </form>
                    </div>
                    <br />
                    <details>
                        <summary>View Entries</summary>
                        <table>
                            <tbody>
                                {this.state.progressSorted.map(
                                    date => (
                                        <tr key={date[0]}>
                                            <td><span>{date[0]}:{"  "}</span></td><td><span>{"  "}{date[1]} {this.state.challengeUnits} </span><span onClick={() => { this.handleDeleteDate(date[2]) }}>[Delete]</span></td>
                                        </tr>
                                    )

                                )}
                            </tbody>
                        </table>
                    </details>
                    <div id="notFound" style={{ display: "none" }}><p>The requested ID was not found. Please check your email for the correct link, or write to <a href="mailto:admin@rrderby.org">admin@rrderby.org</a> for help.</p></div>
                    <br />
                    <h3>Achievements</h3>
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
