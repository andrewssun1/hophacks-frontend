var React     = require('react');
var ReactDOM  = require('react-dom');
var ReactBsTable = require('react-bootstrap-table');

import {Label, Tab, Row, Col, Nav, Navbar, NavItem, NavDropdown, MenuItem, Table, Well } from 'react-bootstrap';
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;

import {restRequest} from './Utilities.js';

const davidID = "58a7e5241756fc834d904a5a";
const apiKey = "52f69545ffa7fffb30dc369ac3103f7f";
const C1_URL = "http://api.reimaginebanking.com";

export default class AccountsComponent extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      accounts: [],
      stuffs: [],
      currTable: []
    }
    //this.generateTable = this.generateTable.bind(this);
    this.populateComponent = this.populateComponent.bind(this);
  }


  componentWillMount(){
    console.log("Mounting!")
    this.getAllAccounts();
  }

  populateComponent(){
    this.state.stuffs = [];
    var charAccount = null;
    for (let i = 0; i < this.state.accounts.length; i++){
      if (this.state.accounts[i].nickname === "Charity"){
        charAccount = this.state.accounts[i];
        continue;
      }
      var xhttp = new XMLHttpRequest();
      xhttp.open("GET", C1_URL + "/accounts/"+this.state.accounts[i]._id+"/purchases?"+"key="+apiKey, false);
      xhttp.setRequestHeader("Content-Type", "application/json");
      xhttp.send("key="+apiKey);
      var response = JSON.parse(xhttp.responseText);

      for (let j = 0; j < response.length; j++){
        xhttp.open("GET", C1_URL + "/merchants/"+response[j].merchant_id+"?"+"key="+apiKey, false);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send("key="+apiKey);
        var merchantResponse = JSON.parse(xhttp.responseText);
        var merchantName = merchantResponse.name;
        response[j].merchant = merchantName;
      }
      this.state.stuffs.push(
        <div key={"cat"+i}>
        <h4><Label bsStyle="primary" key={"label"+i}>Account: {this.state.accounts[i].nickname}</Label></h4>
        <BootstrapTable key={"table"+i} ref={"table"+i} data={response} hover>
        <TableHeaderColumn isKey dataField='_id' hidden>id</TableHeaderColumn>
        <TableHeaderColumn dataField='description'>Description</TableHeaderColumn>
        <TableHeaderColumn dataField='amount'>Amount</TableHeaderColumn>
        <TableHeaderColumn dataField='merchant'>Merchants</TableHeaderColumn>
        <TableHeaderColumn dataField='status'>Status</TableHeaderColumn>
        </BootstrapTable>
        <hr />
        </div>
      );
    }
    if (charAccount){
      this.state.stuffs.push(
        <div key="charity">
        <h4><Label bsStyle="success" key="charitylabel">Account: {charAccount.nickname}</Label></h4>
        <Well key="charitywell"></Well>
        </div>
      );
    }
    return this.state.stuffs;
  }

  getAllAccounts(){
      restRequest("GET", "/customers/"+davidID+"/accounts"+"?key="+apiKey, "application/json", null,
                  (responseText)=>{
                    var response = JSON.parse(responseText);
                    console.log(response);
                    this.setState({accounts: response}, ()=>{this.populateComponent()});
                  },
                ()=>{});
  }

  // generateTable(acc, i, cb){
  //   var currTable = [];
  //   var currData = [];
  //   restRequest("GET", "/accounts/"+acc._id+"/purchases"+"?key="+apiKey, "application/json", null,
  //               (responseText)=>{
  //                 var response = JSON.parse(responseText);
  //                 console.log(response);
  //                 currData = response;
  //                 currTable = (
  //                  <BootstrapTable key={"table"+i} ref={"table"+i} data={currData} hover>
  //                  <TableHeaderColumn isKey dataField='_id' hidden>id</TableHeaderColumn>
  //                  <TableHeaderColumn dataField='description'>Description</TableHeaderColumn>
  //                  <TableHeaderColumn dataField='Amount'>Amount</TableHeaderColumn>
  //                  <TableHeaderColumn dataField='Merchant'>Merchants</TableHeaderColumn>
  //                  <TableHeaderColumn dataField='Status'>Status</TableHeaderColumn>
  //                  </BootstrapTable>
  //                );
  //                console.log("HEloooo")
  //                cb(currTable);
  //               },
  //             ()=>{});
  // }

  render() {
    return (
      <div>
      {this.populateComponent()}
      </div>
    );
  }
}
