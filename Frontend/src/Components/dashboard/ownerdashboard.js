import React, {Component} from 'react';
import cookie, { setRawCookie } from 'react-cookies';
import {Redirect} from 'react-router';
import {Link} from 'react-router-dom';
import NavBarLogin from "../navbarlogin";
import "./userdashboard.css";
import axios from 'axios';
import {rooturl} from '../../config';

class OwnerDashboard extends Component{
    constructor(props){
        super(props);
        this.state = {
            restname : cookie.load('cookierestname'),
            newOrders : "",
            otherOrders : "",
            orderCheck : "",
            orderStatus : "",
            updateStatus : ""
        }
        this.changeHandler = this.changeHandler.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
    }

    changeHandler = (e) => {
        this.setState({
                [e.target.name] : [e.target.value]
        })
        //console.log(this.state);
    }

    componentWillMount(){
        const data = {
            restname : this.state.restname
        }
        console.log(data);
        axios.post(rooturl + '/getOwnerOrders', data)
        .then(response => {
            console.log("Response Status: " + response.status);
            if(response.status === 200){
                console.log(response.data);
                this.setState({
                    newOrders : response.data.newOrders,
                    otherOrders : response.data.otherOrders,
                    orderCheck : true
                })
                //console.log(this.state.menu);
            } else {
                this.setState({
                    orderCheck : false
                })
                console.log("No Items found");
            }
        })
        .catch(err => {
            console.log(err);
            this.setState({
                orderCheck : false
            })
        })
    }

    updateStatus(e){
        e.preventDefault();
        var element;
        for (element in this.state){
            if(element == "restname" || element == "newOrders" || element == "otherOrders" || element == "orderCheck" || element == "orderStatus" || element == "updateStatus"){
                continue;
            } else {
                if(this.state[element] == "PREPARING" || this.state[element] == "READY" || this.state[element] == "DELIVERED" || this.state[element] == "CANCELLED"){
                    const data = {
                        cartid : element,
                        orderstatus : this.state[element]
                    }
                    console.log(data);
                    axios.post(rooturl + "/updateStatus", data)
                    .then(response => {
                        console.log("Response Status: " + response.status);
                        if(response.status === 200){
                            alert("Order Status Updated Successfully");
                            this.setState({
                                orderStatus : true
                            }) 
                        } else {
                            this.setState({
                                orderStatus : false
                            })
                            console.log("No Items found");
                        }
                        window.location.reload(false);
                    })
                } else {
                    alert("Only valid status are PREPARING, READY, DELIVERED, CANCELLED");
                }
            }
        }
    }
    
    render(){
        let redirectVar = null;
        if(this.state.orderStatus){
            redirectVar = <Redirect to = '/OwnerDashboard'/>
        }


        if(this.state.orderCheck){
            var itemDetails = (items) => {
                var rows = items.map(itm => {
                    return (
                        <tr key={itm.itemname}>
                        <td>{itm.itemname} - {itm.quantity} X ${itm.itemprice} = {itm.price}</td>
                        </tr>
                    )
                })
                return rows;
            }
    
            var newOrderDetails = this.state.newOrders.map(result => {
                const newTo = { 
                    pathname: "/UserProfile", 
                    email: result.username
                };
                return(
                    <tbody key={result.cartid}>
                    <tr>
                    <th>ID : {result.cartid} | Customer :
                      <Link to={newTo}>{result.username}</Link>
                      | Status : {result.orderstatus} | Total : {result.totalprice}</th>
                    
                    </tr>
                    <tr><th>Address : {result.address}</th>
                    <th><input type="text" className="form-control" name={result.cartid} onChange = {this.changeHandler} placeholder="PREPARING, READY, DELIVERED" id={result.cartid}/></th>
                    <th><button value={result.cartid} onClick={this.updateStatus} class="btn btn-danger">Update Status</button></th>
                    </tr>
                    {itemDetails(result.items)}
                    
                    </tbody>
                );
            });
    
            var otherOrderDetails = this.state.otherOrders.map(result => {
                return(
                    <tbody key={result.cartid}>
                    <tr>
                    <th>ID : {result.cartid} | Customer : {result.username} | Status : {result.orderstatus} | Total : {result.totalprice}</th>
                    </tr>
                    <tr><th>Address : {result.address}</th>
                    
                    </tr>
                    {itemDetails(result.items)}
                    </tbody>
                );
            });
    
        }

        return(
            <div>
            <NavBarLogin />
            {redirectVar}
            <div class="vertical-nav bg-danger" id="sidebar">
            <p class="text-gray font-weight-bold text-uppercase px-3 small pb-4 mb-0">Dashboard</p>
            <ul class="nav flex-column bg-white mb-0">
                <li class="nav-item">
                    <a href="/OwnerProfile" class="nav-link text-dark font-italic bg-light">
                    <i class="fa fa-th-large mr-3 text-primary fa-fw"></i>Profile
                    </a>
                </li>
                <li class="nav-item">
                    <a href="/ViewMenu" class="nav-link text-dark font-italic bg-light">
                    <i class="fa fa-th-large mr-3 text-primary fa-fw"></i>Restaurant Menu
                    </a></li> 
                    <li class="nav-item">
                    <a href="/MenuUpdate" class="nav-link text-dark font-italic bg-light">
                    <i class="fa fa-th-large mr-3 text-primary fa-fw"></i>Update Menu
                    </a></li>
            </ul>
            </div>
            <div class="page-content p-5" id="content">

            <h4>Your Orders</h4>
                    <div class="panel-group" id="accordion">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h4 class="panel-title">
                                    <button class="btn btn-danger" data-toggle="collapse" data-parent="#accordion" data-target="#collapse1">Current Orders</button>
                                </h4>
                            </div>
                            <div id="collapse1" class="panel-collapse collapse in">
                            <table class="table table-hover">
                                <thead>
                                </thead>
                                {newOrderDetails}        
                             </table>
                            </div>
                        </div>
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h4 class="panel-title">
                                <button class="btn btn-danger" data-toggle="collapse" data-parent="#accordion" data-target="#collapse2">Past Orders</button>
                                </h4>
                            </div>
                            <div id="collapse2" class="panel-collapse collapse">
                            <table class="table table-hover">
                                <thead>
                                </thead>
                                {otherOrderDetails}        
                             </table>
                            </div>
                        </div>
                    </div>


            </div>

            </div>
        )
    }
}

export default OwnerDashboard;
