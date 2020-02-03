import React, { Component, Fragment } from 'react';

import { API } from 'aws-amplify'

import Select from 'react-select'

import backend from '../config/backend'
import timezones from '../config/timezones'

class App extends Component {
  state = {
    dateClose: '',
    dateOpen: '',
    dateTZ: '',
    league_class: 'text_normal width_80',
    league_read: false,
    league_valid: false,
    league: '',
    logo_class: 'text_normal width_80',
    logo_valid: false,
    logo: '',
    title_class: 'text_normal width_80',
    title_valid: false,
    title: '',
  }

  componentDidMount() {
    this.getLeague();
  }

  getLeague = async () => {
    if (!this.props.match.params.league) {
      return;
    }

    console.log(`getLeague ${this.props.match.params.league}`);

    const res = await API.get(backend.api.leagues, `/leagues/object/${this.props.match.params.league}`);

    console.log('getLeague ' + JSON.stringify(res, null, 2));

    if (res && res.league) {
      this.setState({
        league: res.league,
        title: res.title,
        logo: res.logo,
        dateClose: res.dateClose,
        dateOpen: res.dateOpen,
        dateTZ: res.dateTZ,
        league_read: true,
      });

      this.validateLeague(res.league);
      this.validateTitle(res.title);
      this.validateLogo(res.logo);
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

      const res = await API.post(backend.api.leagues, '/leagues', {
        body: body
      });

      console.log('postLeague: ' + JSON.stringify(body, null, 2));
      console.log('postLeague: ' + JSON.stringify(res, null, 2));

      this.popup('Saved!');

      if (!this.props.match.params.league) {
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
      console.log('postLeague: ' + JSON.stringify(err, null, 2));

      this.popup(err.message);
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

  getClass(b) {
    if (b) {
      return 'text_normal';
    } else {
      return 'text_red';
    }
  }

  validateLeague(v) {
    let league_valid = (v !== '') && this.validateString(v);
    this.setState({
      league: v,
      league_class: `${this.getClass(league_valid)} width_80`,
      league_valid: league_valid,
    });
  }

  validateTitle(v) {
    let title_valid = (v !== '');
    this.setState({
      title: v,
      title_class: `${this.getClass(title_valid)} width_80`,
      title_valid: title_valid,
    });
  }

  validateLogo(v) {
    let logo_valid = (v !== '') && this.validateUrl(v);
    this.setState({
      logo: v,
      logo_class: `${this.getClass(logo_valid)} width_80`,
      logo_valid: logo_valid,
    });
  }

  handleChange = (e) => {
    if (e.target.name === 'league') {
      this.validateLeague(e.target.value);
    }

    if (e.target.name === 'title') {
      this.validateTitle(e.target.value);
    }

    if (e.target.name === 'logo') {
      this.validateLogo(e.target.value);
    }
  }

  handleChangeDateOpen = v => {
    this.setState({
      dateOpen: v
    });
  }

  handleChangeDateClose = v => {
    this.setState({
      dateClose: v
    });
  }

  handleChangeTimeZone = e => {
    this.setState({
      dateTZ: e.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    console.log(`handleSubmit: ${this.state.league_valid} ${this.state.logo_valid} ${this.state.title_valid}`);

    if (this.state.league_valid && this.state.logo_valid && this.state.title_valid) {
      this.postLeague();
    }

    return false;
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
                <input type="text" name="dateOpen" value={this.state.dateOpen} placeholder="yyyy-MM-dd HH:mm" onChange={this.handleChange} className={this.state.title_class} autoComplete="off" maxLength="16" />
                <input type="text" name="dateClose" value={this.state.dateClose} placeholder="yyyy-MM-dd HH:mm" onChange={this.handleChange} className={this.state.title_class} autoComplete="off" maxLength="16" />
              </div>
            </div>
            <div className="lb-row">
              <div>Zone</div>
              <div>
                <Select
                  options={timezones}
                  onChange={this.handleChangeTimeZone}
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
      </Fragment>
    );
  }
}

export default App;
