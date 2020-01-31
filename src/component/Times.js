import React, { Component, Fragment } from 'react';

import { API } from 'aws-amplify'

import backend from '../config/backend'

import Pollen from './Pollen';
import Popup from './Popup';
import Racer from './Racer';
import Scroll from './Scroll';

class Times extends Component {
  state = {
    items: [],
    pollen: false,
    popInfo: {
      footer: '',
      header: '',
      message: '',
      rank: '',
    },
    popup: false,
    scroll: '',
  }

  componentDidMount() {
    this.getTimes();
    this.intervalId = setInterval(this.getTimes.bind(this), 10000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  getTimes = async () => {
    const res = await API.get(backend.api.times, `/items/${this.props.league}`);
    if (res && res.length > 0) {
      this.reloaded(res);
    }
  }

  reloaded(res) {
    let items = res.sort(this.compare);

    if (items.length < this.state.items.length) {
      this.setState({ items: items });
      return;
    }

    let isNew = false;
    if (this.state.items.length > 0 && items.length > this.state.items.length) {
      // if (items.length > this.state.items.length) {
      isNew = true;
    }

    let rank;
    let racerName;
    let laptime;

    for (let i = 0; i < this.state.items.length; i++) {
      if (this.state.items[i].racerName !== items[i].racerName || this.state.items[i].laptime !== items[i].laptime) {
        rank = i + 1;
        racerName = items[i].racerName;
        laptime = items[i].laptime;
        break;
      }
    }

    if (isNew && !racerName) {
      rank = items.length;
      racerName = items[rank - 1].racerName;
      laptime = items[rank - 1].laptime;
    }

    this.setState({ items: items });

    // // TODO REMOVE
    // rank = 1;
    // racerName = 'nalbam';
    // laptime = '00:00.000';

    if (racerName) {
      console.log(`new ${rank} ${racerName} ${laptime}`);

      let popTitle;

      if (isNew) {
        popTitle = 'New Challenger!';
      } else {
        popTitle = 'New Record!';
      }

      this.setState({
        popInfo: {
          footer: laptime,
          header: popTitle,
          message: racerName,
          rank: rank,
        },
      });

      this.fanfare(rank);
    }
  }

  fanfare(rank) {
    this.scroll(rank);

    this.pollen();

    this.popup();

    // $(`.lb-rank${rank}>div:nth-child(n+2) span`).fadeOut().fadeIn().fadeOut().fadeIn();
  }

  scroll(rank) {
    this.setState({
      scroll: rank,
    });

    setTimeout(
      function () {
        this.setState({ scroll: 0 });
      }.bind(this), 5000
    );
  }

  pollen() {
    this.setState({
      pollen: true,
    });

    setTimeout(
      function () {
        this.setState({ pollen: false });
      }.bind(this), 5000
    );
  }

  popup() {
    setTimeout(
      function () {
        this.setState({ popup: true });
      }.bind(this), 1000
    );

    setTimeout(
      function () {
        this.setState({ popup: false });
      }.bind(this), 6000
    );
  }

  compare(a, b) {
    let a1 = a.laptime.split(':');
    let b1 = b.laptime.split(':');
    let a2 = ((+a1[0]) * 60) + (+a1[1]);
    let b2 = ((+b1[0]) * 60) + (+b1[1]);
    if (a2 < b2) {
      return -1;
    } else if (a2 > b2) {
      return 1;
    }
    return 0;
  }

  render() {
    const list = this.state.items.map(
      (item, index) => (<Racer key={index} rank={index + 1} item={item} />)
    );

    return (
      <Fragment>
        <div className="lb-items">
          <div className="lb-header lb-rank0">
            <div>Rank</div>
            <div>Name</div>
            <div>Time</div>
          </div>
          {list}
        </div>

        <div className="pop-logo">
          <div className="pop-container">
            <div className="lb-logo-back"><img alt="trophy" src="/icon-trophy.png" /></div>
          </div>
        </div>

        <Pollen status={this.state.pollen} />

        <Popup status={this.state.popup} popInfo={this.state.popInfo} />

        <Scroll status={this.state.scroll} items={this.state.items.length} />

        <footer className="lb-footer"></footer>
      </Fragment>
    );
  }
}

export default Times;
