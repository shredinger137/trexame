import React from 'react';
import Signup from './Signup';

class Front extends React.Component {

  state = {
    email: "",
    id: ""
  };

  render() {
    return (

        <div>
          <br/><br/>
          <p>
            <Signup />
          </p>
        </div>

    );
  }
}

export default Front;
