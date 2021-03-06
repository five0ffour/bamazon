//--------------------------------------------------------------------------------------------------
// bamazonManagerjs - An app for the Department Manager's Operational view of inventory management
//                  -  README.md captures the app functionality and will not be repeated here
//--------------------------------------------------------------------------------------------------
const inquirer = require("inquirer");
const Table = require('cli-table');
const colors = require('colors/safe');

const myUtils = require("./utils.js");
const bamazon = myUtils.bamazon;
const exitStore = myUtils.exitStore;
const validateNumber = myUtils.validateNumber;
const validatePrice = myUtils.validatePrice;
const validateText = myUtils.validateText;

/*----------------------------*/
/* Entry point to application */
/*----------------------------*/
start();

// start() - displays the main menu and gets the user's choice
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

//----------------------------------------
// mainMenu() - processes the menu choices selected by the user
//----------------------------------------
function mainMenu(choice) {
    switch (choice) {
        case "View Products for Sale":
            displayAllInventory();
            break;

        case "View Low Inventory":
            displayLowInventory();
            break;

        case "Add to Inventory":
            promptToAddNewStock();
            break;

        case "Add New Product":
            promptToAddNewProduct();
            break;

        case "Exit Store":
        default:
            console.log("\nThank you!  Have a great sales day!");
            exitStore();
            break;
    }
}

//----------------------------------------
// displayAllInventory() -  menu option 1, query tp display *all* inventory (that is assigned to a department)
//----------------------------------------
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

//----------------------------------------
// displayLowInentory() - menu option 2, query to display any inventory that is equal to or below 5 items in stock 
//----------------------------------------
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

// dispalyInentoryTable() - console write a table displaying the inventory in a pretty formatted output
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

//----------------------------------------
// promptToAddNewStock() - menu option 3, prompts to ask the user what item and amount to add to stock
//----------------------------------------
function promptToAddNewStock() {
    var questions = [{
            type: 'input',
            name: 'itemNum',
            message: 'Which item # would you stock up?',
            validate: validateNumber,
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'How many units will you be adding?',
            validate: validateNumber,
            when: function (answers) {
                return answers.itemNum;
            }
        }
    ];

    inquirer.prompt(questions).then(answers => {
        addItemsToInventory(parseInt(answers.itemNum), answers.quantity);
    });
}

// addItemsToInventory() - two part query,  looks for the item to add to stock and then calls query to update the stock 
function addItemsToInventory(itemNum, newItems) {
    let post = {
        "item_id": itemNum
    };
    let query = "SELECT stock_quantity FROM bamazon.products " +
        "WHERE ? ";
    bamazon.query(query, post, function (err, res) {
        if (err) throw (err);

        if (res.length === 0) {
            console.log("\nI'm sorry,  I can't find a product with that item number\n");
            displayAllInventory();
        } else {
            var newQty = parseInt(newItems) + parseInt(res[0].stock_quantity);
            postNewItems(itemNum, newQty);
        }
    });
}

// postNewItems() - query to update the stock quantity of an existing product
function postNewItems(itemNum, newQty) {
    let query = "UPDATE bamazon.products SET stock_quantity=? WHERE item_id=? ";
    bamazon.query(query, [newQty, itemNum], function (err, res) {
        if (err) throw (err);

        console.log("\n Success!  New item(s) added to the inventory\n");
        displayAllInventory();
    });
}


//----------------------------------------
// promptToAddNewProduct() - menu option 4,  walk the user through the prompts to add a brand new item to inventory
//----------------------------------------
function promptToAddNewProduct() {

    var questions = [{
            type: 'input',
            name: 'itemNum',
            message: 'What is the item number for the new product being added?',
            validate: validateNumber
        },
        {
            type: 'input',
            name: 'itemName',
            message: 'What is the name of the product?',
            validate: validateText,
            when: function (answers) {
                return answers.itemNum;
            }
        },
        {
            type: 'input',
            name: 'departmentNum',
            message: 'Which department (number) would you like to add it to?',
            validate: validateNumber,
            when: function (answers) {
                return answers.itemNum;
            }
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'How many units will you be adding?',
            validate: validateNumber,
            when: function (answers) {
                return answers.departmentNum;
            }
        },
        {
            type: 'input',
            name: 'price',
            message: 'What price will it be listed at?',
            validate: validatePrice,
            when: function (answers) {
                return answers.quantity;
            }
        }
    ];

    inquirer.prompt(questions).then(answers => {
        addNewProduct(answers);
    });
}

// addNewProduct() - query to insert a new product into the products table
function addNewProduct(answers) {

    let post = [
        answers.itemNum,
        answers.itemName,
        answers.departmentNum,
        answers.price,
        answers.quantity
    ];
    let query = "INSERT INTO bamazon.products (item_id, product_name, department_id, price, stock_quantity, product_sales)" +
        "VALUES (?, ?, ?, ?, ?, 0)";


    bamazon.query(query, post, function (err, res) {
        if (err) {
            console.log("\nSorry! The product id " + colors.red(answers.itemNum) + " is already taken.\n");
            start();
        } else {
            console.log("\nSuccess! Your product(s) " + colors.green(answers.itemName) + " were succssfully added to the inventory\n");
            displayAllInventory();
        }
    });
}