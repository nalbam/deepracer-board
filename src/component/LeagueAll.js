import React, { Component, Fragment } from 'react';

import { API } from 'aws-amplify'

import LeagueItem from './LeagueItem';

class App extends Component {
  state = {
    items: [],
  }

  componentDidMount() {
    this.getLeagues();
  }

  getLeagues = async () => {
    const res = await API.get('leagues', '/items/all');
    if (res && res.length > 0) {
      this.reloaded(res);
    }
  }

  reloaded(res) {
    let items = res.sort(this.compare).reverse();

    this.setState({ items: items });
  }

  compare(a, b) {
    let a1 = a.registered;
    let b1 = b.registered;
    if (a1 < b1) {
      return -1;
    } else if (a1 > b1) {
      return 1;
    }
    return 0;
  }

  render() {
    const leagueList = this.state.items.map(
      (item, index) => (<LeagueItem key={index} item={item} pathPrefix={this.props.pathPrefix} />)
    );

    return (
      <Fragment>
        <div className="lb-items">
          <div className="lb-header lb-rank0">
            <div>Rank</div>
            <div>Name</div>
            <div>Time</div>
          </div>
          {leagueList}
        </div>
      </Fragment>
    );
  }
}

export default App;
