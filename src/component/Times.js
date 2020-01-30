import React, { Component, Fragment } from 'react';

import { API } from 'aws-amplify'

import Pollen from './Pollen';
import Popup from './Popup';
import Racer from './Racer';

class Times extends Component {
  constructor(props) {
    super(props);

    this.getTimes();
  }

  state = {
    items: [],
    pollen: false,
    popRacer: '',
    popTime: '',
    popTitle: '',
    popup: false,
  }

  componentDidMount() {
    this.intervalId = setInterval(this.getTimes.bind(this), 10000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  getTimes = async () => {
    // console.log('call getTimes');
    const res = await API.get('apiefea82cc', `/items/${this.props.league}`);
    // alert(JSON.stringify(res, null, 2));
    if (res && res.length > 0) {
      this.reloaded(res);
    }
  }

  reloaded(res) {
    let items = res.sort(this.compare);

    if (items.length < this.state.items.length) {
      this.setState({
        items: items,
      });
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

    this.setState({
      items: items,
    });

    // // TODO REMOVE
    // rank = 1;
    // racerName = 'nalbam';
    // laptime = '00:00.000';

    if (racerName) {
      console.log(`new ${rank} ${racerName} ${laptime}`);

      if (isNew) {
        this.setState({
          popTitle: 'New Challenger!',
        });
      } else {
        this.setState({
          popTitle: 'New Record!',
        });
      }

      this.setState({
        popRacer: racerName,
        popTime: laptime,
      });

      this.popup(rank);
    }
  }

  popup(rank) {
    this.scroll(rank);

    this.setState({
      pollen: true,
    });

    setTimeout(
      function () {
        this.setState({
          popup: true,
        });
      }.bind(this), 1000
    );

    setTimeout(
      function () {
        this.setState({
          pollen: false,
        });
      }.bind(this), 5000
    );

    setTimeout(
      function () {
        this.setState({
          popup: false,
        });
      }.bind(this), 6000
    );

    // $(`.lb-rank${rank}>div:nth-child(n+2) span`).fadeOut().fadeIn().fadeOut().fadeIn();
  }

  scroll(rank) {

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
      (item, index) => (<Racer key={index} rank={index} item={item} />)
    );

    return (
      <Fragment>
        <div className="lb-items">
          <div className="lb-header">
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

        <Popup status={this.state.popup} title={this.state.popTitle} racer={this.state.popRacer} time={this.state.popTime} />

        <footer className="lb-footer"></footer>
      </Fragment>
    );
  }
}

export default Times;
