import React, { Component, Fragment } from 'react';

import Upload from '../component/Upload';

class App extends Component {
  constructor(props) {
    super(props);

    this.uploadCmp = React.createRef();
  }

  state = {
    logo: '',
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    // this.postLeague();
  }

  render() {
    return (
      <Fragment>
        <div className='App-body'>
          <form onSubmit={this.handleSubmit}>
            <div className='lb-submit'>
              <div className='lb-row'>
                <div>Logo</div>
                <div>
                  <input type='text' name='logo' value={this.state.logo} onChange={this.handleChange} className='text_normal width_80' autoComplete='off' maxLength='256' />
                  <Upload ref={this.uploadCmp} />
                </div>
              </div>
              <div className='lb-row'>
                <div></div>
                <div><button type='submit' className='btn-submit'>Save</button></div>
              </div>
            </div>
          </form>
        </div>
      </Fragment>
    );
  }
}

export default App;
