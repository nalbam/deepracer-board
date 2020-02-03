import React, { Component, Fragment } from 'react';

class App extends Component {
  render() {
    let racerClass = `lb-row lb-rank${this.props.rank}`;
    let racerRank = this.props.rank;
    let trophy = "";

    if (racerRank < 4) {
      trophy = <img src="/icon-trophy.png" alt="trophy" className="icon-trophy" />
    }

    return (
      <Fragment>
        <div className={racerClass}>
          <div>{trophy} {racerRank}</div>
          <div>{this.props.item.racerName}</div>
          <div>{this.props.item.laptime}</div>
        </div>
      </Fragment>
    );
  }
}

export default App;
