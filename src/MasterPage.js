var React     = require('react');
var ReactDOM  = require('react-dom');
import { hashHistory } from 'react-router';

import AccountsComponent from './AccountsComponent'

import {Tab, Row, Col, Nav, Navbar, NavItem, NavDropdown, MenuItem, Table, Well } from 'react-bootstrap';

export default class MasterPage extends React.Component {

  constructor(props){
    super(props);
    this.handleLoginButton = this.handleLoginButton.bind(this);
  }
  componentWillMount() {
    //!!localStorage.token ? ((localStorage.isAdmin == "true") ? hashHistory.push('adminpage') : hashHistory.push('/userpage')) : hashHistory.push('/login');
    !!localStorage.token ? hashHistory.push('/accounts') : hashHistory.push('/login');
    }

    handleLoginButton(e){
      if(!!localStorage.token){
        delete localStorage.token;
      }
      hashHistory.push('/login');
    }

  render() {
    return (
      <div>
      <Navbar>
  <Navbar.Header>
    <Navbar.Brand>
      <a href="#">Charity One</a>
    </Navbar.Brand>
  </Navbar.Header>
  {!!localStorage.token ?
  <Nav>
    <NavItem eventKey={1} href="#/accounts">Accounts</NavItem>
    <NavItem eventKey={2} href="#/charitysettings">Charity Settings</NavItem>
    <NavItem eventKey={3} href="#/charityawards">Charity Awards</NavItem>
    <NavItem eventKey={4} href="#/analytics">Analytics</NavItem>
  </Nav>
  : null}
  <Nav pullRight>
    <NavItem eventKey={1} onSelect={this.handleLoginButton}>{!!localStorage.token ? "Logout" : "Login"}</NavItem>
  </Nav>
</Navbar>
{this.props.children}
</div>
    );
  }
}
