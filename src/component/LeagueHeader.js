import React, { Component, Fragment } from 'react';

import { API } from 'aws-amplify'

class App extends Component {
  constructor(props) {
    super(props);

    this.logoCmp = React.createRef();
  }

  state = {
    logo: '/images/icon-trophy.png',
    title: '',
    dateClose: '',
    dateOpen: '',
    timeZone: '',
  }

  componentDidMount() {
    this.getLeague();
  }

  getLeague = async () => {
    if (!this.props.league || this.props.league === 'undefined') {
      return;
    }

    console.log(`getLeague ${this.props.league}`);

    const res = await API.get('leagues', `/items/object/${this.props.league}`);
    if (res && res.league) {
      this.setState({
        logo: res.logo,
        title: res.title,
        dateClose: res.dateClose,
        dateOpen: res.dateOpen,
        timeZone: res.timeZone,
      });
    }
  };

  render() {
    return (
      <Fragment>
        <div className='logo'>
          <img id='logo' src={this.state.logo} alt='deepracer' />
        </div>
        <h1 id='title' className='title'>
          {this.state.title}
        </h1>
      </Fragment>
    );
  }
}

export default App;
