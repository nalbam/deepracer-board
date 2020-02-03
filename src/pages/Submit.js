import React, { Component, Fragment } from 'react';

import { API } from 'aws-amplify'
import { withAuthenticator, Authenticator } from 'aws-amplify-react'

import backend from '../config/backend'
import signUpConfig from '../config/signUpConfig'

import Popup from '../component/Popup';
import Title from '../component/Title';

class App extends Component {
  state = {
    email_class: 'text_normal width_80',
    email_valid: false,
    email: '',
    forceUpdate: false,
    laptime_class: 'text_normal',
    laptime_valid: false,
    laptime: '',
    popInfo: {
      footer: '',
      header: '',
      message: 'Saved!',
      rank: '',
    },
    popup: false,
    racerName_class: 'text_normal width_80',
    racerName_valid: false,
    racerName: '',
  }

  postLapTime = async () => {
    console.log('postLapTime');

    try {
      let body = {
        league: this.props.match.params.league,
        email: this.state.email,
        racerName: this.state.racerName,
        laptime: this.state.laptime,
        forceUpdate: this.state.forceUpdate,
      };

      const res = await API.post(backend.api.times, '/items', {
        body: body
      });

      console.log('postLapTime: ' + JSON.stringify(body, null, 2));
      console.log('postLapTime: ' + JSON.stringify(res, null, 2));

      this.popup('Saved!');

      this.setState({
        email: '',
        racerName: '',
        laptime: '',
        forceUpdate: false,
      });
    } catch (err) {
      console.log('postLapTime: ' + JSON.stringify(err, null, 2));

      this.popup(err.message);
    }
  };

  validateEmail(val) {
    var re = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\].,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(val);
  }

  validateTime(val) {
    var re = /^([0-9]{2}:[0-9]{2}\.[0-9]{3})$/;
    return re.test(val);
  }

  popup(message) {
    if (message) {
      this.setState({
        popInfo: {
          footer: '',
          header: '',
          message: message,
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

  getClass(b) {
    if (b) {
      return 'text_normal';
    } else {
      return 'text_red';
    }
  }

  handleChange = (e) => {
    if (e.target.name === 'email') {
      let email_valid = (e.target.value !== '') && this.validateEmail(e.target.value);
      this.setState({
        email: e.target.value,
        email_class: `${this.getClass(email_valid)} width_80`,
        email_valid: email_valid,
      })
    }

    if (e.target.name === 'racerName') {
      let racerName_valid = (e.target.value !== '');
      this.setState({
        racerName: e.target.value,
        racerName_class: `${this.getClass(racerName_valid)} width_80`,
        racerName_valid: racerName_valid,
      })
    }

    if (e.target.name === 'laptime') {
      let laptime_valid = (e.target.value !== '') && this.validateTime(e.target.value);
      this.setState({
        laptime: e.target.value,
        laptime_class: this.getClass(laptime_valid),
        laptime_valid: laptime_valid,
      })
    }
  }

  handleCheckBox = (e) => {
    if (e.target.name === 'forceUpdate') {
      this.setState({
        [e.target.name]: e.target.checked
      })
    }
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
                <div><input type="text" name="email" value={this.state.email} placeholder="" onChange={this.handleChange} className={this.state.email_class} autoComplete="off" maxLength="256" /></div>
              </div>
              <div className="lb-row">
                <div>Name</div>
                <div><input type="text" name="racerName" value={this.state.racerName} placeholder="" onChange={this.handleChange} className={this.state.racerName_class} autoComplete="off" maxLength="32" /></div>
              </div>
              <div className="lb-row">
                <div>Time</div>
                <div>
                  <input type="text" name="laptime" value={this.state.laptime} placeholder="00:00.000" onChange={this.handleChange} className={this.state.laptime_class} autoComplete="off" maxLength="9" />
                  <label><input type="checkbox" name="forceUpdate" value="Y" checked={this.state.forceUpdate} onChange={this.handleCheckBox} className="checkbox" /> Force update</label>
                </div>
              </div>
              <div className="lb-row">
                <div></div>
                <div><button type="submit" className="lb-btn-submit">Submit</button></div>
              </div>
            </div>
          </form>
        </div>

        <Popup status={this.state.popup} popInfo={this.state.popInfo} />
      </Fragment>
    );
  }
}

// export default App;
// export default withAuthenticator(App, true);
export default withAuthenticator(App, { usernameAttributes: 'email', signUpConfig });
