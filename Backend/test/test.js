var chai = require('chai');
var chaiHttp = require('chai-http');
var should = require('chai').should();
chai.use(chaiHttp);
var assert = require('chai').assert;
var expect = chai.expect;

describe('Yelp Test Cases:', () => {
    it("Case : Get Restaurants on search", (done) => {
        chai.request('http://localhost:3001')
        .post('/UserDashboard')
        .set('Accept', 'application/json')
        .send({"itemname" : "baklava"})
        .then((res) => {
            expect(res.status).to.equal(200);
            done();
        })
    })

     it("Case : Get All Owner Orders", (done) => {
         chai.request('http://localhost:3001')
         .post('/getOwnerOrders')
         .set('Accept', 'application/json')
         .send({
             "owneremail" : "test@gmail.com",
             "restname" : "Sajj Med"
         })
         .then((res) => {
             expect(res.status).to.equal(200);
            done();
         })
     })

     it("Case : User login check", (done) => {
         chai.request('http://localhost:3001')
         .post('/loginUser')
         .set('Accept', 'application/json')
         .send({
             "username" : "mscott@gmail.com",
             "password" : "qwerty"
         })
         .then((res) => {
             expect(res.status).to.equal(200);
             done();
         })
     })

     it("Case : Get Restaurant Menu for owner", (done) => {
         chai.request('http://localhost:3001')
         .post('/GetMenu')
         .set('Accept', 'application/json')
         .send({
            "restname" : "Sajj Med"
         })
         .then((res) => {
             expect(res.status).to.equal(200);
             done();
         })
     })

     it("Case : Get Restaurant profile", (done) => {
         chai.request('http://localhost:3001')
         .post('/GetOwnerProfile')
         .set('Accept', 'application/json')
         .send({
             "email" : "test@gmail.com"
         })
         .then((res) => {
             expect(res.status).to.equal(200);
             done();
         })
    })
})