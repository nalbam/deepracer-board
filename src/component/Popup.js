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

  streaming = false;

  start(timeout) {
    this.setState({
      popInfo: this.props.popInfo,
    });

    this.streaming = true;

    $('.pop-layer').fadeIn();

    setTimeout(
      function () {
        this.stop();
      }.bind(this), timeout
    );
  }

  stop() {
    this.streaming = false;

    $('.pop-layer').fadeOut();
  }

  render() {
    let messageClass = `pop-message pop-rank${this.state.popInfo.rank}`;

    return (
      <Fragment>
        <div className="pop-layer">
          <div className="pop-bg"></div>
          <div className="pop-container">
            <div className="pop-header">{this.state.popInfo.header}</div>
            <div className={messageClass}>{this.state.popInfo.message}</div>
            <div className="pop-footer">{this.state.popInfo.footer}</div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default App;
