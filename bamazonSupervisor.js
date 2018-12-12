const dotenv = require("dotenv").config();
const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require('cli-table');
const colors = require('colors/safe');

const myUtils = require("./utils.js");
const bamazon =  myUtils.bamazon;
const exitStore = myUtils.exitStore;
const validateNumber = myUtils.validateNumber;
const validateText = myUtils.validateText;

/*----------------------------*/
/* Entry point to application */
/*----------------------------*/
start();

function start() {
    var questions = [{
        type: 'rawlist',
        name: 'choice',
        message: 'What would you like to do?',
        choices: ["View Product Sales by Department", "Create New Department", "Exit Store"]
    }];
    inquirer.prompt(questions).then(answers => {
        mainMenu(answers.choice);
    });
}

function mainMenu(choice) {
    switch (choice) {
        case "View Product Sales by Department":
            displaySalesByDepartment();
            break;

        case "Create New Department":
            promptCreateNewDepartment();
            break;

        case "Exit Store":
        default:
            exitStore();
            break;
    }
}

function displaySalesByDepartment() {

    var query = "SELECT departments.department_id, department_name, overhead_costs, " +
                "SUM(product_sales) as product_sales, (SUM(product_sales) - departments.overhead_costs) AS total_profit " + 
                "FROM bamazon.products " + 
                "INNER JOIN bamazon.departments ON products.department_id = departments.department_id " +
                "GROUP BY (department_id) " + 
                "ORDER BY department_id ASC ";
    
    bamazon.query(query, function (err, res) {
        if (err) throw (err);

        displayDepartmentSalesTable(res);
        start();
    });
}

function promptCreateNewDepartment() {
    var questions = [{
        type: 'input',
        name: 'departmentNum',
        message: 'What is the new department number?',
        validate : validateNumber
    },
    {
        type: 'input',
        name: 'departmentName',
        message: 'What is the new department name?',
        validate: validateText
    },
    {
        type: 'input',
        name: 'overheadCosts',
        message: 'What is the department overhead costs?',
        validate : validateNumber
    },
    ];
    inquirer.prompt(questions).then(answers => {
        let dept = {}
        dept.department_id = answers.departmentNum;
        dept.department_name = answers.departmentName,
        dept.overhead_costs = answers.overheadCosts;
        addNewDeparment(dept);
    });
}

function addNewDeparment(newDepartment) {
    var post = [
        newDepartment.department_id,
        newDepartment.department_name,
        newDepartment.overhead_costs
    ];
    let query = "INSERT INTO bamazon.departments (department_id, department_name, overhead_costs) " + 
                 "VALUES( ?, ? , ?)";
    bamazon.query(query, post, function (err, res) {
        if (err) throw(err);

        console.log("\nSuccess!  Added " + colors.green(newDepartment.department_name) + " to the department database");
        displayAllDepartments();
    });

}

function displayDepartmentSalesTable(res) {

    const table = new Table({
        head: ['Department #', 'Department Name', 'Product Sales', 'Overhead Cost', 'Total Profit'],
        colWidths: [15, 20, 15, 15, 15]
    });

    for (let i = 0; (i < res.length); i++) {

        let row = [];
        row.push(res[i].department_id);
        row.push(res[i].department_name);
        row.push(res[i].product_sales);
        row.push(res[i].overhead_costs);
        row.push(res[i].total_profit);

        table.push(row);
    }

    console.log(table.toString());
}


function displayAllDepartments() {

    var query = "SELECT department_id, department_name, overhead_costs " +
                "FROM bamazon.departments " +
                "ORDER BY department_id ASC"
    bamazon.query(query, function (err, res) {
        if (err) throw (err);

        displayDepartmentTable(res);
        start();
    });
}

function displayDepartmentTable(res) {

    const table = new Table({
        head: ['Department #', 'Department Name', 'Overhead Cost'],
        colWidths: [15, 20, 15]
    });

    for (let i = 0; (i < res.length); i++) {

        let row = [];
        row.push(res[i].department_id);
        row.push(res[i].department_name);
        row.push(res[i].overhead_costs);
        table.push(row);
    }

    console.log(table.toString());
}

