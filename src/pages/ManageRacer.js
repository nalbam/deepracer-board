import React, { Component, Fragment } from 'react';

import { withAuthenticator, Authenticator } from 'aws-amplify-react'

import signUpConfig from '../config/signUpConfig'

import LeagueHeader from '../component/LeagueHeader';
import RacerForm from '../component/RacerForm';
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
        <header className="App-header">
          <LeagueHeader league={this.props.match.params.league} />
        </header>
        <div className="App-body">
          <RacerForm />
        </div>

        <Popup status={this.state.popup} popInfo={this.state.popInfo} />
      </Fragment>
    );
  }
}

export default withAuthenticator(App, { usernameAttributes: 'email', signUpConfig });
