import React, { Component, Fragment } from 'react';

import { Auth, Storage } from 'aws-amplify'

import { v4 as uuid } from 'uuid';

class App extends Component {
  // constructor(props) {
  //   super(props);

  //   this.handleUpload = this.handleUpload.bind(this);
  // }

  state = {
    preview: '',
    uploading: false,
  }

  handleUpload = async (e) => {
    this.setState({ uploading: true });

    const fileName = uuid();
    const user = await Auth.currentAuthenticatedUser();

    console.log('user: ', user);
    console.log('target: ', e.target);

    const result = await Storage.put(
      fileName,
      e.target.files[0],
      {
        customPrefix: { public: 'origin/' },
        metadata: { owner: user.username }
      }
    );

    console.log('Uploaded file: ', result);

    this.setState({ uploading: false });
  }

  render() {
    return (
      <Fragment>
        <input type='file' onChange={this.handleUpload} accept='image/png, image/jpeg' />
      </Fragment>
    );
  }
}

export default App;
