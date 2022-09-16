var mysql = require('mysql');
require('dotenv').config();

var pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE_NAME,
    connectionLimit: 10,
    supportBigNumbers: true
});

pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log('<><><> mysql database is connected <><>]]]');
});

module.exports = pool;
