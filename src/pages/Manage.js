import React, { Component, Fragment } from 'react';

import { withAuthenticator, Authenticator } from '@aws-amplify/ui-react'

import signUpConfig from '../config/signUpConfig'

import LeagueList from '../component/LeagueList';

class App extends Component {
  render() {
    return (
      <Fragment>
        <header className='App-header'>
          <Authenticator>
            {({ signOut, user }) => (
              <main>
                <h1>Hello {user.email}</h1>
                <button onClick={signOut}>Sign out</button>
              </main>
            )}
          </Authenticator>
        </header>

        <div className='App-body'>
          <LeagueList pathPrefix='/manage' />
        </div>

        <div className='center'>
          <a href='/manage/league' className='btn-link'>Create</a>
        </div>

        <footer className='App-footer'></footer>
      </Fragment>
    );
  }
}

export default withAuthenticator(App, { usernameAttributes: 'email', signUpConfig });
