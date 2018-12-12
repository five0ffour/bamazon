//--------------------------------------------------------------------------------------------------
// bamazonSupervisor.js - An app for the Exedutive Financial View of Department Performance
//                      -  README.md captures the app functionality and will not be repeated here
//--------------------------------------------------------------------------------------------------

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

//----------------------------------------
// mainMenu() -  processes the menu choices selected by the user
//----------------------------------------
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
            exitStore("Thank you.  Have a profitable day!");
            break;
    }
}

//---------------------------------------------
// displaySalesByDepartment() - menu option 1, queries to display all departments and their finacial status 
//---------------------------------------------
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

//---------------------------------------------
// promptCreateNewDepartment() - menu option 2, prompts and updates for a new department entry to the database
//---------------------------------------------
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

// addNewDepartment() - datbase queryt to add the department to the database
function addNewDeparment(newDepartment) {
    var post = [
        newDepartment.department_id,
        newDepartment.department_name,
        newDepartment.overhead_costs
    ];
    let query = "INSERT INTO bamazon.departments (department_id, department_name, overhead_costs) " + 
                 "VALUES( ?, ? , ?)";
    bamazon.query(query, post, function (err, res) {
        if (err) {
            console.log("\nSorry! Department number " +colors.red(newDepartment.department_id) + " is already being used\n" );
            start();
        } else {
            console.log("\nSuccess!  Added " + colors.green(newDepartment.department_name) + " to the department database");
            displayAllDepartments();    
        }
    });

}

// displayDepartmentSalesTable() - pretty print the department sales table to the console
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

// displayAllDepartments() - sql query to pull all departments and their basic stats
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

// displayDepartmentTable() - pretty console print  the department information in table format
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

