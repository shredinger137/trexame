import React from 'react';
import './App.css';
import './css/common.css'
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Stats from './pages/Stats';
import './components/Signup';
import Cookies from 'js-cookie';
import axios from 'axios';
import { config } from "./config.js";

import Signup from './components/Signup';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Challenges from './pages/Challenges';


var jwt = require('jsonwebtoken');

class App extends React.Component {


  constructor(props) {
    super(props);
    this.checkLogin = this.checkLogin.bind(this);
  }

  state = {
    showSignup: false,
    isLoggedIn: null,
    username: "",
    userId: "",
    showLogIn: false
  };

  componentDidMount() {
    this.checkLogin();
  }

  componentDidUpdate(){
    
  }

  handleSignUpClick = () => {
    this.setState({
      showSignup: !this.state.showSignup
    });
  }

  handleLoginClick = () => {
    this.setState({
      showLogIn: !this.state.showLogIn
    });
  }

  checkLogin() {
    var token = Cookies.get('token') ? Cookies.get('token') : false;
    if (!token) {
      return false;
    }
    axios.get(config.api + "/verifytoken" + "?token=" + token).then(res => {

      if (res.data === "Valid" && jwt.decode(token) && jwt.decode(token)['username'] && jwt.decode(token)['id']) {
        this.setState({ isLoggedIn: true, username: jwt.decode(token)['username'], userId: jwt.decode(token)['id'] });
        return true;
      } return false;

    })

  }

  logOut() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      window.location.href = '/';
    }


  }



  render() {

    //<Route exact path={"/"} component={() => <Start socket={socket} addUser={addUser}/>}/>
    return (
      <div className="App">
        <Header
          handleSignUpClick={this.handleSignUpClick}
          handleLoginClick={this.handleLoginClick}
          isLoggedIn={this.state.isLoggedIn}
          username={this.state.username}
          logOut={this.logOut} />
        <h1>Virtual Marathon Tracker</h1>
        <BrowserRouter>
          <div>
            <Switch>
              {this.state.isLoggedIn ?
                <>
                  <Route path="/dashboard">
                    <Dashboard
                      checkLogin={this.checkLogin}
                      username={this.state.username}
                      userId={this.state.userId}
                    />
                  </Route>
                  <Route path="/stats" component={Stats} />
                  <Route path="/challenges"
                    component={() =>
                      <Challenges userId={this.state.userId} />
                    }
                  />
                  <Route exact path="/" component={Home} />
                </>
                :
                null
              }
              <Route path="/" component={Home} />
            </Switch>
          </div>
        </BrowserRouter>
        {this.state.showSignup ? <Signup handleSignUpClick={this.handleSignUpClick} handleLoginClick={this.handleLoginClick} isLoggedIn={this.state.isLoggedIn} username={this.state.username} /> : null}
        {this.state.showLogIn ? <Login checkLogin={this.checkLogin} handleSignUpClick={this.handleSignUpClick} handleLoginClick={this.handleLoginClick} isLoggedIn={this.state.isLoggedIn} username={this.state.username} /> : null}
      </div >
    );
  }
}

export default App;
