import React, { Component, Fragment } from 'react';

class App extends Component {
  render() {
    let path1 = `${this.props.pathPrefix}/league/${this.props.item.league}`;
    let path2 = `${this.props.pathPrefix}/racers/${this.props.item.league}`;

    return (
      <Fragment>
        <div className='lb-row'>
          <div><img src={this.props.item.logo} alt='logo' className='icon-logo' /></div>
          <div><a href={path2}>{this.props.item.league}</a></div>
          <div><a href={path1}>{this.props.item.title}</a></div>
        </div>
      </Fragment>
    );
  }
}

export default App;
