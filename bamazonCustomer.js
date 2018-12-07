var dotenv = require("dotenv").config();
const mysql = require("mysql");
const inquirer = require("inquirer");
// const colors = require("colors/safe");
var Table = require('cli-table');

var keys = require("./keys.js");

var bamazon = mysql.createConnection({
    host: keys.mysql.host,
    port: 3306,
    user: keys.mysql.user,
    password: keys.mysql.password
});

bamazon.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

function main() {

 displayInventory();
    // promptStore();
}

function displayInventory() {

    const table = new Table({
        head: ['Product', 'Department', 'Price', 'Qty In Stock'],
        colWidths: [30, 20, 15, 15]
    });

    var query = bamazon.query("SELECT * FROM bamazon.products ORDER BY department_name, product_name ASC", function (err, res) {
        if (err) throw (err);

        for (let i = 0; (i < res.length); i++) {
            var row = [];
            row.push(res[i].product_name);
            row.push( res[i].department_name);
            row.push( res[i].price);
            row.push( res[i].stock_quantity);
            table.push(row);
        }

        console.log(table.toString());
        
        bamazon.end();
    });
 
}

function promptStore() {

}

/*****************/
/* Start the app */
/*****************/

main();