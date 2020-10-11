import React, { Component, Fragment } from 'react';

import $ from 'jquery';

class App extends Component {
  state = {
    logo: '/icon-trophy.png',
    title: '',
    timeout: 3000,
  }

  start(timeout) {
    this.setState({
      logo: this.props.logo,
      title: this.props.title,
    });

    if (!timeout) {
      timeout = this.state.timeout;
    }

    $('.pop-logo').fadeIn().delay(timeout).fadeOut();
  }

  render() {
    return (
      <Fragment>
        <div className='pop-logo'>
          <div className='pop-bg'></div>
          <div className='pop-container'>
            <div className='pop-header'><img id='big-logo' alt='deepracer' src={this.state.popInfo.logo} /></div>
            <div className='pop-message'>{this.state.popInfo.title}</div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default App;
