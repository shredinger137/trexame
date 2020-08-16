import React from 'react';
import '../App.css';
import '../css/common.css'

//This has turned into a front page. Apparently
//it's not a form component anymore. Oh well.

class Admin extends React.Component {
  constructor(props) {
    super(props);


  }

  state = {
    users: {}
  };


  handleFormChange(event) { }

  render() {
    return (
      <div className="App">
      
      </div>
    );
  }
}

export default Admin;
