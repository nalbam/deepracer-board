import React, { Component, Fragment } from 'react';

import { API } from 'aws-amplify'

import Popup from './Popup';

import backend from '../config/backend'

class App extends Component {
  constructor(props) {
    super(props);

    this.popupCmp = React.createRef();
  }

  state = {
    email_class: 'text_normal width_80',
    email_valid: false,
    email: '',
    forceUpdate: false,
    laptime_class: 'text_normal',
    laptime_valid: false,
    laptime: '',
    racerName_class: 'text_normal width_80',
    racerName_valid: false,
    racerName: '',
  }

  postLapTime = async () => {
    console.log('postLapTime');

    try {
      let body = {
        league: this.props.league,
        email: this.state.email,
        racerName: this.state.racerName,
        laptime: this.state.laptime,
        forceUpdate: this.state.forceUpdate,
      };

      console.log('postLapTime: ' + JSON.stringify(body, null, 2));

      const res = await API.post(backend.api.times, '/items', {
        body: body
      });

      console.log('postLapTime: ' + JSON.stringify(res, null, 2));

      // this.popup('Saved!');
      this.popupCmp.current.start(3000, 'Saved!');

      this.setState({
        email: '',
        racerName: '',
        laptime: '',
        forceUpdate: false,
      });
    } catch (err) {
      console.log('postLapTime: ' + JSON.stringify(err, null, 2));

      // this.popup(err.message);
      this.popupCmp.current.start(3000, err.message);
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
        <form onSubmit={this.handleSubmit}>
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

        <Popup ref={this.popupCmp} />
      </Fragment>
    );
  }
}

export default App;
