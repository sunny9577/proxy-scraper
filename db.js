var config = require('./config');

var connection = {};

if (config.SAVE_TO_DB) {

    var mysql = require('mysql2');

    //create connection
    var db_config = {
        host: config.DB_HOST,
        port: config.DB_PORT,
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
            console.log("Cannot establish a connection with the database." , err);
        } else {
            console.log("New connection established with the database. ")
        }
    });

}

module.exports = connection;