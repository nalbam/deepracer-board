import React, { Component, Fragment } from 'react';

import { API } from 'aws-amplify'
import { withAuthenticator, Authenticator } from 'aws-amplify-react'

import backend from '../config/backend'
import signUpConfig from '../config/signUpConfig'

import Popup from '../component/Popup';
import Title from '../component/Title';

class App extends Component {
  state = {
    league_class: 'text_normal width_80',
    league_valid: false,
    league: '',
    logo_class: 'text_normal width_80',
    logo_valid: false,
    logo: '',
    popInfo: {
      footer: '',
      header: '',
      message: 'Saved!',
      rank: '',
    },
    popup: false,
    title_class: 'text_normal width_80',
    title_valid: false,
    title: '',
  }

  validateString(val) {
    var re = /^[a-z]+[a-z0-9-_]{3,19}$/g;;
    return re.test(val);
  }

  validateUrl(val) {
    var re = /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/g;
    return re.test(val);
  }

  postLeague = async () => {
    console.log('post api');

    try {
      const res = await API.post(backend.api.leagues, '/leagues', {
        body: {
          league: this.state.league,
          logo: this.state.logo,
          title: this.state.title,
        }
      });

      console.log('post api: ' + JSON.stringify(res, null, 2));

      this.popup('Saved!');

      this.setState({
        league: '',
        logo: '',
        title: '',
      });
    } catch (err) {
      console.log('post api: ' + JSON.stringify(err, null, 2));

      this.popup(err.message);
    }
  };

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
    if (e.target.name === 'league') {
      let league_valid = (e.target.value !== '') && this.validateString(e.target.value);
      this.setState({
        league: e.target.value,
        email_class: `${this.getClass(league_valid)} width_80`,
        league_valid: league_valid,
      })
      this.setColor(e.target, league_valid);
    }

    if (e.target.name === 'title') {
      let title_valid = (e.target.value !== '');
      this.setState({
        title: e.target.value,
        email_class: `${this.getClass(title_valid)} width_80`,
        title_valid: title_valid,
      })
      this.setColor(e.target, title_valid);
    }

    if (e.target.name === 'logo') {
      let logo_valid = (e.target.value !== '') && this.validateUrl(e.target.value);
      this.setState({
        logo: e.target.value,
        email_class: `${this.getClass(logo_valid)} width_80`,
        logo_valid: logo_valid,
      })
      this.setColor(e.target, logo_valid);
    }

    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();

    if (this.state.league_valid && this.state.logo_valid && this.state.title_valid) {
      this.postLeague();
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
            <div className="lb-submit">
              <div className="lb-row">
                <div>League</div>
                <div><input type="text" name="league" value={this.state.league} placeholder="" onChange={this.handleChange} className={this.state.league_class} autoComplete="off" maxLength="20" /></div>
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
