import React from 'react';
import '../App.css';
import '../css/common.css'

class Front extends React.Component {

  state = {
    email: "",
    id: ""
  };

  render() {
    return (
      <div className="App">
        <div className="introText">
          <br/><br/>
          <p>
            This is a virtual marathon service. This is a development site, used while the service is being built. Features will slowly become available, but are likely to change.
          </p>
        </div>

        <br />


      </div>
    );
  }
}

export default Front;
