import React, { Component, Fragment } from 'react';
import { useParams } from 'react-router-dom'

function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class App extends Component {
  render() {
    let { qr } = `https://qr.nalbam.com/qr.png?body=https://deepracerboard.com/league/${this.props.league}`;

    return (
      <Fragment>
        <div className='logo'>
          <img id='qr' src={qr} alt='qr' />
        </div>
      </Fragment>
    );
  }
}

export default withParams(App);
