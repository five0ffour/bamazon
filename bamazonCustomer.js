var dotenv = require("dotenv").config();
const mysql = require("mysql");
const inquirer = require("inquirer");
var Table = require('cli-table');
var colors = require('colors/safe');

// Common utility Functions across applications - DRY
const myUtils = require("./utils.js");
const bamazon =  myUtils.bamazon;
const exitStore = myUtils.exitStore;
const validateNumber = myUtils.validateNumber;

/*----------------------------*/
/* Entry point to application */
/*---------------------------*/
start();

// Start() - Entry point of the app, displays and prcoesses the main menu choices 
function start() {
    var questions = [{
        type: 'rawlist',
        name: 'choice',
        message: 'What would you like to do?',
        choices: ["View Products For Sale", "Purchase an Item", "Exit Store"]
    }];
    inquirer.prompt(questions).then(answers => {
        mainMenu(answers.choice);
    });
}

// mainMenu() - logic to process the menu choice
function mainMenu(choice) {
    switch (choice) {
        case "View Products For Sale":
            displayAvailableInventory();
            break;

        case "Purchase an Item":
            promptStore();
            break;

        case "Exit Store":
        default:
            exitStore("Thank you!  Come again soon!");
            break;
    }
}

// displayAvailableInventory() - option 1 from main menu,  display store products *that are in stock!*
function displayAvailableInventory() {

    const table = new Table({
        head: ['Product #', 'Department', 'Product', 'Price', 'Qty In Stock'],
        colWidths: [15, 20, 35, 15, 15]
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
        start();
    });
}

// promptStore() - option #2 from main menu,  processes the main customer purchase chocies 
function promptStore() {
    var questions = [{
            type: 'input',
            name: 'itemNum',
            message: 'What item # would you like to buy?',
            validate: validateNumber
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'How many would you like to buy?',
            validate: validateNumber,
            when: function (answers) {
                return answers.itemNum;
            }
        }
    ];

    inquirer.prompt(questions).then(answers => {
        queryItem(answers.itemNum, answers.quantity);
    });

}


// queryItem() - looks for a specific item in the database and validates that there are enough in stock
function queryItem(itemNum, requestedQuantity) {
    var post = {
        item_id: itemNum
    };
    var query = bamazon.query("SELECT product_name, price, stock_quantity, product_sales FROM bamazon.products WHERE ?", post, function (err, res) {
        if (err) throw (err);

        if (res.length === 0) {
            console.log("\nI'm sorry,  I can't find an product with that item number\n");
            promptAnotherPurchase();
        } else if (parseInt(res[0].stock_quantity) >= parseInt(requestedQuantity)) {
            purchaseItem(requestedQuantity, res[0]);
        } else {
            console.log("\nI'm sorry,  We don't have enough of that item in stock.  We'll have more in soon!\n");
            promptAnotherPurchase();
        }
    });
}

// purchaseItem() - updates the database stock quantity and records to purchase sales totals 
function purchaseItem(requestedQuantity, item) {

    var newQty = parseInt(item.stock_quantity) - parseInt(requestedQuantity);
    var totalCost = Math.round(parseInt(requestedQuantity) * parseFloat(item.price) * 100) / 100;
    var totalSale = Math.round((parseFloat(item.product_sales) + totalCost) * 100) / 100;

    var query = bamazon.query(
        "UPDATE bamazon.products SET ?, ? WHERE ?",
        [   {
                stock_quantity: newQty
            },
            {
                product_sales: totalSale
            },
            {
                product_name: item.product_name
            }
        ],
        function (err, res) {
            if (err) throw err;
            console.log("\nSuccess! Thank you for purchasing (" + colors.green(requestedQuantity) + ") " + colors.green(item.product_name) + "(s)");
            console.log("Your account will be billed for a total of " + colors.red("$" + totalCost) + " and your order will be shipped to the address on file\n");

            promptAnotherPurchase();
        }
    );
}

// promptAnotherPurchase() - simple choice to ask customer to continue shopping by displaying the store items or exit the app
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
            exitStore("Thank you!  Come again soon! We appreciate your business!");
        }
    });
}