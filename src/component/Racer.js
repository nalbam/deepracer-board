import React, { Component, Fragment } from 'react';

class Racer extends Component {
  constructor(props) {
    super(props);

    this.state.rank = this.props.rank + 1;
  }

  state = {
    rank: 0
  }

  render() {
    let trophy = "";

    if (this.state.rank < 4) {
      trophy = <img src="/icon-trophy.png" alt="trophy" className="icon-trophy" />
    }

    return (
      <Fragment>
        <div className="lb-row lb-rank1">
          <div>{trophy} {this.state.rank}</div>
          <div>{this.props.item.racerName}</div>
          <div>{this.props.item.laptime}</div>
        </div>
      </Fragment>
    );
  }
}

export default Racer;
