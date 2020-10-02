var pool = require('../../helpers/pool');
var express = require('express');
var router = express.Router();
var encrypt = require("../../helpers/passwordEncrytion");


router.route('/userlogin').post((req,res) =>{
    let data = {
        email: req.body.email,
        password: req.body.password
    }

    let validation = true;
    Object.keys(data).forEach(value => {
        if(data[value] == undefined) {
            validation = false;
        }
    })
    if(!validation){
        res.status(400).send({message: "Invalid or insufficient body parameters"});
        res.end();
        return;
    }
  let loginCheckQuery = "SELECT * FROM USER WHERE email = ?";
    
    pool.query(loginCheckQuery, [data.email], (error, result) => {
        if(error) {
           // console.log("Error occurred.");
           console.log(error); 
           res.status(400).json({responseMessage: 'Username does not exist'});
        }
        else {
            console.log(result);
            if(result.length > 0){
                encrypt.compareHash(data.password, result[0].password, function(err, isMatch) {
                    if (isMatch && !err){
                        res.cookie('cookie',"usercookie",{maxAge: 900000, httpOnly: false, path : '/'});
                        res.cookie('cookieemail',result[0].email,{maxAge: 900000, httpOnly: false, path : '/'});
                        res.cookie('cookiename',result[0].name,{maxAge: 900000, httpOnly: false, path : '/'});
                        req.session.user = result[0].name;
                        console.log("User Login successful");
                        res.writeHead(200, {'Content-Type': 'application/json' });
                        res.end(JSON.stringify({message:"login success"}));
                    } else {
                        res.status(401).json({responseMessage: 'Authentication failed. Passwords did not match.'})
                        console.log("Authentication failed. Passwords did not match.");
                    }
                }, function (err) {
                    console.log(err);
                    res.status(401).json({responseMessage: 'Authentication failed. Passwords did not match.'})
                });  
            } else {
                console.log(loginCheckQuery)
                res.status(401).json({responseMessage: 'Invalid Credentials. Please try again'});
                console.log("Invalid Credentials");
                res.end("Unsuccessful Login");
            }
        }
    });


});

module.exports = router;