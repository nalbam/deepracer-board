import React, { Component, Fragment } from 'react';

import { Auth, Storage } from 'aws-amplify'

import { v4 as uuid } from 'uuid';

class App extends Component {
  state = {
    url: '',
    uploading: false,
  }

  uploadFile = async (file) => {
    const fileName = uuid();
    const user = await Auth.currentAuthenticatedUser();

    const result = await Storage.put(
      fileName,
      file,
      {
        customPrefix: { public: 'origin/' },
        metadata: { owner: user.username },
      }
    );

    console.log('Uploaded: ', result);
  }

  handleUpload = async (e) => {
    this.setState({ uploading: true });

    let files = [];
    for (var i = 0; i < e.target.files.length; i++) {
      files.push(e.target.files.item(i));
    }
    Promise.all(files.map(file => this.uploadFile(file)));

    this.setState({ uploading: false });
  }

  render() {
    return (
      <Fragment>
        <input type='file' onChange={this.handleUpload} className='input_file' accept='image/png, image/jpeg' />
      </Fragment>
    );
  }
}

export default App;
