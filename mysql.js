const mysql = require('mysql2');

var pool = mysql.createPool({
    "user": process.env.MYSQL_USER, //process.env.MYSQL_USER
    "password": process.env.MYSQL_PASSWORD, // process.env.MYSQL_PASSWORD
    "database": process.env.MYSQL_DATABASE, // process.env.MYSQL_DATABASE
    "host": process.env.MYSQL_HOST, // process.env.MYSQL_HOST
    "port": process.env.MYSQL_PORT, // process.env.MYSQL_PORT
});

exports.pool = pool;