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
    this.getRacers();
    this.intervalId = setInterval(this.getRacers.bind(this), 10000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  getRacers = async () => {
    console.log(`getRacers ${this.props.league}`);

    const res = await API.get('racers', `/items/${this.props.league}`);
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
    // this.scroll(rank);

    this.scrollCmp.current.scroll(rank);

    this.pollenCmp.current.start(5000);

    this.popupCmp.current.start(5000);

    // $(`.lb-rank${rank}>div:nth-child(n+2) span`).fadeOut().fadeIn().fadeOut().fadeIn();
  }

  // scroll(rank) {
  //   this.setState({
  //     scroll: rank,
  //   });

  //   setTimeout(
  //     function () {
  //       this.setState({ scroll: 0 });
  //     }.bind(this), 5000
  //   );
  // }

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

        <div className='pop-logo'>
          <div className='pop-container'>
            <div className='lb-logo-back'><img alt='trophy' src='/icon-trophy.png' /></div>
          </div>
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
