import React from 'react';
import ReactDOM from 'react-dom';
import MasterPage from './MasterPage';
import LoginPage from './LoginPage';
import AccountsComponent from './AccountsComponent';
import SettingsComponent from './SettingsComponent';
import AnalyticsComponent from './AnalyticsComponent';
import DonationsComponent from './DonationsComponent'
import { Router, Route, hashHistory } from 'react-router';

const stuff = (
  <Router history={hashHistory}>
    <Route path='/' component={MasterPage}>
      <Route path='/login' component={LoginPage}></Route>
      <Route path='/accounts' component={AccountsComponent}></Route>
      <Route path='/charitysettings' component={SettingsComponent}></Route>
      <Route path='/donations' component={DonationsComponent}></Route>
      <Route path='/analytics' component={AnalyticsComponent}></Route>
    </Route>
  </Router>
);

ReactDOM.render(
  stuff,
  document.getElementById('root')
);
