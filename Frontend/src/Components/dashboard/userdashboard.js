import React, {Component} from 'react';
import cookie, { setRawCookie } from 'react-cookies';
import {Redirect} from 'react-router';
import {Link} from 'react-router-dom';
import NavBarLogin from "../navbarlogin";
import "./userdashboard.css";
import axios from 'axios';
import {rooturl} from '../../config';

class UserDashboard extends Component{
    constructor(props){
        super(props);
        this.state = {
            restname : "",
            searchResults : [],
            itemname : "",
            searchCheck : "false",
            cuisinesFilter : [],
            option : ""
        }
        this.changeHandler = this.changeHandler.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.restaurantpage = this.restaurantpage.bind(this);
        this.applyFilter = this.applyFilter.bind(this);
    }

    changeHandler = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    onSubmit = (e) => {
        e.preventDefault();
            //console.log(this.state.itemname);
            const data = {
                itemname : this.state.itemname
            }
            console.log(data);
            axios.post(rooturl + '/UserDashboard', data)
            .then(response => {
                console.log("Response Status: " + response.status);
                if(response.status === 200){
                    this.setState({
                        searchResults : response.data,
                        searchCheck : true,
                        cuisinesFilter : response.data
                    })
                    console.log(this.state.searchResults, this.state.cuisinesFilter);
                } else {
                    this.setState({
                        searchCheck : false
                    })
                    console.log("No Items found");
                }
            })
    }

    restaurantpage = (e) => {
        e.preventDefault();
        //console.log(e.target.value);
        this.setState({
            restname : e.target.value
        })
    }

    applyFilter = (e) => {
        e.preventDefault();
        var filter = this.state.option;
        if(filter == "All" || filter == ""){
            this.setState({
                searchResults : this.state.cuisinesFilter
            })
            console.log(this.state.searchResults);
        } else {
            var allResults = this.state.cuisinesFilter;
            var filteredResults = allResults.filter(rest => {
                return rest.CUISINE == filter;
            })
            this.setState({
                searchResults : filteredResults
            })
            console.log(this.state.searchResults);
        }


    }


    
    render(){
        var searchDetails = this.state.searchResults.map(result => {
                return(
                    <tr>
                        <td>{result.REST_NAME}</td>
                        <td>{result.CUISINE}</td>
                        <td><button value={result.REST_NAME} onClick={this.restaurantpage} class="btn btn-danger">View Restaurant</button></td>
                    </tr>
                );
        });

        var filterResults = this.state.cuisinesFilter.map(result => {
            return(
                <option value={result.CUISINE}>{result.CUISINE}</option>
            );
        });

        

        let redirectVar = null;
        if(this.state.restname != ""){
            localStorage.setItem('restname', this.state.restname);
            redirectVar = <Redirect to = {{pathname: '/ViewRestaurant', state: { restname: this.state.restname }}}/>
        }

        return(
            <div>
            <NavBarLogin />
            {redirectVar}
            <div class="vertical-nav bg-danger" id="sidebar">
            <p class="text-gray font-weight-bold text-uppercase px-3 small pb-4 mb-0">Dashboard</p>
            <ul class="nav flex-column bg-white mb-0">
                <li class="nav-item">
                    <a href="/UserProfile" class="nav-link text-dark font-italic bg-light">
                    <i class="fa fa-th-large mr-3 text-primary fa-fw"></i>Profile
                    </a>
                </li>
                <li class="nav-item">
                    <a href="/UserOrders" class="nav-link text-dark font-italic bg-light">
                    <i class="fa fa-th-large mr-3 text-primary fa-fw"></i>Orders
                    </a></li> 
            </ul>
            </div>
            <div class="page-content p-5" id="content">
            <div class="input-group mb-3">
                <input type="text" onChange = {this.changeHandler} class="form-control" name="itemname" placeholder="Search"/>
                <div class="input-group-append">
                <button class="btn btn-danger" type="submit" onClick = {this.onSubmit}>Search</button>  
                </div>
                
                <form>

                
                <div className="g-input-control btn-danger">
                    <select className="btn-danger" onChange = {(e) => this.setState({option : e.target.value})} value = {this.state.option} >
                    <option value="All" selected="selected">All</option>
                        {filterResults}
                    </select>
                    <button class="btn btn-danger" type="submit" onClick = {this.applyFilter}>Apply Filter</button>
                </div>
                </form>

            </div>
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Restaurant Name</th>
                            
                            <th></th>
                        </tr>
                    </thead>
                        <tbody>
                            {searchDetails}
                        </tbody>
                </table>
            </div>

            </div>
        )
    }
}

export default UserDashboard;
