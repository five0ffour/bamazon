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

/*---------------------------*/
/* Entry point to application */
/*---------------------------*/
bamazon.connect(function (err) {
    if (err) throw err;
    start();
});

function start() {
    displayAvailableInventory();
}

function exitStore() {
    bamazon.end();
}

function displayAvailableInventory() {

    const table = new Table({
        head: ['Product #', 'Department', 'Product', 'Price', 'Qty In Stock'],
        colWidths: [15, 20, 30, 15, 15]
    });
    
    var query = "SELECT item_id, department_name, product_name, price, stock_quantity FROM bamazon.products " + 
                "INNER JOIN bamazon.departments ON products.department_id = departments.department_id " +
                "WHERE stock_quantity > 0 " + 
                "ORDER BY department_name, product_name ASC";
    bamazon.query(query, function (err, res) {
        if (err) throw (err);

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
        promptStore();
    });
}

function promptStore() {
    var questions = [{
            type: 'input',
            name: 'itemNum',
            message: 'What item # would you like to buy?'
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'How many would you like to buy?',
            when: function (answers) {
                return answers.itemNum;
            }
        }
    ];

    inquirer.prompt(questions).then(answers => {
        queryItem(answers.itemNum, answers.quantity);
    });

}

function queryItem(itemNum, requestedQuantity) {
    var post = {
        item_id: itemNum
    };
    var query = bamazon.query("SELECT product_name, price, stock_quantity FROM bamazon.products WHERE ?", post, function (err, res) {
        if (err) throw err;

        if (parseInt(res[0].stock_quantity) >= parseInt(requestedQuantity)) {
            purchaseItem(requestedQuantity, res[0]);
        } else {
            console.log("\nI'm sorry,  we don't have enough of that item in stock.  We'll have more in soon!");
            promptAnotherPurchase();
        }

    });
}

function purchaseItem(requestedQuantity, item) {

    var newQty = parseInt(item.stock_quantity) - parseInt(requestedQuantity);
    var query = bamazon.query(
        "UPDATE bamazon.products SET ? WHERE ?",
        [{
                stock_quantity: newQty
            },
            {
                product_name: item.product_name
            }
        ],
        function (err, res) {
            if (err) throw err;
            var totalCost = Math.round(parseInt(requestedQuantity) * parseFloat(item.price) * 100) / 100;
            console.log("\nSuccess! Thank you for purchasing (" + colors.green(requestedQuantity) + ") " + colors.green(item.product_name) + "(s)");
            console.log("Your account will be billed for a total of " + colors.red("$" + totalCost) + " and your order will be shipped to the address on file\n");

            promptAnotherPurchase();
        }
    );
}

function promptAnotherPurchase() {
    var questions = [{
        type: 'confirm',
        name: 'choice',
        message: 'Would you like to continue shopping?'
    }];
    inquirer.prompt(questions).then(answers => {
        if (answers.choice) {
            displayAvailableInventory();
        } else {
            console.log("\nThank you!  Come again soon! We appreciate your business!");
            exitStore();
        }
    });
}