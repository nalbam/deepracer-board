import React, { Component, Fragment } from 'react';

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
        <div className="App-body">
        </div>
      </Fragment>
    );
  }
}

export default App;
