import React, { useEffect, useState } from 'react';
import { config } from '../config';
import axios from 'axios';

//In the next version, 'dashboard' should have a state for view and should update accordingly. Pass stats through that to keep the challenge. The top nav shouldn't change.


function Stats(props) {

  useEffect(() => {
    getMarathonId()
  }, [])

  const [statsData, setStatsData] = useState({})
  const [marathonId, setMarathonId] = useState("")

  function getMarathonId() {
    const params = new URLSearchParams(window.location.search);
    if (params && params.get("challenge")) {

      axios.get(`${config.api}/stats/${params.get("challenge")}`).then(response => {

        //no conditional - doesn't have error handling

        setStatsData(response.data);
        setMarathonId(params.get("challenge"))
        console.log(response.data);

      })


    }
  }

  return (

    <div className="App">
      <h2>Stats</h2>
      <p><a href={`/dashboard?challenge=${marathonId}`}>[Dashboard]</a> [Stats] [Community]</p>
      <p>This needs work - create stats object and cron job, determine what goes here.</p>
      <p>Total Users: {statsData.totalUsers}<br/>
        Combined Distance: {statsData.combinedMiles}
      </p>
    </div>

  )

}


export default Stats;
