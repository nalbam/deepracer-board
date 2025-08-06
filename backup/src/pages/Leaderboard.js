import React, { Component, Fragment } from 'react';
import { useParams } from 'react-router-dom'

import LeagueLogo from '../component/LeagueLogo';
import RacerList from '../component/RacerList';

function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class App extends Component {
  render() {
    let { league } = this.props.params;

    return (
      <Fragment>
        <header className='App-header'>
          <LeagueLogo league={league} />
        </header>

        <div className='App-body'>
          <RacerList league={league} />
        </div>

        <footer className='App-footer'></footer>
      </Fragment>
    );
  }
}

export default withParams(App);
