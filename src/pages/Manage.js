import React, { Component, Fragment } from 'react';

import { withAuthenticator, Authenticator } from 'aws-amplify-react'

import signUpConfig from '../config/signUpConfig'

import LeagueList from '../component/LeagueList';

class App extends Component {
  render() {
    return (
      <Fragment>
        <header className='App-header auth'>
          <Authenticator usernameAttributes='email' />
        </header>
        <div className='App-body'>
          <LeagueList pathPrefix='/manage' />
        </div>
        <div className='center'>
          <a href='/manage/league' className='btn-link'>Create</a>
        </div>
      </Fragment>
    );
  }
}

export default withAuthenticator(App, { usernameAttributes: 'email', signUpConfig });
