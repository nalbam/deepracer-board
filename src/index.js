import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import * as serviceWorker from './serviceWorker';

import AppProvider from './context/AppProvider'

import App from './App';
import Leaderboard from './pages/Leaderboard'
import Manage from './pages/Manage'
import ManageLeague from './pages/ManageLeague'
import ManageRacer from './pages/ManageRacer'
import Timer from './pages/Timer'
import UploadForm from './pages/UploadForm'

import { Amplify } from 'aws-amplify';

import '@aws-amplify/ui-react/styles.css';

import './App.css';
import './pop.css';

import awsExports from './aws-exports';
Amplify.configure(awsExports);

// Analytics.record('Page_Load');
// Analytics.autoTrack('pageView', {
//     enable: true,
//     type: 'SPA'
// })

const routing = (
  <AppProvider>
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<App />} />
        <Route path='/manage/racers/:league' element={<ManageRacer />} />
        <Route path='/manage/league/:league' element={<ManageLeague />} />
        <Route path='/manage/league/' element={<ManageLeague />} />
        <Route path='/manage/' element={<Manage />} />
        <Route path='/racers/:league' element={<Leaderboard />} />
        <Route path='/league/:league' element={<Leaderboard />} />
        <Route path='/timer' element={<Timer />} />
        <Route path='/upload' element={<UploadForm />} />
        <Route element={App} />
      </Routes>
    </BrowserRouter>
  </AppProvider>
)

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
