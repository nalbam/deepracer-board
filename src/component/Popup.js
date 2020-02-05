import React, { Component, Fragment } from 'react';

import $ from 'jquery';

class App extends Component {
  state = {
    popInfo: {
      footer: '',
      header: '',
      message: '',
      rank: '',
    },
    timeout: 1000,
  }

  start(timeout, message) {
    if (this.props.popInfo) {
      this.setState({
        popInfo: this.props.popInfo,
      });
    }

    if (!timeout) {
      timeout = this.state.timeout;
    }

    if (message) {
      this.setState({
        popInfo: {
          footer: this.state.footer,
          header: this.state.header,
          message: message,
          rank: this.state.rank,
        }
      });
    }

    $('.pop-layer').fadeIn().delay(timeout).fadeOut();
  }

  render() {
    let messageClass = `pop-message pop-rank${this.state.popInfo.rank}`;

    return (
      <Fragment>
        <div className='pop-layer'>
          <div className='pop-bg'></div>
          <div className='pop-container'>
            <div className='pop-header'>{this.state.popInfo.header}</div>
            <div className={messageClass}>{this.state.popInfo.message}</div>
            <div className='pop-footer'>{this.state.popInfo.footer}</div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default App;
