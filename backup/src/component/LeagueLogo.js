import React, { Component, Fragment } from 'react';

import { API } from 'aws-amplify'

import Logo from './Logo';

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
    pop: false,
  }

  componentDidMount() {
    this.getLeague();
    document.addEventListener('keydown', this.handleKey);
    document.addEventListener('mousedown', this.handleMouse);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKey);
    document.removeEventListener('mousedown', this.handleMouse);
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

  handleKey = (e) => {
    console.log(`handleKey ${e.keyCode}`);

    if (!this.state.pop && e.keyCode === 13) {
      this.setState({
        pop: true,
      });
      this.tada();
    }
  }

  handleMouse = (e) => {
    console.log(`handleMouse ${e.button}`);

    if (!this.state.pop && e.button === 0) {
      this.setState({
        pop: true,
      });
      this.tada();
    }
  }

  tada() {
    this.logoCmp.current.start(3500);

    setTimeout(
      function () {
        this.setState({
          pop: false,
        });
      }.bind(this), 9000
    );
  }

  render() {
    return (
      <Fragment>
        <div className='logo'>
          <img id='logo' src={this.state.logo} alt='deepracer' />
        </div>
        <h1 id='title' className='title'>
          {this.state.title}
        </h1>

        <Logo ref={this.logoCmp} logo={this.state.logo} title={this.state.title} />
      </Fragment>
    );
  }
}

export default App;
