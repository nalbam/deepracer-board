import React, { Component, Fragment } from 'react';

class App extends Component {

  state = {
    qr: `https://qr.nalbam.com/qr.png?body=https://deepracerboard.com/`,
  }

  componentDidMount() {
    this.getQR();
  }

  getQR = async () => {
    if (!this.props.league || this.props.league === 'undefined') {
      return;
    }

    this.setState({
      qr: `https://qr.nalbam.com/qr.png?body=https://deepracerboard.com/league/${this.props.league}`,
    });
  };

  render() {
    return (
      <Fragment>
        <div className='logo'>
          <img id='qr' src={this.state.qr} alt='qr' />
        </div>
      </Fragment>
    );
  }
}

export default App;
