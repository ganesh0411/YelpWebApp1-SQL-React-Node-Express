var pool = require('../../helpers/pool');
var express = require('express');
var router = express.Router();

router.route('/usersignup').post((req, res) => {
    let data = {
        name: req.body.name,
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
    if(data.name === "" || data.email === "" || data.password === "") {
        res.status(400).send({message: "Invalid or insufficient body parameters"});
        res.end();
    }
    let insertUser = "INSERT INTO USER (name, email, password) values (?, ?, ?)";
    pool.query(insertUser, [data.name, data.email, data.password], (error, result) => {
        if(error) {
            console.log(error);
            res.status(400).send({message: "Database error occurred or email already exists"});
        } else {
            console.log("User added to the database");
            res.status(200).send({message: "User created successfully", data: result});
            res.end();
        }
    })
})

module.exports = router;