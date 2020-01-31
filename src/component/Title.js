import React, { Component, Fragment } from 'react';

import { API } from 'aws-amplify'

import backend from '../config/backend'

class Title extends Component {
  constructor(props) {
    super(props);

    this.getLeague();
  }

  state = {
    logo: '/icon-trophy.png',
    title: '',
  }

  getLeague = async () => {
    // console.log('calling getLeague');
    const res = await API.get(backend.api.leagues, `/leagues/object/${this.props.league}`);
    // alert(JSON.stringify(res, null, 2));
    if (res && res.league) {
      this.setState({
        logo: res.logo,
        title: res.title,
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
