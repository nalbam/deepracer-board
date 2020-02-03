import React, { Component, Fragment } from 'react';

import { API } from 'aws-amplify'

import backend from '../config/backend'

class Title extends Component {
  state = {
    logo: '/icon-trophy.png',
    title: '',
    dateClose: '',
    dateOpen: '',
    timeZone: '',
  }

  componentDidMount() {
    this.getLeague();
  }

  getLeague = async () => {
    console.log(`getLeague ${this.props.league}`);

    const res = await API.get(backend.api.leagues, `/leagues/object/${this.props.league}`);
    if (res && res.league) {
      this.setState({
        logo: res.logo,
        title: res.title,
        dateClose: res.dateClose,
        dateOpen: res.dateOpen,
        timeZone: res.timeZone,
      });
    }
  };

  render() {
    return (
      <Fragment>
        <div className="logo">
          <img alt="deepracer" src={this.state.logo} />
        </div>
        <h1 className="title">
          {this.state.title}
        </h1>
      </Fragment>
    );
  }
}

export default Title;
