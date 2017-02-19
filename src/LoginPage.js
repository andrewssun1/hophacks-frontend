// LoginPage.js
// Login component for React
// @author Andrew

var React = require('react');
import {Form, FormGroup, Col, Button, ControlLabel, FormControl, Alert} from 'react-bootstrap';
import { hashHistory } from 'react-router';
import { restRequest } from './Utilities';

const HOST_NAME = "http://colab-sbx-92.oit.duke.edu";
//const HOST_NAME = "http://127.0.0.1:8000";


export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _username: "",
      _password: "",
      _alert_both: false
    }
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.createAlert = this.createAlert.bind(this);
  }
  handleUsernameChange(e) {
    this.setState({_username: e.target.value});
  }
  handlePasswordChange(e) {
    this.setState({_password: e.target.value});
  }
  createAlert(txt) {
    return (
      <Alert bsStyle="danger">
        <h4>Invalid {txt}!</h4>
      </Alert>
    )
  }

  componentDidMount() {
    document.getElementById("formHorizontalPassword")
      .addEventListener("keyup", function(event) {
          event.preventDefault();
          if (event.keyCode === 13) {
              document.getElementById("submitButton").click();
          }
      });
  }

  // testSuccessCb(xhttpResponse){
  //   var response = JSON.parse(xhttpResponse);
  //   // put access token in local storage and check whether it's user or admin
  //   localStorage.token = response['access_token'];
  //   this.setState({_alert_both: false});
  //
  //   restRequest("GET", "/api/user/current/", "application/json", null,
  //               (xhttpResponse)=>{
  //                 var userResponse = JSON.parse(xhttpResponse);
  //                 localStorage.username = userResponse.username;
  //                 localStorage.isAdmin = userResponse.is_staff;
  //                 hashHistory.push('/main');
  //               }, ()=>{});
  // }
  //
  // testErrorCb(){
  //   console.log('Unauthorized!!!!!');
  //   //localStorage.alert = true;
  //   this.setState({_alert_both: true});
  // }

  handleClick() {
    // Makes sure it's not alerting
    this.setState({_alert_both: false});

    // Validate username/password - trigger alert if invalid
    if (this.state._username.length < 1 || this.state._password.length < 1){
      this.setState({_alert_both: true});
      return null;
    }

    var request_str = "username="+this.state._username+"&password="+this.state._password;
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", HOST_NAME + "/api-token-auth/", false);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(request_str);
    var response = JSON.parse(xhttp.responseText);
    if (response.token){
      localStorage.token = response['token'];
      localStorage.username = this.state._username;
      this.setState({_alert_both: false});
      xhttp.open("GET", HOST_NAME + "/charityapp/uid/", false);
      xhttp.setRequestHeader("Content-Type", "application/json");
      xhttp.setRequestHeader("Authorization", "Token " + localStorage.token);
      xhttp.send();
      var response2 = JSON.parse(xhttp.responseText);
      if (response2.url){
        localStorage.userurl = response2.url;
        localStorage.userid = response2.profile.customer_id;
        localStorage.charityid = response2.profile.charity_account_id;
      }
      console.log(localStorage.userurl);
      hashHistory.push('/accounts');
    }
    else{
      this.setState({_alert_both: true});
    }

    // REST call parameters
    // var request_str = "grant_type=password&username="+this.state._username+"&password="+this.state._password;
    // restRequest("POST", "/api/o/token/",
    //             "application/x-www-form-urlencoded", request_str,
    //             this.testSuccessCb, this.testErrorCb);


  }
  render() {

    return(
  <div>
  { this.state._alert_both ? this.createAlert("username/password") : null}
  <Form horizontal>
    <FormGroup controlId="formHorizontalEmail">
      <Col componentClass={ControlLabel} smOffset={3} sm={2}>
        Username
      </Col>
      <Col sm={2}>
        <FormControl type="text" placeholder="Username" onChange={this.handleUsernameChange}/>
      </Col>
    </FormGroup>

    <FormGroup controlId="formHorizontalPassword">
      <Col componentClass={ControlLabel} smOffset={3} sm={2}>
        Password
      </Col>
      <Col sm={2}>
        <FormControl type="password" placeholder="Password" onChange={this.handlePasswordChange}/>
      </Col>
    </FormGroup>

    <FormGroup>
      <Col smOffset={5} sm={2}>
        <Button id="submitButton" type="button" onClick={this.handleClick}>
          Sign in
        </Button>
      </Col>
    </FormGroup>
  </Form>
  </div>
)
  }

}
