import React, { Component, Fragment } from 'react';

import LeagueList from './component/LeagueList';

import './App.css';
import './pop.css';

class App extends Component {
  render() {
    return (
      <Fragment>
        <header className="App-header">
          <div className="logo">
            <img alt="deepracer" src="https://deepracer-logos.s3.ap-northeast-2.amazonaws.com/logo_deepracer.png" />
          </div>
        </header>
        <LeagueList pathPrefix='' />
      </Fragment>
    );
  }
}

export default App;
