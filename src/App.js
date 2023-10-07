import React, { Component, Fragment } from 'react';

import LeagueAll from './component/LeagueAll';

class App extends Component {
  render() {
    return (
      <Fragment>
        <header className='App-header'>
          <div className='logo'>
            <img alt='deepracer' src='https://deepracer-logos.s3.ap-northeast-2.amazonaws.com/logo_deepracer.png' />
          </div>
        </header>

        <LeagueAll pathPrefix='' />

        <div className='center'>
          <a href='/manage' className='btn-link'>Manage</a>
          <span className='spacer'>|</span>
          <a href='/timer' className='btn-link'>Timer</a>
        </div>

        <footer className='App-footer'></footer>
      </Fragment>
    );
  }
}

export default App;
