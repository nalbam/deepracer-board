import React, { Component, Fragment } from 'react';

import { withAuthenticator, Authenticator } from 'aws-amplify-react'

import signUpConfig from '../config/signUpConfig'

import LeagueForm from '../component/LeagueForm';
import Popup from '../component/Popup';

class App extends Component {
  state = {
    popInfo: {
      footer: '',
      header: '',
      message: 'Saved!',
      rank: '',
    },
    popup: false,
  }

  popup(v) {
    if (v) {
      this.setState({
        popInfo: {
          footer: '',
          header: '',
          message: v,
          rank: '',
        },
      });
    }

    this.setState({ popup: true });

    setTimeout(
      function () {
        this.setState({ popup: false });
      }.bind(this), 3000
    );
  }

  render() {
    return (
      <Fragment>
        <header className="App-header auth">
          <Authenticator usernameAttributes='email' />
        </header>
        <div className="App-body">
          <LeagueForm league={this.props.match.params.league} />
        </div>

        <Popup status={this.state.popup} popInfo={this.state.popInfo} />
      </Fragment>
    );
  }
}

export default withAuthenticator(App, { usernameAttributes: 'email', signUpConfig });
