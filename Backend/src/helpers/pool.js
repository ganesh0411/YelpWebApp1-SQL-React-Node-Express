var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 100,
    port: '3306',
    host: 'yelp-db.cmiunkafmzep.us-west-1.rds.amazonaws.com',
    user: 'admin',
    password: 'admin1234',
    database: 'yelpdb',
    debug: false,
    multipleStatements: true
});

module.exports = pool;