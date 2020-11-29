import React from 'react';
import { config } from '../config';
import axios from 'axios';

class Stats extends React.Component {

  state = {
    combinedMiles: 0,
    totalUsers: 0,
    distanceByDate: {},
    distanceGraphData: [],
    distanceGraphLabels: [],
    leaderboard: [],
    completedFull: []
  };

  componentDidMount() {
    this.getStats();
  }

  getStats() {
    axios.get(`${config.api}/getstats`).then(res => {
      var statData;
      var completedData;
      var graphData = [];
      if (res && res.data && res.data[0]) {
        statData = res.data[0];
      }
      //This is super ugly and should probably be rethought.
      if (res && res.data && res.data[1]) {
        completedData = res.data[1];
        console.log(completedData["completedFullMarathon"]);
      }

      if (statData["combinedMiles"]) {
        this.setState({ combinedMiles: statData["combinedMiles"] });
      }
      if (statData["totalUsers"]) {
        this.setState({ totalUsers: statData["totalUsers"] });
      }
      if (statData["leaderBoardByDistance"]) {
        this.setState({ leaderboard: statData["leaderBoardByDistance"] });
        console.log(statData["leaderBoardByDistance"])
      }
      if (completedData && completedData["completedFullMarathon"]) {
        this.setState({ completedFull: completedData["completedFullMarathon"] });
        console.log(completedData["completedFullMarathon"]);
      }
      if (statData["distanceByDate"]) {
        this.setState({ distanceByDate: statData["distanceByDate"] });
        var allDates = Object.keys(statData["distanceByDate"]);
        for (var date of allDates) {
          graphData.push(statData.distanceByDate[date]);
        }
        this.setState({ distanceGraphData: graphData, distanceGraphLabels: allDates });
      }

    })
  }


  render() {
    return (
      <div className="App">
        <p>Participants: <strong>{this.state.totalUsers}</strong>
          <br />
          Combined Miles: <strong>{this.state.combinedMiles}</strong></p>
        <br />
        <h3>Leaderboards</h3>

        <div className="statsWrapper">
          <div>
            <span><b>Overall Distance</b></span>
            <br /><br />
            <table className="leaderboard">
              <tbody>
                {this.state.leaderboard.map(
                  user => (
                    <tr key={user.name}>
                      <td>
                        <span className="small">{user.name}</span>
                      </td>
                      <td><span className="small">{user.totalDistance}{" "}Miles</span></td>
                    </tr>
                  )

                )}

              </tbody>
            </table>
          </div>
          <div>
            <span><b>Hall of Heroes</b></span>
            <br /><br />
            <span><i>These brave skaters have completed or surpassed the challenge of the Full Bay Marathon.</i></span>
            <br /><br />
            <table className="leaderboard">
              <tbody>
                {this.state.completedFull.map(
                  user => (
                    <tr key={user.name + 'completed'}>
                      <td>
                        <span className="small">{user.name}</span>
                      </td>
                      <td><span className="small">{user.totalDistance}{" "}Miles</span></td>
                    </tr>
                  )

                )}

              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default Stats;
