import React, { Component, Fragment } from 'react';
import { useParams } from 'react-router-dom'

import { withAuthenticator, Authenticator } from '@aws-amplify/ui-react'

import signUpConfig from '../config/signUpConfig'

import LeagueHeader from '../component/LeagueHeader';
import LeagueForm from '../component/LeagueForm';

import QRCode from '../component/QRCode';

function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class App extends Component {
  render() {
    let { league } = this.props.params;

    return (
      <Fragment>
        <header className='App-header'>
          <Authenticator usernameAttributes='email' />
        </header>

        <header className='App-header'>
          <LeagueHeader league={league} />
        </header>

        <div className='App-body'>
          <LeagueForm league={league} />
        </div>

        <header className='App-header'>
          <QRCode league={league} />
        </header>
      </Fragment>
    );
  }
}

export default withAuthenticator(withParams(App), { usernameAttributes: 'email', signUpConfig });
