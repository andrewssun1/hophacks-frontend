var React     = require('react');
var ReactDOM  = require('react-dom');
var ReactBsTable = require('react-bootstrap-table');

import {Button, Modal, FormGroup, ControlLabel, FormControl, Alert, Label, Tab, Row, Col, Nav, Navbar, NavItem, NavDropdown, MenuItem, Table, Well } from 'react-bootstrap';
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;

import {restRequest} from './Utilities.js';

const davidID = "58a7e5241756fc834d904a5a";
const apiKey = "52f69545ffa7fffb30dc369ac3103f7f";
const C1_URL = "http://api.reimaginebanking.com";
const HOST_NAME = "http://colab-sbx-92.oit.duke.edu";

export default class AccountsComponent extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      accounts: [],
      stuffs: [],
      currTable: [],
      balance: 0,
      showModal: false,
      modalAmount: 0,
      currCharity: "",
      currRow: 0
    }
    //this.generateTable = this.generateTable.bind(this);
    this.populateComponent = this.populateComponent.bind(this);
    this.getCharityAmount = this.getCharityAmount.bind(this);
    this.buttonFormatter = this.buttonFormatter.bind(this);
    this.onAddtoCartClick = this.onAddtoCartClick.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  closeModal() {
    this.setState({ showModal: false });
  }

  openModal() {
    this.setState({ showModal: true });
  }

  saveModal(row){
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", HOST_NAME + "/charityapp/donate/", false);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.setRequestHeader("Authorization", "Token " + localStorage.token);
    xhttp.send("charity_id="+row.id+"&amount="+this.state.modalAmount);
    console.log(JSON.parse(xhttp.responseText));
    this.closeModal();
  }


  componentWillMount(){
    console.log("Mounting!")
    this.getCharityAmount();
  }

  handleTextChange(e) {
    var modalFloat = parseFloat(e.target.value);
    this.setState({modalAmount: modalFloat});
  }

  onAddtoCartClick(cell, row){
    console.log(row);
    this.state.showModal = true;
    this.setState({currCharity: row.name});
    this.setState({currRow: row.id});
    // alert("Added " + row.name + " to cart!");
  }

  buttonFormatter(cell, row) {
    return (
      <Button bsStyle="success" onClick={() => this.onAddtoCartClick(cell, row)}>Give!</Button>);
  }

  populateComponent(){
    this.state.stuffs = [];

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", HOST_NAME + "/charities/", false);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Authorization", "Token " + localStorage.token);
    xhttp.send();
    var response = JSON.parse(xhttp.responseText);

    for (let i = 0; i < response.results.length; i++){
      xhttp.open("GET", response.results[i].sector, false);
      xhttp.setRequestHeader("Content-Type", "application/json");
      xhttp.setRequestHeader("Authorization", "Token " + localStorage.token);
      xhttp.send();
      var sectorResponse = JSON.parse(xhttp.responseText);
      response.results[i].sector = sectorResponse.name;
      this.state.currTable.push(response.results[i]);
    }

    this.state.stuffs.push(
      <div>
      <h4><Label bsStyle="success" >Give to a Charity</Label></h4>
      <BootstrapTable  ref={"tableCharities"} data={this.state.currTable} hover>
      <TableHeaderColumn isKey dataField='id' hidden>id</TableHeaderColumn>
      <TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
      <TableHeaderColumn dataField='description'>Description</TableHeaderColumn>
      <TableHeaderColumn dataField='sector'>Sector</TableHeaderColumn>
      <TableHeaderColumn dataField='email'>Email</TableHeaderColumn>
      <TableHeaderColumn dataField='link'>Link</TableHeaderColumn>
      </BootstrapTable>
      <hr />
    </div>);
    return this.state.stuffs;
  }

  getAllAccounts(){
      restRequest("GET", "/customers/"+localStorage.userid+"/accounts"+"?key="+apiKey, "application/json", null,
                  (responseText)=>{
                    var response = JSON.parse(responseText);
                    console.log(response);
                    this.setState({accounts: response}, ()=>{this.populateComponent()});
                  },
                ()=>{});
  }

  getCharityAmount(){
      var xhttp = new XMLHttpRequest();
      xhttp.open("GET", C1_URL + "/accounts/"+localStorage.charityid+"?"+"key="+apiKey, false);
      xhttp.setRequestHeader("Content-Type", "application/json");
      xhttp.send("key="+apiKey);
      var response = JSON.parse(xhttp.responseText);
      console.log(response.balance);
      this.setState({balance: response.balance});
    return response.balance;
  }

  render() {
    return (
      <div>
      <Modal show={this.state.showModal} onHide={this.closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Donate</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Donate to {this.state.currCharity}</h4>
        <form>
          <FormGroup controlId="formBasicText" >
                    <ControlLabel>Amount</ControlLabel>
                    <Col sm={4}>
                    <FormControl
                      type="text"
                      placeholder="Enter value"
                      onChange={this.handleTextChange}
                    />
                    </Col>
          </FormGroup>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button bsStyle="success" onClick={this.saveModal}>Save</Button>
      </Modal.Footer>
    </Modal>
      <Alert bsStyle="success">
      <h2>Amount Pledged to Charity: ${this.state.balance}</h2>
      </Alert>
      {this.populateComponent()}
      </div>
    );
  }
}
