/* eslint eqeqeq: "off", no-extend-native: "off", no-throw-literal: "off" */

import React from 'react';

import './css/common.css'

import { Route, Switch, BrowserRouter } from "react-router-dom";
import Stats from './pages/Stats';
import './components/Signup';

import Signup from './components/Signup';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Login from './components/Login';
import Challenges from './pages/Challenges';
import Admin from './pages/Admin';
import AccountSettings from './pages/AccountSettings'

import {useUser } from 'reactfire';


function App() {

  const { data: user } = useUser();

  return (

    <div className="App" style={{ minHeight: "100vh" }}>
      <BrowserRouter>
        <div>
          <Header />
          {user ?

            <Switch>
              <>
                <Route path="/dashboard">
                  <Dashboard
                    username={user.displayName}
                    userId={user.uid}
                  />
                </Route>
                <Route path="/challenge-admin">
                  <Admin
                  />
                </Route>
                <Route path="/stats" component={Stats} />
                <Route path="/challenges"
                  component={() =>
                    <Challenges userId={user.uid} />
                  }
                />
                <Route path="/login"
                  component={() =>
                    <Challenges userId={user.uid} />
                  }
                />

                <Route path="/account"
                  component={() =>
                    <AccountSettings />
                  }
                />

                <Route exact path="/" component={Challenges} />

              </>

            </Switch>

            :

            <Switch>
              <>
                <Route path="/signup" component={() => <Signup />} />
                <Route path="/login" component={() => <Login />} />
              </>

            </Switch>



          }
        </div>
      </BrowserRouter>
    </div >
  )
}

export default App;