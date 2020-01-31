import React, { Component, Fragment } from 'react';

import $ from 'jquery';

class Popup extends Component {
  streaming = false;

  componentDidMount() {
    this.status();
    this.intervalId = setInterval(this.status.bind(this), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  status() {
    if (this.streaming && !this.props.status) {
      this.stop();
    }
    if (!this.streaming && this.props.status) {
      this.start();
    }
  }

  start() {
    this.streaming = true;

    $('.pop-layer').fadeIn();
  }

  stop() {
    this.streaming = false;

    $('.pop-layer').fadeOut();
  }

  render() {
    let messageClass = `pop-message pop-rank${this.props.popInfo.rank}`;

    return (
      <Fragment>
        <div className="pop-layer">
          <div className="pop-bg"></div>
          <div className="pop-container">
            <div className="pop-header">{this.props.popInfo.header}</div>
            <div className={messageClass}>{this.props.popInfo.message}</div>
            <div className="pop-footer">{this.props.popInfo.footer}</div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Popup;
