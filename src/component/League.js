import React, { Component, Fragment } from 'react';

class League extends Component {
  render() {
    let leagueUrl = `/league/${this.props.item.league}`;

    return (
      <Fragment>
        <div className="lb-row">
          <div><img src={this.props.item.logo} alt="logo" className="icon-logo" /></div>
          <div><a href={leagueUrl}>{this.props.item.title}</a></div>
          <div><a href={leagueUrl}>{this.props.item.league}</a></div>
        </div>
      </Fragment>
    );
  }
}

export default League;
