//next: change the date storage to be unix date for easy sorting in the database

import React from 'react';

import './css/commonStyles.css' //TODO: This is replacing common.css; fill it out with that content

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
import Admin from './pages/Admin';


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

    //TODO: This is a placeholder that doesn't do anything.
    //In the future, we want to check if we're on a subdomain,
    //then potentially set challengeId based on it. We can also
    //consider using it to have 'creat account' automatically enroll.

    let host = window.location.host;
    let parts = host.split(".");
    let subdomain = "";
    // If we get more than 3 parts, then we have a subdomain
    // INFO: This could be 4, if you have a co.uk TLD or something like that.
    if (parts[0] && parts[0] != "trexa" && parts[0] != "www") {
      subdomain = parts[0];
      console.log(subdomain);
    }
  }

  componentDidUpdate() {

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

    return (
      <div className="App">
        <Header
          handleSignUpClick={this.handleSignUpClick}
          handleLoginClick={this.handleLoginClick}
          isLoggedIn={this.state.isLoggedIn}
          username={this.state.username}
          logOut={this.logOut} />
        <BrowserRouter>
          <div>
            <Switch>
              <>
                <Route path="/dashboard">
                  <Dashboard
                    checkLogin={this.checkLogin}
                    username={this.state.username}
                    userId={this.state.userId}
                  />
                </Route>
                <Route path="/challenge-admin">
                  <Admin
                  />
                </Route>
                <Route path="/stats" component={Stats} />
                <Route path="/challenges"
                  component={() =>
                    <Challenges userId={this.state.userId} />
                  }
                />
                <Route path="/signup"
                  component={() =>
                    <Signup />
                  }
                />
                <Route path="/login"
                  component={() =>
                    <Login
                      checkLogin={this.checkLogin}
                      isLoggedIn={this.state.isLoggedIn}
                      username={this.state.username} />
                  }
                />
                <Route exact path="/" component={Home} />


              </>

              <Route path="/" component={() => <Home isLoggedIn={this.state.isLoggedIn} />} />
            </Switch>
          </div>
        </BrowserRouter>
      </div >
    );
  }
}

export default App;
