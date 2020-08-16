import React from 'react';
import './App.css';
import './css/common.css'
import { Route, Switch, BrowserRouter  } from "react-router-dom";
import Stats from './pages/Stats';
import './components/Signup';
import Signup from './components/Signup';
import Dashboard from './pages/Dashboard';


class App extends React.Component {

  state = {
  };

  render() {
    return (
      <div className="App">
        <h1>Skate the Bay</h1>
        <a href="/stats" style={{margin: "20px"}}>[Stats]</a><a href="/" style={{margin: "20px"}}>[Home]</a>
          <BrowserRouter>
            <div>
              <Switch>
                <Route path="/dashboard">
                  <Dashboard />
                </Route>
                <Route path="/stats">
                  <Stats />
                </Route>
                <Route path="/">
                  <Signup />
                </Route>
              </Switch>
              </div>
          </BrowserRouter>
      </div>
    );
  }
}

export default App;
