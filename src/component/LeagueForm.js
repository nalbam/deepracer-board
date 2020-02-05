import React, { Component, Fragment } from 'react';

import { API } from 'aws-amplify'

import Select from 'react-select'

import Popup from './Popup';

import timezones from '../config/timezones'

class App extends Component {
  constructor(props) {
    super(props);

    this.popupCmp = React.createRef();
  }

  state = {
    dateClose_class: 'text_normal',
    dateClose: '',
    dateOpen_class: 'text_normal',
    dateOpen: '',
    dateTZ: '',
    league_class: 'text_normal width_80',
    league_read: false,
    league: '',
    logo_class: 'text_normal width_80',
    logo: '',
    title_class: 'text_normal width_80',
    title: '',
  }

  componentDidMount() {
    this.getLeague();
  }

  getLeague = async () => {
    if (!this.props.league) {
      return;
    }

    console.log(`getLeague: ${this.props.league}`);

    const res = await API.get('leagues', `/items/object/${this.props.league}`);

    console.log(`getLeague: ${JSON.stringify(res, null, 2)}`);

    if (res && res.league) {
      this.setState({
        league: res.league,
        title: res.title,
        logo: res.logo,
        dateClose: res.dateClose ? res.dateClose : '',
        dateOpen: res.dateOpen ? res.dateOpen : '',
        dateTZ: res.dateTZ ? res.dateTZ : '',
        league_read: true,
      });

      this.validateAll();
    }
  };

  postLeague = async () => {
    console.log('postLeague');

    try {
      let body = {
        league: this.state.league,
        title: this.state.title,
        logo: this.state.logo,
        dateClose: this.state.dateClose,
        dateOpen: this.state.dateOpen,
        dateTZ: this.state.dateTZ,
      };

      console.log(`postLeague: ${JSON.stringify(body, null, 2)}`);

      const res = await API.post('leagues', '/items', {
        body: body
      });

      console.log(`postLeague: ${JSON.stringify(res, null, 2)}`);

      // this.popup('Saved!');
      this.popupCmp.current.start(3000, 'Saved!');

      if (!this.props.league) {
        this.setState({
          league: '',
          title: '',
          logo: '',
          dateClose: '',
          dateOpen: '',
          dateTZ: '',
        });
      }
    } catch (err) {
      console.log(`postLeague: ${JSON.stringify(err, null, 2)}`);

      // this.popup(err.message);
      this.popupCmp.current.start(3000, err.message);
    }
  };

  validateString(val) {
    var re = /^[a-z]+[a-z0-9-_]{3,19}$/g;;
    return re.test(val);
  }

  validateUrl(val) {
    var re = /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/g;
    return re.test(val);
  }

  validateDate(val) {
    var re = /^[0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}$/;
    return re.test(val);
  }

  getClassValue(b, v) {
    if (b) {
      return `text_normal ${v}`;
    } else {
      return `text_red ${v}`;
    }
  }

  validateLeague(v) {
    let b = (v !== '' && this.validateString(v));
    this.setState({
      league_class: this.getClassValue(v, 'width_80'),
    });
    return b;
  }

  validateTitle(v) {
    let b = (v !== '');
    this.setState({
      title_class: this.getClassValue(b, 'width_80'),
    });
    return b;
  }

  validateLogo(v) {
    let b = (v !== '' && this.validateUrl(v));
    this.setState({
      logo_class: this.getClassValue(b, 'width_80'),
    });
    return b;
  }

  validateDateClose(v) {
    let b = (v === '' || this.validateDate(v));
    this.setState({
      dateClose_class: this.getClassValue(b),
    });
    return b;
  }

  validateDateOpen(v) {
    let b = (v === '' || this.validateDate(v));
    this.setState({
      dateOpen_class: this.getClassValue(b),
    });
    return b;
  }

  validateAll() {
    let b = this.validateLeague(this.state.league);
    b = this.validateTitle(this.state.title) && b;
    b = this.validateLogo(this.state.logo) && b;
    b = this.validateDateClose(this.state.dateClose) && b;
    b = this.validateDateOpen(this.state.dateOpen) && b;
    return b;
  }

  validate(k, v) {
    let b = false;

    switch (k) {
      case 'league':
        b = this.validateLeague(v);
        break;
      case 'title':
        b = this.validateTitle(v);
        break;
      case 'logo':
        b = this.validateLogo(v);
        break;
      case 'dateClose':
        b = this.validateDateClose(v);
        break;
      case 'dateOpen':
        b = this.validateDateOpen(v);
        break;
      default:
    }

    return b;
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });

    this.validate(e.target.name, e.target.value);
  }

  handleChangeTZ = (e) => {
    this.setState({
      dateTZ: e,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    if (!this.validateAll()) {
      return;
    }

    this.postLeague();
  }

  render() {
    return (
      <Fragment>
        <form onSubmit={this.handleSubmit}>
          <div className="lb-submit">
            <div className="lb-row">
              <div>League</div>
              <div><input type="text" name="league" value={this.state.league} placeholder="" onChange={this.handleChange} className={this.state.league_class} readOnly={this.state.league_read} autoComplete="off" maxLength="20" /></div>
            </div>
            <div className="lb-row">
              <div>Title</div>
              <div><input type="text" name="title" value={this.state.title} placeholder="" onChange={this.handleChange} className={this.state.title_class} autoComplete="off" maxLength="64" /></div>
            </div>
            <div className="lb-row">
              <div>Logo</div>
              <div><input type="text" name="logo" value={this.state.logo} placeholder="" onChange={this.handleChange} className={this.state.logo_class} autoComplete="off" maxLength="256" /></div>
            </div>
            <div className="lb-row">
              <div>Date</div>
              <div>
                <input type="text" name="dateOpen" value={this.state.dateOpen} placeholder="yyyy-MM-dd HH:mm" onChange={this.handleChange} className={this.state.dateOpen_class} autoComplete="off" maxLength="16" />
                <input type="text" name="dateClose" value={this.state.dateClose} placeholder="yyyy-MM-dd HH:mm" onChange={this.handleChange} className={this.state.dateClose_class} autoComplete="off" maxLength="16" />
              </div>
            </div>
            <div className="lb-row">
              <div>Zone</div>
              <div>
                <Select
                  options={timezones}
                  onChange={this.handleChangeTZ}
                  className="select_tz"
                />
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
