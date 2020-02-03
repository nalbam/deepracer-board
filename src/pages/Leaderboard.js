import React, { Component, Fragment } from 'react';

import LeagueHeader from '../component/LeagueHeader';
import RacerList from '../component/RacerList';

class App extends Component {
  render() {
    return (
      <Fragment>
        <header className="App-header">
          <LeagueHeader league={this.props.match.params.league} />
        </header>
        <div className="App-body">
          <RacerList league={this.props.match.params.league} />
        </div>
      </Fragment>
    );
  }
}

export default App;
