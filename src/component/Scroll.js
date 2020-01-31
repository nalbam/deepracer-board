import React, { Component, Fragment } from 'react';

import $ from 'jquery';

class Scroll extends Component {
  interval = 200;
  scroller = (1000 / this.interval) * 600;
  streaming = false;

  componentDidMount() {
    this.intervalId = setInterval(this.status.bind(this), this.interval);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  status() {
    if (!this.streaming && this.props.status > 0) {
      this.streaming = true;
      this.scroller = 0

      this.scroll(this.props.status);
    }
    if (this.streaming && this.props.status <= 0) {
      this.streaming = false;
    }
    if (this.streaming) {
      return;
    }

    this.scroller--;
    // console.log(`scroller: ${this.scroller}`);

    if (this.scroller === 0) {
      this.scroll('down');
    }

    if (this.scroller < ((1000 / this.interval) * -10)) {
      this.scroller = (1000 / this.interval) * 600;
      this.scroll('up');
    }
  }

  scroll(dir) {
    let scrollTop = 0;
    let duration = 1000;
    let max = 5;

    if (dir === 'up') {
      scrollTop = 0;
      // duration = 1000;
      // this.scroller = 0;
    } else if (dir === 'down') {
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
      // this.scroller = parseInt(duration / 1000);
    } else {
      if (dir <= max) {
        return;
      }
      dir = dir - max;
      scrollTop = $(`.lb-rank${dir}`).offset().top;
      // duration = 1000;
      // this.scroller = 20;
    }

    $('html, body').stop().animate({
      scrollTop: scrollTop
    }, duration);
  }

  render() {
    return (
      <Fragment>
        <div id="scroller"></div>
      </Fragment>
    );
  }
}

export default Scroll;
