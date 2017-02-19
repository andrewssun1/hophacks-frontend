import React from 'react';
import ReactDOM from 'react-dom';
import MasterPage from './MasterPage';
import LoginPage from './LoginPage';
import AccountsComponent from './AccountsComponent';
import { Router, Route, hashHistory } from 'react-router';

const stuff = (
  <Router history={hashHistory}>
    <Route path='/' component={MasterPage}>
      <Route path='/login' component={LoginPage}></Route>
      <Route path='/accounts' component={AccountsComponent}></Route>
    </Route>
  </Router>
);

ReactDOM.render(
  stuff,
  document.getElementById('root')
);
