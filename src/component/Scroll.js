import React, { Component, Fragment } from 'react';

import $ from 'jquery';

class App extends Component {
  interval = 1000;

  defaultTimeout = (10 * 60 * 1000) / this.interval;
  timeout = this.defaultTimeout;
  // streaming = false;

  componentDidMount() {
    this.intervalId = setInterval(this.countdown.bind(this), this.interval);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  countdown() {
    this.timeout--;
    // console.log(`timeout: ${this.timeout}`);

    if (this.timeout === 0) {
      this.scroll('down');
    }
  }

  scroll(dir) {
    console.log(`scroll: ${dir}`);

    this.timeout = this.defaultTimeout;

    let scrollTop = 0;
    let duration = 1000;
    let delay = 1000;
    let max = 5;

    if (dir === 'down') {
      dir = this.props.items;
      if (dir <= max) {
        return;
      }
      if (dir > 100) {
        dir = 100;
      }
      dir = dir - max;
      scrollTop = $(`.lb-rank${dir}`).offset().top;
      duration = dir * 1000;
      delay = 3000;
    } else {
      if (dir <= max) {
        return;
      }
      dir = dir - max;
      scrollTop = $(`.lb-rank${dir}`).offset().top;
      duration = 1000;
      delay = 10000;
    }

    $('html, body').stop().animate({
      scrollTop: scrollTop
    }, duration).delay(delay).animate({
      scrollTop: 0
    }, 1000);
  }

  render() {
    return (
      <Fragment>
        <div id="scroller"></div>
      </Fragment>
    );
  }
}

export default App;
