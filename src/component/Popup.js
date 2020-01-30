import React, { Component, Fragment } from 'react';

import $ from 'jquery';
// window.$ = window.jQuery = jQuery;

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
    return (
      <Fragment>
        <div className="pop-layer">
          <div className="pop-bg"></div>
          <div className="pop-container">
            <div className="pop-title">{this.props.title}</div>
            <div className="pop-racer">{this.props.racer}</div>
            <div className="pop-time">{this.props.time}</div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Popup;
