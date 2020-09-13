import React from 'react';
import '../App.css';
import '../css/common.css'
import axios from 'axios';
import '../components/Signup';
import { config } from "../config.js";
import Achievements from '../components/Achievements';


class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.initDate = this.initDate.bind(this);
    }

    state = {
        userData: {
            progress: {},
            marathon: "bridging",
            name: ""
        },
        progressSorted: [],
        progressTotal: 0,
        progressTotalPercent: 0,
        id: "",
        marathonDistance: 42,
        marathonName: ""
    };

    componentDidMount() {
        this.initDate();
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
        this.initDate();
        axios.get(`${config.api}/updateprogress?user=${this.props.userId}&distance=${newMiles}&date=${newDate}`).then(res => this.getID())
    }

//TODO: All of this.
//Get user data. Change the API to get user data and data related to, specifically, challenges.

    getMarathonFromId(){
        const params = new URLSearchParams(window.location.search);
        if (params && params.get("challenge")) {
            this.setState({
                challengeId: params.get("challenge")
            })
        }
    }

    getIDOld() {
        const params = new URLSearchParams(window.location.search);
        if (params && params.get("id")) {
            var id = params.get("id");
            this.setState({ id: id });
            axios.get(`${config.api}/userdata?user=${id}`).then(res => {
                if (res && res.data && res.data != "id_not_found") {

                    if (res.data.marathon == "bridging") {
                        this.setState({ marathonDistance: 42, marathonName: "Bridging!" });
                    }
                    if (res.data.marathon == "fullBay") {
                        this.setState({ marathonDistance: 155, marathonName: "Full Bay" });
                    }
                    if (res.data.marathon == "mini") {
                        this.setState({ marathonDistance: 3.4, marathonName: "Mini Marathon" });
                    }

                    document.getElementById("marathon").value = res.data.marathon;

                    this.setState({ userData: res.data });
                    var progressArray = [];
                    var total = 0;
                    for (var progressDate in this.state.userData.progress) {
                        progressArray.push([progressDate, this.state.userData.progress[progressDate]])
                        total = total + parseFloat(this.state.userData.progress[progressDate]);
                    }
                    total = Math.floor(total * 1000) / 1000;
                    var totalPercent = Math.floor((total / this.state.marathonDistance) * 10000) / 100;
                    if (totalPercent > 100) { totalPercent = 100 }
                    if (totalPercent < 5) {
                        if (document.getElementById("progressText") !== null) {
                            document.getElementById("progressText").style.display = "none";
                        }
                    }
                    else {
                        if (document.getElementById("progressText") !== null) {
                            document.getElementById("progressText").style.display = "block";
                        }
                    }

                    if (res.data && res.data.allowPublic && res.data.allowPublic == "true") {
                        document.getElementById("publicToggle").checked = true;
                    }

                    this.setState({
                        progressTotal: total,
                        progressTotalPercent: totalPercent
                    });
                    var sorted = this.sortDates();
                    this.setState({ progressSorted: sorted });

                } else { this.handleNotFound(); }

            })
        } else { console.log("id not found"); }
    }

    handlePublicOption() {
        var value = document.getElementById("publicToggle").checked;
        axios.get(`${config.api}/updatePublicOption?user=${this.state.id}&value=${value}`);
    }

    handleNotFound() {
        document.getElementById("notFound").style.display = "block";
        document.getElementById("updateMilesForm").style.display = "none";
    }

    sortDates() {
        var progress = this.state.userData.progress;
        var sortableArray = [];
        for (var date in progress) {
            var convertedDate = new Date(date).getTime();
            sortableArray.push([date, convertedDate]);

        }

        sortableArray.sort(function (a, b) {
            if (a[1] === b[1]) {
                return 0;
            }
            else {
                return (a[1] < b[1]) ? -1 : 1;
            }
        })

        for (var date of sortableArray) {
            date[1] = this.state.userData.progress[date[0]];
            date[0] = date[0].replace("2020-", "");
        }
        return sortableArray.reverse();
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
                <h3>{this.state.id}</h3>
                <h3>{this.state.userData.name}</h3>
                <div>
                    <div id="progress">
                        <div id="progressBar" style={{ width: this.state.progressTotalPercent + "%" }}>
                            <span id="progressText" style={{ width: "50vw" }}>{this.state.progressTotal} / {this.state.marathonDistance}</span>
                        </div>
                    </div>
                    <br />
                    <span>Your Marathon: {this.state.marathonName} ({this.state.marathonDistance} miles)</span>
                    <br />
                    <br />
                    <form id="updateMilesForm" onSubmit={this.handleAddMiles.bind(this)}>
                        <p className="introText" style={{textAlign: "center"}}>Enter your distance and the date to record progress. Enter a '0' for any date to remove it.</p>
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
                        <span className="small">Make my progress public:</span>

                        <input type="checkbox" id="publicToggle" onChange={this.handlePublicOption.bind(this)} />

                    </form>
                    <br />
                    <form id="updateMarathon" onSubmit={this.handleUpdateMarathon.bind(this)}>
                        <label htmlFor="marathon">Change Marathon: </label>
                        <select id="marathon">
                            <option value="fullBay">Full Bay (155 miles)</option>
                            <option value="bridging">Bridging (42 miles)</option>
                            <option value="mini">Mini Marathon (3.4 miles)</option>
                        </select>
                        <button type="submit">Save</button>
                    </form>
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
                    <h3>Achievements/Landmarks: {this.state.marathonName}</h3>
                    <Achievements miles={this.state.progressTotal} marathon={this.state.userData.marathon} />
                    <br /><br />
                </div>
            </div>
        );
    }
}

export default Dashboard;
