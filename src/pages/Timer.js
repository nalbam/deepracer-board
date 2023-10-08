import React, { Component, Fragment } from 'react';
import { useParams } from 'react-router-dom'

import classNames from 'classnames';
import $ from 'jquery';

import '../timer.css';

function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class App extends Component {
  state = {
    limiter: '00:00.000',
    display: '00:00.000',
    bestlap: '',
    results: '',
    limiterClass: classNames(
      'tm-limiter', {
      'tm-limiter_yellow': false,
      'tm-limiter_red': false,
    }),
  }

  limit_min = 4;

  limit = [];
  times = [];

  records = [];
  running = false;
  time = null;

  btnMap = {
    'btn_start': 'start',
    'btn_pause': 'pause',
    'btn_passed': 'passed',
    'btn_reset': 'reset',
    'btn_clear': 'clear',
    'btn_drop': 'drop',
    'btn_reject': 'reject',
  };

  keyMap = {
    '81': 'start', // q
    '87': 'pause', // w
    '69': 'passed', // e
    '82': 'reset', // r
    '84': 'clear', // t
    '68': 'drop', // d
    '70': 'reject', // y
  };

  componentDidMount() {
    $(document.body).on('keydown', this.handleKeyDown);
    let { min } = this.props.params;
    if (min !== undefined) {
      this.limit_min = parseInt(min);
    }
    this.clear();
  }

  componentWillUnmount() {
    $(document.body).off('keydown', this.handleKeyDown);
  }

  handleClick = async (e) => {
    this.exec(this.btnMap[e.target.id]);
  }

  handleKeyDown = async (e) => {
    this.exec(this.keyMap[e.keyCode]);
  }

  exec(name) {
    switch (name) {
      case 'start':
        this.start();
        break;
      case 'pause':
        this.pause();
        break;
      case 'passed':
        this.passed();
        break;
      case 'press':
        this.press();
        break;
      case 'reset':
        this.reset();
        break;
      case 'clear':
        this.clear();
        break;
      case 'drop':
        this.drop();
        break;
      case 'reject':
        this.reject();
        break;
      default:
    }
  }

  start() {
    if (!this.time) {
      this.time = performance.now();
    }
    if (!this.running) {
      this.running = true;
      requestAnimationFrame(this.step.bind(this));
    }
  }

  pause() {
    this.time = null;
    this.running = false;
  }

  passed() {
    if (!this.running) {
      return;
    }
    if (this.times[0] > 0 || this.times[1] > 2) {
      this.record();
      this.reset();
      this.start();
    }
  }

  reset() {
    this.times = [0, 0, 0];
    this.print();
    this.pause();
  }

  clear() {
    if (this.running) {
      return;
    }
    this.records = [];
    this.limit = [this.limit_min, 0, 0];
    this.reset();

    this.setState({
      bestlap: '',
      results: '',
    });
  }

  step(timestamp) {
    if (!this.running) {
      return;
    }
    this.calculate(timestamp);
    this.time = timestamp;
    this.print();
    requestAnimationFrame(this.step.bind(this));
  }

  calculate(timestamp) {
    var diff = timestamp - this.time;

    // times
    this.times[2] += diff;
    if (this.times[2] >= 1000) {
      this.times[2] -= 1000;
      this.times[1] += 1;
    }
    if (this.times[1] >= 60) {
      this.times[1] -= 60;
      this.times[0] += 1;
    }
    if (this.times[0] >= 60) {
      this.times[0] -= 60;
    }
    if (this.times[2] < 0) {
      this.times[2] = 0;
    }
    if (this.times[0] == this.limit_min) {
      this.times[1] = 0;
      this.times[2] = 0;
    }

    // limit
    this.limit[2] -= diff;
    if (this.limit[2] < 0) {
      this.limit[2] += 1000;
      this.limit[1] -= 1;
    }
    if (this.limit[1] < 0) {
      this.limit[1] += 60;
      this.limit[0] -= 1;
    }
    if (this.limit[0] < 0) {
      this.limit[2] = 0;
      this.limit[1] = 0;
      this.limit[0] = 0;
      this.pause();
    }
  }

  print() {
    this.setState({
      limiter: this.format(this.limit),
      display: this.format(this.times),
    });

    if (this.limit[0] <= 0 && this.limit[1] <= 30) {
      this.setState({
        limiterClass: classNames(
          'tm-limiter', {
          'tm-limiter_yellow': false,
          'tm-limiter_red': true,
        }),
      });
    } else if (this.limit[0] <= 0 && this.limit[1] <= 60) {
      this.setState({
        limiterClass: classNames(
          'tm-limiter', {
          'tm-limiter_yellow': true,
          'tm-limiter_red': false,
        }),
      });
    } else {
      this.setState({
        limiterClass: classNames(
          'tm-limiter', {
          'tm-limiter_yellow': false,
          'tm-limiter_red': false,
        }),
      });
    }
  }

  record() {
    console.log(`record ${this.format(this.times)}`);

    // Save the lap time
    this.records.push(this.times);

    this.findone();
  }

  drop() {
    if (this.records.length == 0) {
      return;
    }

    let latest = this.records[this.records.length - 1];

    console.log(`drop ${this.format(latest)}`);

    // Cancel the last lap time
    this.records.splice(this.records.length - 1, 1);

    this.findone();
  }

  reject() {
    if (this.records.length === 0) {
      return;
    }

    let latest = this.records[this.records.length - 1];

    console.log(`reject ${this.format(latest)}`);

    this.pause();

    // Merge last lap time into the timer
    this.times[2] += latest[2];
    this.times[1] += latest[1];
    this.times[0] += latest[0];
    if (this.times[2] >= 1000) {
      this.times[2] -= 1000;
      this.times[1] += 1;
    }
    if (this.times[1] >= 60) {
      this.times[1] -= 60;
      this.times[0] += 1;
    }
    if (this.times[0] >= 60) {
      this.times[0] -= 60;
    }
    if (this.times[2] < 0) {
      this.times[2] = 0;
    }

    // Cancel the last lap time
    this.records.splice(this.records.length - 1, 1);

    this.findone();

    this.start();
  }

  findone() {
    if (this.records.length == 0) {
      return;
    }

    let sorted = this.records.slice();
    sorted.sort(this.compare);

    let list = this.records.map(
      (item, index) => (<li key={index}>{this.format(item)}</li>)
    );

    this.setState({
      bestlap: this.format(sorted[0]),
      results: list,
    });
  }

  format(times) {
    return `${this.lpad(times[0], 2)}:${this.lpad(times[1], 2)}.${this.lpad(Math.floor(times[2]), 3)}`;
  }

  compare(a, b) {
    if (a[0] < b[0]) {
      return -1;
    } else if (a[0] > b[0]) {
      return 1;
    }
    if (a[1] < b[1]) {
      return -1;
    } else if (a[1] > b[1]) {
      return 1;
    }
    if (a[2] < b[2]) {
      return -1;
    } else if (a[2] > b[2]) {
      return 1;
    }
    return 0;
  }

  lpad(value, count) {
    var result = '000' + value;
    return result.substr(result.length - count);
  }

  render() {
    return (
      <Fragment>
        <nav className='tm-controls'>
          <button id='btn_start' className='tm-button tm-btn_start' onClick={this.handleClick}>Start</button>
          <button id='btn_pause' className='tm-button tm-btn_pause' onClick={this.handleClick}>Pause</button>
          <button id='btn_passed' className='tm-button tm-btn_passed' onClick={this.handleClick}>Passed</button>
          <button id='btn_reset' className='tm-button tm-btn_reset' onClick={this.handleClick}>Reset</button>
          <button id='btn_clear' className='tm-button tm-btn_clear' onClick={this.handleClick}>Clear</button>
          <button id='btn_drop' className='tm-button tm-btn_drop' onClick={this.handleClick}>Drop</button>
          <button id='btn_reject' className='tm-button tm-btn_reject' onClick={this.handleClick}>Reject</button>
        </nav>
        <div className={this.state.limiterClass}>{this.state.limiter}</div>
        <div className='tm-display'>{this.state.display}</div>
        <div className='tm-bestlap'>{this.state.bestlap}</div>
        <ul className='tm-results'>{this.state.results}</ul>
      </Fragment>
    );
  }
}

export default withParams(App);
