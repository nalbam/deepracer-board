import React, { Component, Fragment } from 'react';

import $ from 'jquery';

class App extends Component {
  state = {
    logo: '',
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
            <div className='pop-header'><img src={this.state.logo} alt='deepracer' /></div>
            <div className='pop-message'>{this.state.title}</div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default App;
