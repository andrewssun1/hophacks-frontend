var React     = require('react');
var ReactDOM  = require('react-dom');

import AccountsComponent from './AccountsComponent'

import {Tab, Row, Col, Nav, Navbar, NavItem, NavDropdown, MenuItem, Table, Well } from 'react-bootstrap';

export default class MasterPage extends React.Component {

  render() {
    return (
      <div>
      <Navbar>
  <Navbar.Header>
    <Navbar.Brand>
      <a href="#">Charity One</a>
    </Navbar.Brand>
  </Navbar.Header>
  <Nav>
    <NavItem eventKey={1} href="#/accounts">Accounts</NavItem>
    <NavItem eventKey={2} href="#">Link</NavItem>
    <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
      <MenuItem eventKey={3.1}>Action</MenuItem>
      <MenuItem eventKey={3.2}>Another action</MenuItem>
      <MenuItem eventKey={3.3}>Something else here</MenuItem>
      <MenuItem divider />
      <MenuItem eventKey={3.3}>Separated link</MenuItem>
    </NavDropdown>
  </Nav>
</Navbar>
{this.props.children}
</div>
      // <Tab.Container id="tabs-with-dropdown" defaultActiveKey="first">
      //   <Row className="clearfix">
      //     <Col sm={12}>
      //     <Navbar.Header>
      //       <Navbar.Brand>
      //         <a href="#">Charity One</a>
      //       </Navbar.Brand>
      //     </Navbar.Header>
      //       <Nav bsStyle="tabs">
      //         <NavItem eventKey="first">
      //           Accounts
      //         </NavItem>
      //         <NavItem eventKey="second">
      //           Tab 2
      //         </NavItem>
      //       </Nav>
      //     </Col>
      //     <Col sm={12}>
      //       <Tab.Content animation>
      //         <Tab.Pane eventKey="first">
      //           <AccountsComponent/>
      //         </Tab.Pane>
      //         <Tab.Pane eventKey="second">
      //           Tab 2 content
      //         </Tab.Pane>
      //       </Tab.Content>
      //     </Col>
      //   </Row>
      // </Tab.Container>
    );
  }
}
