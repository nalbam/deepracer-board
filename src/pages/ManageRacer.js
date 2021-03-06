import React, { Component, Fragment } from 'react';

import { withAuthenticator, Authenticator } from 'aws-amplify-react'

import signUpConfig from '../config/signUpConfig'

import LeagueHeader from '../component/LeagueHeader';
import RacerForm from '../component/RacerForm';

class App extends Component {
  render() {
    return (
      <Fragment>
        <header className='App-header auth'>
          <Authenticator usernameAttributes='email' />
        </header>
        <header className='App-header'>
          <LeagueHeader league={this.props.match.params.league} />
        </header>
        <div className='App-body'>
          <RacerForm league={this.props.match.params.league} />
        </div>
      </Fragment>
    );
  }
}

export default withAuthenticator(App, { usernameAttributes: 'email', signUpConfig });
