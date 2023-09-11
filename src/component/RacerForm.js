import React, { Component, Fragment } from 'react';

import { API } from 'aws-amplify'

import Popup from './Popup';

class App extends Component {
  constructor(props) {
    super(props);

    this.popupCmp = React.createRef();
  }

  state = {
    email_class: 'text_normal width_80',
    email: '',
    forceUpdate: false,
    forceDelete: false,
    laptime_class: 'text_normal',
    laptime: '',
    racerName_class: 'text_normal width_80',
    racerName: '',
  }

  postRacer = async () => {
    console.log('postRacer');

    try {
      let body = {
        league: this.props.league,
        email: this.state.email,
        racerName: this.state.racerName,
        laptime: this.state.laptime,
        forceUpdate: this.state.forceUpdate,
        forceDelete: this.state.forceDelete,
      };

      console.log('postRacer: ' + JSON.stringify(body, null, 2));

      const res = await API.post('racers', '/items', {
        body: body
      });

      console.log('postRacer: ' + JSON.stringify(res, null, 2));

      // this.popup('Saved!');
      this.popupCmp.current.start(3000, 'Saved!');

      this.setState({
        email: '',
        racerName: '',
        laptime: '',
        forceUpdate: false,
        forceDelete: false,
      });
    } catch (err) {
      console.log('postRacer: ' + JSON.stringify(err, null, 2));

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

  getClassValue(b, v) {
    if (b) {
      return `text_normal ${v}`;
    } else {
      return `text_red ${v}`;
    }
  }

  validateRacerEmail(v) {
    let b = (v !== '' && this.validateEmail(v));
    this.setState({
      email_class: this.getClassValue(v, 'width_80'),
    });
    return b;
  }

  validateRacerName(v) {
    let b = (v !== '');
    this.setState({
      racerName_class: this.getClassValue(b, 'width_80'),
    });
    return b;
  }

  validateRacerTime(v) {
    let b = (v !== '' && this.validateTime(v));
    this.setState({
      laptime_class: this.getClassValue(b),
    });
    return b;
  }

  validateAll() {
    let a = this.validateRacerEmail(this.state.email);
    let b = this.validateRacerName(this.state.racerName);
    let c = this.validateRacerTime(this.state.laptime);
    return a && b && c;
  }

  validate(k, v) {
    let b = false;

    switch (k) {
      case 'email':
        b = this.validateRacerEmail(v);
        break;
      case 'racerName':
        b = this.validateRacerName(v);
        break;
      case 'laptime':
        b = this.validateRacerTime(v);
        break;
      case 'forceUpdate':
        b = true;
        break;
      case 'forceDelete':
        b = true;
        break;
      default:
    }

    return b;
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });

    this.validate(e.target.name, e.target.value);
  }

  handleCheckBox = (e) => {
    this.setState({
      [e.target.name]: e.target.checked
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    if (!this.validateAll() || this.state.forceDelete) {
      return;
    }

    this.postRacer();
  }

  render() {
    return (
      <Fragment>
        <form onSubmit={this.handleSubmit}>
          <div className='lb-submit'>
            <div className='lb-row'>
              <div>Email</div>
              <div>
                <input type='text' name='email' value={this.state.email} onChange={this.handleChange} className={this.state.email_class} placeholder='' autoComplete='off' maxLength='256' />
              </div>
            </div>
            <div className='lb-row'>
              <div>Name</div>
              <div>
                <input type='text' name='racerName' value={this.state.racerName} onChange={this.handleChange} className={this.state.racerName_class} placeholder='' autoComplete='off' maxLength='32' />
              </div>
            </div>
            <div className='lb-row'>
              <div>Time</div>
              <div>
                <input type='text' name='laptime' value={this.state.laptime} onChange={this.handleChange} className={this.state.laptime_class} placeholder='00:00.000' autoComplete='off' maxLength='9' />
              </div>
            </div>
            <div className='lb-row'>
              <div></div>
              <div>
                <div><label><input type='checkbox' name='forceUpdate' value='Y' checked={this.state.forceUpdate} onChange={this.handleCheckBox} className='checkbox' /> Force update</label></div>
                <div><label><input type='checkbox' name='forceDelete' value='Y' checked={this.state.forceDelete} onChange={this.handleCheckBox} className='checkbox' /> Force delete</label></div>
              </div>
            </div>
            <div className='lb-row'>
              <div></div>
              <div><button type='submit' className='btn-submit'>Save</button></div>
            </div>
          </div>
        </form>

        <Popup ref={this.popupCmp} />
      </Fragment>
    );
  }
}

export default App;
