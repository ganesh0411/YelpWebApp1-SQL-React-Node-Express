import React, {Component} from 'react';
import cookie, { setRawCookie } from 'react-cookies';
import {Redirect} from 'react-router';
import {Link} from 'react-router-dom';
import NavBarLogin from "../navbarlogin";
import "../dashboard/userdashboard.css";
import axios from 'axios';
import {rooturl} from '../../config';

class UserOrders extends Component{
    constructor(props){
        super(props);
        this.state = {
            username : cookie.load('cookieemail'),
            newOrders : "",
            otherOrders : "",
            orderCheck : "",
            newOrderFilter: "ALL",
            otherOrderFilter: "ALL",
            newOrderStatusList: ["NEW", "PREPARING", "OUT FOR DELIVERY", "PICK UP READY"],
            otherOrderStatusList: ["DELIVERED", "CANCELLED", "PICKED UP"],
            newOrders : [],
            otherOrders : [],
            newOrdersFiltered : [],
            otherOrdersFiltered : []
        }
    }
    applyNewOrderFilter = (f) => {
        this.setState({
            newOrdersFiltered : f == "ALL" ? this.state.newOrders : this.state.newOrders.filter(x => x.orderstatus == f)
        })
    }
    applyOtherOrderFilter = (f) => {
        this.setState({
            otherOrderFiltered : f == "ALL" ? this.state.otherOrders : this.state.otherOrders.filter(x => x.orderstatus == f)
        })
    }
    componentWillMount(){

        const data = {
            username : this.state.username
        }
        console.log(data);
        axios.post(rooturl + '/getUserOrders', data)
        .then(response => {
            console.log("Response Status: " + response.status);
            if(response.status === 200){
                console.log(response.data);
                this.setState({
                    newOrders : response.data.newOrders,
                    otherOrders : response.data.otherOrders,
                    newOrdersFiltered : response.data.newOrders,
                    otherOrdersFiltered : response.data.otherOrders,
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

    
    render(){

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
        var newOrderDetails = "No Orders Found";
        var otherOrderDetails = "No Orders Found";
        if(this.state.newOrdersFiltered.length > 0) {
            newOrderDetails = this.state.newOrdersFiltered.map(result => {
                return(
                    <tbody key={result.cartid}>
                    <tr>
                    <th>ID : {result.cartid} | Restaurant : {result.rest_name} | Status : {result.orderstatus} | Total : {result.totalprice}</th>
                    </tr>
                    {itemDetails(result.items)}
                    
                    </tbody>
                );
            });
        } 
        if(this.state.otherOrdersFiltered.length > 0) {
            otherOrderDetails = this.state.otherOrdersFiltered.map(result => {
                return(
                    <tbody key={result.cartid}>
                    <tr>
                    <th>ID : {result.cartid} | Restaurant : {result.rest_name} | Status : {result.orderstatus} | Total : {result.totalprice}</th>
                    </tr>
                    {itemDetails(result.items)}
                    
                    </tbody>
                );
            });
        } 


    }
        return(
            <div>
                <NavBarLogin />
                <div class="vertical-nav bg-danger" id="sidebar">
                    <p class="text-gray font-weight-bold text-uppercase px-3 small pb-4 mb-0">Dashboard</p>
                    <ul class="nav flex-column bg-white mb-0">
                        <li class="nav-item">
                            <a href="/UserProfile" class="nav-link text-dark font-italic bg-light">
                                <i class="fa fa-th-large mr-3 text-primary fa-fw"></i>Profile
                    </a></li>
                        <li class="nav-item">
                            <a href="/UserOrders" class="nav-link text-dark font-italic bg-light">
                                <i class="fa fa-th-large mr-3 text-primary fa-fw"></i>Orders
                    </a></li>
                    </ul>
                </div>
                <div class="page-content p-5" >
                    <h4>Your Orders</h4>
                    <div class="panel-group" id="accordion">
                        <div class="panel panel-default">
                            <div class="panel-heading" style={{display: "flex", justifyContent: "space-between"}}>
                                <h4 class="panel-title">
                                    <button class="btn btn-danger" data-toggle="collapse" data-parent="#accordion" data-target="#collapse1">Current Orders</button>
                                </h4>
                                <select 
                                onChange={(e) => this.applyNewOrderFilter(e.target.value)}>
                                    <option defaultChecked value="ALL">ALL</option>
                                    {this.state.newOrderStatusList.map(s => 
                                        <option value={s}>
                                            {s}
                                        </option>
                                    )}
                                </select>
                            </div>
                            <div id="collapse1" class="panel-collapse collapse in">
                            <table class="table table-hover">
                                <thead>
                                </thead>
                                {newOrderDetails}        
                             </table>
                            </div>
                        </div>
                        <div style={{height: "20px"}}>

                        </div>
                        <div class="panel panel-default">
                            <div class="panel-heading" style={{display: "flex", justifyContent: "space-between"}}>
                                <h4 class="panel-title">
                                <button class="btn btn-danger" data-toggle="collapse" data-parent="#accordion" data-target="#collapse2">Past Orders</button>
                                </h4>
                                <select 
                                onChange={(e) => this.applyOtherOrderFilter(e.target.value)}>
                                    <option defaultChecked value="ALL">ALL</option>
                                    {this.state.otherOrderStatusList.map(s => 
                                        <option value={s}>
                                            {s}
                                        </option>
                                        )}
                                </select>
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

export default UserOrders;