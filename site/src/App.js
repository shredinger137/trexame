/* eslint eqeqeq: "off", no-extend-native: "off", no-throw-literal: "off" */

import React from 'react';

import './css/common.css'

import { Route, Switch, BrowserRouter } from "react-router-dom";
import Stats from './pages/Stats';
import './components/Signup';

import Signup from './components/Signup';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Challenges from './pages/Challenges';
import Admin from './pages/Admin';
import ResetPassword from './components/ResetPassword'
import AccountSettings from './pages/AccountSettings'
import firebase from 'firebase'


import AuthProvider from './components/AuthProvider'


class App extends React.Component {

  state = {
    isLoggedIn: null,
    username: "",
    userId: "",
  };

  componentDidMount() {

  }

  componentDidUpdate() {

  }

  logOut() {
    firebase.auth().signOut();
    this.setState({
      isLoggedIn: false,
      username: "",
      userId: ""
    })
  }

  getData(arg) {
    if (arg) {
      this.setState({
        isLoggedIn: true,
        username: arg.displayName,
        userId: arg.uid
      })
    }
  }


  render() {

    return (
      <div className="App" style={{ minHeight: "100vh" }}>
        <AuthProvider
          getData={this.getData.bind(this)}
          username={this.state.username}
        />

        <BrowserRouter>
          <div>
            <Header
              isLoggedIn={this.state.isLoggedIn}
              username={this.state.username}
              logOut={this.logOut.bind(this)} />
            <Switch>
              <>
                <Route path="/dashboard">
                  <Dashboard
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
                      isLoggedIn={this.state.isLoggedIn}
                      username={this.state.username} />
                  }
                />
                <Route path="/resetpassword"
                  component={() =>
                    <ResetPassword />
                  }
                />

                <Route path="/account"
                  component={() =>
                    <AccountSettings />
                  }
                />

                <Route path="/newpassword"
                  component={() =>
                    <Login
                      isLoggedIn={this.state.isLoggedIn}
                      username={this.state.username}
                      reset={true}

                    />
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