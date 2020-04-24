var config = require('./config');

var connection = {};

if (config.SAVE_TO_DB) {

    var mysql = require('mysql');

    //create connection
    var db_config = {
        host: config.DB_HOST,
        user: config.DB_USER,
        password: config.DB_PASS,
        database: config.DB_NAME,
        multipleStatements: true,
        connectionLimit: 50
    };

    connection = mysql.createPool(db_config);

    //- Establish a new connection
    connection.getConnection(function(err) {
        if (err) {
            console.log("Cannot establish a connection with the database. Exiting....");
        } else {
            console.log("New connection established with the database. ")
        }
    });

}

module.exports = connection;