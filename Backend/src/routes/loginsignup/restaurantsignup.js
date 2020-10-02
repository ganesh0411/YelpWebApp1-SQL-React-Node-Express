var pool = require('../../helpers/pool');
var express = require('express');
var router = express.Router();

router.route('/restaurantsignup').post((req,res) => {

    let data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        location: req.body.location
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
    if(data.name === "" || data.email === "" || data.password === "" || data.location === "") {
        res.status(400).send({message: "Invalid or insufficient body parameters"});
        res.end();
    }
    let insertRest = "INSERT INTO RESTAURANT (name, email, password,location) values (?, ?, ?, ?)";
    pool.query(insertRest, [data.name, data.email, data.password,data.location], (error, result) => {
        if(error) {
            console.log(error);
            res.status(400).send({message: "Database error occurred or email already exists"});
        } else {
            console.log("Restaurant added to the database");
            res.status(200).send({message: "Restaurant registered successfully", data: result});
            res.end();
        }
    })
})

module.exports = router;