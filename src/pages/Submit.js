import React, { Component, Fragment } from 'react';

import { API } from 'aws-amplify'
import { withAuthenticator, Authenticator } from 'aws-amplify-react'
import signUpConfig from '../config/signUpConfig'

import Popup from '../component/Popup';
import Title from '../component/Title';

class App extends Component {
  state = {
    email_valid: false,
    email: '',
    laptime_valid: false,
    laptime: '',
    popup: false,
    racerName_valid: false,
    racerName: '',
  }

  validateEmail(val) {
    var re = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\].,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(val);
  }

  validateTime(val) {
    var re = /^([0-9]{2}:[0-9]{2}\.[0-9]{3})$/;
    return re.test(val);
  }

  postLapTime = async () => {
    console.log('post api');

    const res = await API.post('apiefea82cc', '/items', {
      body: {
        league: this.props.match.params.league,
        email: this.state.email,
        racerName: this.state.racerName,
        laptime: this.state.laptime,
      }
    });
    // alert(JSON.stringify(res, null, 2));
    console.log('post api: ' + JSON.stringify(res, null, 2));

    this.setState({
      popup: true,
    });

    setTimeout(
      function () {
        this.setState({
          popup: false,
        });
      }.bind(this), 3000
    );

    this.setState({
      email: '',
      racerName: '',
      laptime: '',
    });
  };

  setColor(e, b) {
    if (b) {
      e.classList.add('text_normal');
      e.classList.remove('text_red');
    } else {
      e.classList.remove('text_normal');
      e.classList.add('text_red');
    }
  }

  handleChange = (e) => {
    if (e.target.name === 'email') {
      let email_valid = (e.target.value !== '') && this.validateEmail(e.target.value);
      this.setState({
        email: e.target.value,
        email_valid: email_valid
      })
      this.setColor(e.target, email_valid);
    }

    if (e.target.name === 'racerName') {
      let racerName_valid = (e.target.value !== '');
      this.setState({
        racerName: e.target.value,
        racerName_valid: racerName_valid
      })
      this.setColor(e.target, racerName_valid);
    }

    if (e.target.name === 'laptime') {
      let laptime_valid = (e.target.value !== '') && this.validateTime(e.target.value);
      this.setState({
        laptime: e.target.value,
        laptime_valid: laptime_valid
      })
      this.setColor(e.target, laptime_valid);
    }

    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();

    if (this.state.email_valid && this.state.racerName_valid && this.state.laptime_valid) {
      this.postLapTime();
    }

    return false;
  }

  render() {
    return (
      <Fragment>
        <header className="App-header auth">
          <Authenticator usernameAttributes='email' />
        </header>
        <header className="App-header">
          <Title league={this.props.match.params.league} />
        </header>
        <div className="App-body">
          <form onSubmit={this.handleSubmit}>
            <input type="hidden" name="league" value={this.props.match.params.league} />
            <div className="lb-submit">
              <div className="lb-row">
                <div>Email</div>
                <div><input type="text" name="email" value={this.state.email} placeholder="" onChange={this.handleChange} className="lb-email text_normal" autoComplete="off" maxLength="256" /></div>
              </div>
              <div className="lb-row">
                <div>Name</div>
                <div><input type="text" name="racerName" value={this.state.racerName} placeholder="" onChange={this.handleChange} className="lb-name text_normal" autoComplete="off" maxLength="32" /></div>
              </div>
              <div className="lb-row">
                <div>Time</div>
                <div><input type="text" name="laptime" value={this.state.laptime} placeholder="00:00.000" onChange={this.handleChange} className="lb-time text_normal" autoComplete="off" maxLength="9" /></div>
              </div>
              <div className="lb-row">
                <div></div>
                <div><button type="submit" className="lb-btn-submit">Submit</button></div>
              </div>
            </div>
          </form>
        </div>

        <Popup status={this.state.popup} racer="Saved!" />
      </Fragment>
    );
  }
}

// export default App;
// export default withAuthenticator(App, true);
export default withAuthenticator(App, { usernameAttributes: 'email', signUpConfig });
