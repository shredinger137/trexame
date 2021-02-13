import React, { useEffect, useState } from 'react';
import { config } from '../config';
import axios from 'axios';

//No. Make the challenge dashboard or whatever a larger component where stats and dashboard are views. Or maybe just try a link component?

//The a href bit requires too much reload.

function Stats(props) {

  const [statsData, setStatsData] = useState({})
  const [marathonId, setMarathonId] = useState("")

  function getMarathonId() {
    const params = new URLSearchParams(window.location.search);
    if (params && params.get("challenge")) {

      axios.get(`${config.api}/stats/${params.get("challenge")}`).then(response => {

        //no conditional - doesn't have error handling

        setStatsData(response.data);

      })


    }
  }

  return (
    <>
      <h2>Challenge Name</h2>
      <p>[Dashboard] [Stats] [Community]</p>
    </>
  )

}


export default Stats;
