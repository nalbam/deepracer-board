import React, { Component, Fragment } from 'react';

import { API } from 'aws-amplify'

import Pollen from './Pollen';
import Popup from './Popup';
import RacerItem from './RacerItem';
import Scroll from './Scroll';

class App extends Component {
  constructor(props) {
    super(props);

    this.pollenCmp = React.createRef();
    this.popupCmp = React.createRef();
    this.scrollCmp = React.createRef();
  }

  state = {
    items: [],
    popInfo: {
      rank: '',
      header: '',
      message: '',
      footer: '',
    },
  }

  componentDidMount() {
    this.getRacers();
    this.intervalId = setInterval(this.getRacers.bind(this), 10000);
    document.addEventListener("keydown", this.handleKey);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
    document.removeEventListener("keydown", this.handleKey);
  }

  getRacers = async () => {
    console.log(`getRacers ${this.props.league}`);

    const res = await API.get('racers', `/items/${this.props.league}`);
    if (res && res.length > 0) {
      this.reloaded(res);
    }
  }

  handleKey = (e) => {
    console.log(`handleKey ${e.keyCode}`);

    if (e.keyCode === 13) {
      setTimeout(
        function () {
          this.tada(1, 0);
        }.bind(this), 4000
      );
    }
  }

  reloaded(res) {
    let items = res.sort(this.compare);

    if (items.length < this.state.items.length) {
      this.setState({ items: items });
      return;
    }

    let rank = 0;
    let type = 0;

    if (items.length > this.state.items.length && this.state.items.length > 0) {
      rank = items.length;
      type = 2;
    }

    for (let i = 0; i < this.state.items.length; i++) {
      if (this.state.items[i].racerName !== items[i].racerName || this.state.items[i].laptime !== items[i].laptime) {
        rank = i + 1;
        type = 1;
        break;
      }
    }

    this.setState({ items: items });

    if (rank > 0) {
      this.tada(rank, type);
    }
  }

  tada(rank, type) {
    if (this.state.items.length === 0) {
      return;
    }

    let header;
    if (type === 1) {
      header = 'New Record!';
    } else if (type === 2) {
      header = 'New Challenger!';
    } else {
      header = 'Congratulations!';
    }

    let racerName = this.state.items[rank - 1].racerName;
    let laptime = this.state.items[rank - 1].laptime;

    this.setState({
      popInfo: {
        rank: rank,
        header: header,
        message: racerName,
        footer: laptime,
      },
    });

    console.log(`tada ${rank} ${racerName} ${laptime}`);

    this.fanfare(rank);
  }

  fanfare(rank) {
    this.scrollCmp.current.scroll(rank);

    this.pollenCmp.current.start(5000);

    this.popupCmp.current.start(5000);

    // $(`.lb-rank${rank}>div:nth-child(n+2) span`).fadeOut().fadeIn().fadeOut().fadeIn();
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
    const racerList = this.state.items.map(
      (item, index) => (<RacerItem key={index} rank={index + 1} item={item} />)
    );

    return (
      <Fragment>
        <div className='lb-items'>
          <div className='lb-header lb-rank0'>
            <div>Rank</div>
            <div>Name</div>
            <div>Time</div>
          </div>
          {racerList}
        </div>

        <Pollen ref={this.pollenCmp} />

        <Popup ref={this.popupCmp} popInfo={this.state.popInfo} />

        <Scroll ref={this.scrollCmp} items={this.state.items.length} />

        <footer className='lb-footer'></footer>
      </Fragment>
    );
  }
}

export default App;
