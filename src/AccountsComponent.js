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
const HOST_NAME = "http://colab-sbx-92.oit.duke.edu";

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

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", HOST_NAME + "/charityapp/pull/", false);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Authorization", "Token " + localStorage.token);
    xhttp.send();
    var response = JSON.parse(xhttp.responseText);

    for (let i = 0; i < response.length; i++){
      xhttp.open("GET", response[i].sector, false);
      xhttp.setRequestHeader("Content-Type", "application/json");
      xhttp.setRequestHeader("Authorization", "Token " + localStorage.token);
      xhttp.send();
      var sectorResponse = JSON.parse(xhttp.responseText);
      response[i].sector = sectorResponse.name;
      this.state.currTable.push(response[i]);
    }

    this.state.stuffs.push(
      <div>
      <h4><Label bsStyle="primary" >All Purchases</Label></h4>
      <BootstrapTable  ref={"tablePurchases"} data={this.state.currTable} hover>
      <TableHeaderColumn isKey dataField='id' hidden>id</TableHeaderColumn>
      <TableHeaderColumn dataField='date'>Date</TableHeaderColumn>
        <TableHeaderColumn dataField='merchant'>Merchants</TableHeaderColumn>
        <TableHeaderColumn dataField='sector'>Sector</TableHeaderColumn>
      <TableHeaderColumn dataField='purchase_amount'>Purchase Amount</TableHeaderColumn>
      <TableHeaderColumn dataField='transfer_amount'>Transfer Amount</TableHeaderColumn>
      </BootstrapTable>
      <hr />
    </div>);
    // var charAccount = null;
    // for (let i = 0; i < this.state.accounts.length; i++){
    //   if (this.state.accounts[i].nickname === "Charity"){
    //     charAccount = this.state.accounts[i];
    //     continue;
    //   }
    //   // var xhttp = new XMLHttpRequest();
    //   // xhttp.open("GET", C1_URL + "/accounts/"+this.state.accounts[i]._id+"/purchases?"+"key="+apiKey, false);
    //   // xhttp.setRequestHeader("Content-Type", "application/json");
    //   // xhttp.send("key="+apiKey);
    //   // var response = JSON.parse(xhttp.responseText);
    //
    //   // for (let j = 0; j < response.length; j++){
    //   //   xhttp.open("GET", C1_URL + "/merchants/"+response[j].merchant_id+"?"+"key="+apiKey, false);
    //   //   xhttp.setRequestHeader("Content-Type", "application/json");
    //   //   xhttp.send("key="+apiKey);
    //   //   var merchantResponse = JSON.parse(xhttp.responseText);
    //   //   var merchantName = merchantResponse.name;
    //   //   response[j].merchant = merchantName;
    //   // }
    //   );
    // }
    // if (charAccount){
    //   this.state.stuffs.push(
    //     <div key="charity">
    //     <h4><Label bsStyle="success" key="charitylabel">Account: {charAccount.nickname}</Label></h4>
    //     <Well key="charitywell"></Well>
    //     </div>
    //   );
    // }
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

  render() {
    return (
      <div>
      {this.populateComponent()}
      </div>
    );
  }
}
