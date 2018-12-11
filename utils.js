var dotenv = require("dotenv").config();
const mysql = require("mysql");

var keys = require("./keys.js");

var bamazon = mysql.createConnection({
    host: keys.mysql.host,
    port: keys.mysql.port,
    user: keys.mysql.user,
    password: keys.mysql.password
});

bamazon.connect(function (err) {
    if (err) throw err;
    console.log("Connected");
});

module.exports = bamazon;