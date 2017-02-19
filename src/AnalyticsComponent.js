var React     = require('react');
var ReactDOM  = require('react-dom');
var ReactBsTable = require('react-bootstrap-table');

import { Modal, Button, Popover, FormGroup, ControlLabel, Col, FormControl } from 'react-bootstrap';
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;

import {restRequest} from './Utilities.js';
import {PieChart, Pie, Sector, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

const davidID = "58a7e5241756fc834d904a5a";
const apiKey = "52f69545ffa7fffb30dc369ac3103f7f";
const C1_URL = "http://api.reimaginebanking.com";
const HOST_NAME = "http://colab-sbx-92.oit.duke.edu";
// const data = [{name: 'Group A', value: 400}, {name: 'Group B', value: 300},
//                 {name: 'Group C', value: 300}, {name: 'Group D', value: 200}];

const renderActiveShape = (props) => {
const RADIAN = Math.PI / 180;
const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
  fill, payload, percent, value } = props;
const sin = Math.sin(-RADIAN * midAngle);
const cos = Math.cos(-RADIAN * midAngle);
const sx = cx + (outerRadius + 10) * cos;
const sy = cy + (outerRadius + 10) * sin;
const mx = cx + (outerRadius + 30) * cos;
const my = cy + (outerRadius + 30) * sin;
const ex = mx + (cos >= 0 ? 1 : -1) * 22;
const ey = my;
const textAnchor = cos >= 0 ? 'start' : 'end';

return (
  <g>
    <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
    />
    <Sector
      cx={cx}
      cy={cy}
      startAngle={startAngle}
      endAngle={endAngle}
      innerRadius={outerRadius + 6}
      outerRadius={outerRadius + 10}
      fill={fill}
    />
    <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
    <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
    <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`$${value}`}</text>
    <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
      {`(Rate ${(percent * 100).toFixed(2)}%)`}
    </text>
  </g>
);
};


export default class AnalyticsComponent extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      activeIndex: 0,
      showModal: false,
      data: [],
      barData: [],
      commentsData: [],
      modalSector: "",
      modalRate: 0
    }
    //this.generateTable = this.generateTable.bind(this);
    // this.populateComponent = this.populateComponent.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onPieEnter = this.onPieEnter.bind(this);
    this.saveModal = this.saveModal.bind(this);
    this.onRuleClick = this.onRuleClick.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  closeModal() {
    this.setState({ showModal: false });
  }

  handleTextChange(e) {
    var modalFloat = parseFloat(e.target.value);
    this.setState({modalRate: modalFloat});
  }

  openModal() {
    this.setState({ showModal: true });
  }

  saveModal(){
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", HOST_NAME + "/rules/", false);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.setRequestHeader("Authorization", "Token " + localStorage.token);
    xhttp.send("user="+localStorage.userurl+"&sector="+this.state.modalData.sector+"&rate="+this.state.modalRate);
    console.log(JSON.parse(xhttp.responseText));
    this.closeModal();
  }

  componentWillMount(){
    // Create modal
    console.log("Mounting!");
    this.state.data = [];
    this.state.barData = [];
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", HOST_NAME + "/charityapp/spending/", false);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Authorization", "Token " + localStorage.token);
    xhttp.send();
    // console.log(xhttp.responseText);
    var response = JSON.parse(xhttp.responseText);
    this.state.spending = response;
    for (var key in response){
      this.state.data.push({name: key, value: response[key]});
    }

    xhttp.open("GET", HOST_NAME + "/sectors/", false);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Authorization", "Token " + localStorage.token);
    xhttp.send();
    var sectorResponse = JSON.parse(xhttp.responseText);
    console.log(xhttp.responseText);
    this.state.sectors = sectorResponse;

    for (var i=0; i<sectorResponse.results.length; i++){
      var curravg = parseInt(sectorResponse.results[i].national_average, 10);
      this.state.barData.push({name: sectorResponse.results[i].name, You: response[sectorResponse.results[i].name], USA: curravg});
    }
    console.log(this.state.barData);
  }

  onRuleClick(responseData){
    this.state.modalData = responseData;
    console.log(responseData);
    this.setState({modalSector: "hello"});
    this.openModal();
  }

  onPieEnter(data, index) {
    this.setState({
      activeIndex: index,
    });
  }


  generateModalSuggestion(){
    var commentsData = [];
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", HOST_NAME + "/charityapp/suggestions/", false);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Authorization", "Token " + localStorage.token);
    xhttp.send();
    var response = JSON.parse(xhttp.responseText);

    for (let i=0; i<response.length; i++){
      commentsData.push(
        <div style={{ height: 120 }} key={"popover"+i}>
          <Popover
            id={"popover-basic"+i}
            placement={(i%2===0)? "right": "left"}
            positionLeft={(i%2===0)? 300 : 700}
            positionTop={680+160*(i+1)}
            title={response[i].name}
          ><img style={{height: 50}} src={response[i].picture}></img>
          {response[i].description}
          <br />
          {(response[i].rule_creator===true) ? <div className="pull-right"><Button onClick={()=>{this.onRuleClick(response[i])}} bsStyle="success">Make Rule</Button></div> : null}
          <br />
          </Popover>
        </div>
      );
    }
    console.log(commentsData);

    return commentsData;

  }

  render() {
    return (
      <div>
        <Modal show={this.state.showModal} onHide={this.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Make Rule!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Create a new rule for {this.state.modalSector}</h4>
          <form>
            <FormGroup controlId="formBasicText" >
                      <ControlLabel>% of original purchase</ControlLabel>
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
      <div className="col-md-6 col-md-offset-3">
      <PieChart width={800} height={400} onMouseEnter={this.onPieEnter}>
        <Pie
          activeIndex={this.state.activeIndex}
          activeShape={renderActiveShape}
          data={this.state.data}
          cx={300}
          cy={200}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"/>
       </PieChart>
       <BarChart width={550} height={300} data={this.state.barData}
       margin={{top: 5, right: 30, left: 20, bottom: 5}}>
        <XAxis dataKey="name"/>
        <YAxis/>
        <CartesianGrid strokeDasharray="3 3"/>
        <Tooltip/>
        <Legend />
        <Bar dataKey="You" fill="#8884d8" minPointSize={5}/>
        <Bar dataKey="USA" fill="#82ca9d" minPointSize={10}/>
       </BarChart>
      </div>
      {this.state.showModal ? null : this.generateModalSuggestion()}
      </div>
    );
  }
}
