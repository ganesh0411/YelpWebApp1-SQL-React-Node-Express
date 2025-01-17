import React, {Component} from 'react';
import cookie from 'react-cookies';
import {Link, Redirect} from 'react-router-dom';
import NavBarLogin from "../navbarlogin";
import './userprofile.css';
import axios from 'axios';
import {rooturl} from '../../config';


class UserProfile extends Component{
    constructor(props){
        super(props);
        this.state = {
            name : "",
            contact : "",
            address : "",
            username : "",
            updateStatus : ""
        }
        this.changeHandler = this.changeHandler.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    changeHandler = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    componentWillMount(){
        var username = '';
        if(this.props.location && this.props.location['email']) {
            username = this.props.location.email;
        } else if(cookie.load('cookieemail')) {
            username = cookie.load('cookieemail');
        }

        if(username != ""){
           
            const data = {
                username : username
            }
            axios.post(rooturl + '/GetUserProfile', data)
            .then(response => {
                console.log("Response Status: " + response.status);
                if(response.status === 200){
                    //console.log(response.data)
                    this.setState({
                        name : response.data.NAME,
                        address : response.data.ADDRESS,
                        contact : response.data.CONTACT,
                        username: response.data.USERNAME
                    })
                    //console.log(this.state);

                } else {
                    console.log("Error Response");
                }
            })
        }
    }
    onSubmit(e){
        e.preventDefault();
            console.log("Updating Profile");

            const data = {
                name : this.state.name,
                contact : this.state.contact,
                address : this.state.address,
                email : this.state.username
            }

            axios.post(rooturl + '/UserProfile', data)
            .then(response => {
                console.log("Response Status: " + response.status);
                if(response.status === 200){
                    console.log(response.data)
                    this.setState({
                        updateStatus : true
                    })
                    alert("Profile Updated Successfully");

                } else {
                    console.log("Error Response");
                }
            })

    }

    render() {
        var readOnly = this.props.location && this.props.location['email'];
        let redirectVar = null;
        if(this.state.restname != ""){
            localStorage.setItem('restname', this.state.restname);
            redirectVar = <Redirect to = {{pathname: '/ViewRestaurant', state: { restname: this.state.restname }}}/>
        }
        return (
            <div>
                <NavBarLogin />
                
                <div>
                <div class="container">
                <h2 >User Profile</h2>
                <form class="form-horizontal">
                    <div class="form-group">
                    <label class="control-label col-sm-2" for="name">Username:</label>
                    <div class="col-sm-10">
                        <input type="text" onChange = {this.changeHandler} value={this.state.username} class="form-control" id="username"  placeholder="Name" name="name" disabled />
                    </div>
                    </div>
                    <div class="form-group">
                    <label class="control-label col-sm-2" for="name">Name:</label>
                    <div class="col-sm-10">
                        <input type="text" onChange = {this.changeHandler} value={this.state.name} class="form-control" id="name"  placeholder="Name" name="name" required disabled={readOnly} />
                    </div>
                    </div>
                    <div class="form-group">
                    <label class="control-label col-sm-2" for="contact">Contact:</label>
                    <div class="col-sm-10">
                        <input type="number" onChange = {this.changeHandler} value={this.state.contact} class="form-control" id="contact" placeholder="Contact" name="contact" required disabled={readOnly}/>
                    </div>
                    </div>
                    <div class="form-group">
                    <label class="control-label col-sm-2" for="address">Address:</label>
                    <div class="col-sm-10">
                        <input type="text" onChange = {this.changeHandler} value={this.state.address} class="form-control" id="address" placeholder="Address" name="address" required disabled={readOnly}/>
                    </div>
                    </div>
                    
                    
                    <div class="form-group">
                        <label>Profile Picture</label>
                        <div class="input-group">
                        {!readOnly &&
                          <span class="input-group-btn">
                            <span class="btn btn-default btn-file">Upload Image <input type="file" id="imgInp"/></span> 
                            </span>
                        }
                            
                        </div>
                    </div>
                    <div class="form-group">        
                    <div class="col-sm-offset-2 col-sm-10">
                        {!readOnly &&
                          <button type="submit" class="btn btn-danger" onClick={this.onSubmit}>Submit</button>
                        }
                      
                        
                        <Link to={`/${readOnly ? 'Owner': 'User'}Dashboard`}><button type="button" class="btn btn-danger">{`${readOnly ? 'Go Back': 'Cancel'}`}</button></Link>
                    </div>
                    </div>
                </form>
                </div>
                </div>
                
            </div>
        )
    }

}

export default UserProfile;
