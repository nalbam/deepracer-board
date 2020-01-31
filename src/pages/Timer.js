import React, { Component, Fragment } from 'react';

import '../timer.css';

class App extends Component {

  render() {
    return (
      <Fragment>
        <nav className="controls">
          <button id="btn_start" className="button btn_start">Start</button>
          <button id="btn_pause" className="button btn_pause">Pause</button>
          <button id="btn_passed" className="button btn_passed">Passed</button>
          <button id="btn_reset" className="button btn_reset">Reset</button>
          <button id="btn_clear" className="button btn_clear">Clear</button>
        </nav>
        <div className="limiter"></div>
        <div className="display"></div>
        <div className="bestlap"></div>
        <ul className="results"></ul>
      </Fragment>
    );
  }
}

export default App;
