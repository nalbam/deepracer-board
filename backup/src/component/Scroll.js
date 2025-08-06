import React, { Component, Fragment } from 'react';

import $ from 'jquery';

class App extends Component {
  interval = 200;

  defaultTimeout = (10 * 60 * 1000) / this.interval;
  timeout = this.defaultTimeout;

  componentDidMount() {
    this.intervalId = setInterval(this.countdown.bind(this), this.interval);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  countdown() {
    this.timeout--;

    if (this.timeout <= 0) {
      this.scroll('down');
    }
  }

  scroll(dir) {
    console.log(`scroll: ${dir}`);

    this.timeout = this.defaultTimeout;

    if (!dir) {
      dir = 'down';
    }

    let scrollTop = 0;
    let duration = 1000;
    let delay = 5000;
    let max = 100;
    let min = 5;

    if (dir === 'down') {
      dir = this.props.items;
      if (dir <= min) {
        return;
      }
      if (dir > max) {
        dir = max;
      }
      scrollTop = $(`.lb-rank${dir}`).offset().top;
      duration = dir * 1000;
      // delay = 3000;
    } else {
      if (dir <= min) {
        scrollTop = 0;
      } else {
        dir = dir - min;
        scrollTop = $(`.lb-rank${dir}`).offset().top;
      }
      duration = 1000;
      // delay = 5000;
    }

    if (scrollTop === 0) {
      $('html, body').stop().animate({
        scrollTop: scrollTop
      }, duration);
    } else {
      $('html, body').stop().animate({
        scrollTop: scrollTop
      }, duration).delay(delay).animate({
        scrollTop: 0
      }, 1000);
    }
  }

  render() {
    return (
      <Fragment>
        <div id='scroller'></div>
      </Fragment>
    );
  }
}

export default App;
