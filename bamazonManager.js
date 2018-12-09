var dotenv = require("dotenv").config();
const mysql = require("mysql");
const inquirer = require("inquirer");
var Table = require('cli-table');
var colors = require('colors/safe');

var keys = require("./keys.js");

var bamazon = mysql.createConnection({
    host: keys.mysql.host,
    port: keys.mysql.port,
    user: keys.mysql.user,
    password: keys.mysql.password
});

bamazon.connect(function (err) {
    if (err) throw err;
    start();
});

function start() {
    var questions = [{
        type: 'rawlist',
        name: 'choice',
        message: 'What would you like to do?',
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit Store"]
    }];
    inquirer.prompt(questions).then(answers => {
        mainMenu(answers.choice);
    });

}

function mainMenu(choice) {
    switch (choice) {
        case "View Products for Sale":
            displayAllInventory();
            break;

        case "View Low Inventory":
            displayLowInventory();
            break;

        case "Add to Inventory":
            addToInventory();
            break;

        case "Add New Product":
            addNewProduct();
            break;

        case "Exit Store":
        default:
            console.log("\nThank you!  Come again soon! We appreciate your business!");
            exitStore();
            break;
    }
}

function exitStore() {
    bamazon.end();
}

function displayAllInventory() {

    var query = "SELECT item_id, department_name, product_name, price, stock_quantity FROM bamazon.products " +
        "INNER JOIN bamazon.departments ON products.department_id = departments.department_id " +
        "ORDER BY department_name, product_name ASC";
    bamazon.query(query, function (err, res) {
        if (err) throw (err);

        displayInventoryTable(res);
        start();
    });
}

function displayLowInventory() {

    var query = "SELECT item_id, department_name, product_name, price, stock_quantity FROM bamazon.products " +
        "INNER JOIN bamazon.departments ON products.department_id = departments.department_id " +
        "WHERE stock_quantity <= 5 " +
        "ORDER BY department_name, product_name ASC";
    bamazon.query(query, function (err, res) {
        if (err) throw (err);

        displayInventoryTable(res);
        start();
    });
}

function displayInventoryTable(res) {

    const table = new Table({
        head: ['Product #', 'Department', 'Product', 'Price', 'Qty In Stock'],
        colWidths: [15, 20, 30, 15, 15]
    });

    for (let i = 0;
        (i < res.length); i++) {
        var row = [];
        row.push(res[i].item_id);
        row.push(res[i].department_name);
        row.push(res[i].product_name);
        row.push(res[i].price);
        row.push(res[i].stock_quantity);
        table.push(row);
    }

    console.log(table.toString());
}

function addToInventory() {
    console.log("\nadd to inventory\n");
    start();
}

function addNewProduct() {
    console.log("\nadd new product\n");
    start();
}