var React     = require('react');
var ReactDOM  = require('react-dom');
var ReactBsTable = require('react-bootstrap-table');

import {Col, Checkbox, Form, FormGroup, ControlLabel, InputGroup, Button, FormControl, Alert} from 'react-bootstrap';
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;

import {restRequest} from './Utilities.js';

const davidID = "58a7e5241756fc834d904a5a";
const apiKey = "52f69545ffa7fffb30dc369ac3103f7f";
const C1_URL = "http://api.reimaginebanking.com";
const HOST_NAME = "http://colab-sbx-92.oit.duke.edu";

export default class SettingsComponent extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      tooltips:["If your goal is a legitimate tax deduction, then you must be giving to a qualified organization. Also, you cannot deduct contributions made to specific individuals, political organizations and candidates. See IRS Publication 526, Charitable Contributions, for rules on what constitutes a qualified organization.",
                "To deduct a charitable contribution, you must file Form 1040 and itemize deductions on Schedule A.",
                "If you receive a benefit because of your contribution such as merchandise, tickets to a ball game or other goods and services, then you can deduct only the amount that exceeds the fair market value of the benefit received.",
                "Donations of stock or other non-cash property are usually valued at the fair market value of the property. Clothing and household items must generally be in good used condition or better to be deductible. Special rules apply to vehicle donations.",
                "Fair market value is generally the price at which property would change hands between a willing buyer and a willing seller, neither having to buy or sell, and both having reasonable knowledge of all the relevant facts.",
                "Regardless of the amount, to deduct a contribution, you must maintain a bank record, payroll deduction records or a written communication from the organization containing the name of the organization, the date of the contribution and amount of the contribution.",
                "To claim a deduction for contributions of cash or property equaling $250 or more you must have a bank record, payroll deduction records or a written acknowledgment from the qualified organization showing the amount of the cash and a description of any property contributed, and whether the organization provided any goods or services in exchange for the gift.",
                "Taxpayers donating an item or a group of similar items valued at more than $5,000 must also complete Section B of Form 8283, which generally requires an appraisal by a qualified appraiser.",
                "Fill out our form on the Charity Settings page to itemize your donations for later review while filing your taxes. Store all of the info in one place!",
                "When donating, check to see if the target organization is tax-exempt so that your donation is tax-deductible! Use https://apps.irs.gov/app/eos/mainSearch.do?mainSearchChoice=pub78&dispatchMethod=selectSearch  to check.",
                "Make sure you put in your donations before December 31 for that tax year-- otherwise, you will have to wait until the next tax season before you can apply for tax-deductions for your donations!",
                "There are limits to the tax deductions. It is based on your adjusted gross income. you can deduct appreciated capital gains assets up to 20% of AGI; you can deduct non-cash assets worth up to 30% of AGI; and you can deduct cash contributions up to 50% of AGI"],
      accounts: [],
      stuffs: [],
      currTable: [],
      alertVisible: true
    }
    this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
    this.generateRules = this.generateRules.bind(this);
  }

  handleAlertDismiss() {
    this.setState({alertVisible: false});
  }
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  generateAlert(){
    var i = this.getRandomInt(0, this.state.tooltips.length);
    return(
      <Alert bsStyle="success" onDismiss={this.handleAlertDismiss}>
        <strong>{this.state.tooltips[i]}</strong>
      </Alert>
    );
  }

  generateRules(){

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", HOST_NAME + "/rules/", false);
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
      this.state.currTable.push({sector: sectorResponse.name, rate: response.results[i].rate});
    }

    return(
      <BootstrapTable key={"tableRules"} ref={"tableRules"} data={this.state.currTable} hover>
      <TableHeaderColumn isKey dataField='id' hidden>id</TableHeaderColumn>
      <TableHeaderColumn dataField='sector'>Sector</TableHeaderColumn>
      <TableHeaderColumn dataField='rate'>Rate</TableHeaderColumn>
      </BootstrapTable>
    );
  }

  render() {
    return (
        <div className="col-md-6 col-md-offset-3">
        {this.state.alertVisible ? this.generateAlert() : null}
        <h4>Current Rules</h4>
        {this.generateRules()}
      <form>
  <Checkbox checked >
    Insights On/Off
  </Checkbox>
  <Checkbox checked >
    Suggestions to non-monetary donation/contribution
  </Checkbox>
  <FormGroup controlId="formBasicText">
            <ControlLabel>Ratio of spending to donation automatically deposited to charity account</ControlLabel>
            <Col sm={2}>
            <FormControl
              type="text"
              placeholder="eg. 0.1"
            />
            </Col>
          </FormGroup>


          <FormGroup controlId="formBasicText">
                    <ControlLabel>Current Location to search for volunteering opportunities</ControlLabel>
                    <Col sm={4}>
                    <FormControl
                      type="text"
                      placeholder="Enter location"
                    />
                    </Col>
                    </FormGroup>

  <Checkbox checked >
    Pie Chart
  </Checkbox>
  <Checkbox checked >
    Spending Over Time
  </Checkbox>
  <Checkbox checked >
    Go Fund Me / Non-listed charity addtions
  </Checkbox>
  {' '}
  <h4>Tax Deductible Contributions</h4>
  <FormGroup controlId="formBasicText">
            <ControlLabel>Target Organization</ControlLabel>
            <Col sm={4}>
            <FormControl
              type="text"
              placeholder="Enter org"
            />
            </Col>
          </FormGroup>

          <FormGroup controlId="formBasicText">
                    <ControlLabel>Market Value</ControlLabel>
                    <Col sm={4}>
                    <FormControl
                      type="text"
                      placeholder="Enter value"
                    />
                    </Col>
          </FormGroup>
          <FormGroup controlId="formBasicText">
                    <ControlLabel>Date</ControlLabel>
                    <Col sm={4}>
                    <FormControl
                      type="text"
                      placeholder="Enter date"
                    />
                    </Col>
          </FormGroup>
          <FormGroup controlId="formBasicText">
                    <ControlLabel>Address of organization</ControlLabel>
                    <Col sm={4}>
                    <FormControl
                      type="text"
                      placeholder="Enter address"
                    />
                    </Col>
          </FormGroup>
          <FormGroup controlId="formBasicText">
                    <ControlLabel>Description of donation</ControlLabel>
                    <Col sm={4}>
                    <FormControl
                      type="text"
                      placeholder="Enter description"
                    />
                    </Col>
          </FormGroup>


  <Button type="submit">
    Submit
  </Button>
</form>
      </div>
    );
  }
}
