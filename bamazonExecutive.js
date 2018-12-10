const dotenv = require("dotenv").config();
const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require('cli-table');
const colors = require('colors/safe');

const keys = require("./keys.js");

const bamazon = mysql.createConnection({
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
        case "View Product Sales by Department":
            console.log("View Product Sales by Department");
            break;

        case "Create New Department":
            console.log("Create New Department");
            getDepartments();
            break;

        case "Exit Store":
        default:
            exitStore();
            break;
    }
}

function exitStore() {
    bamazon.end();
}

function getDepartments() {
    let query = "SELECT department_id, department_name FROM bamazon.departments ";
    bamazon.query(query, function (err, res) {
        if (err) reject("Error with get Departments!");

        let departments = [];
        let dept = {};
        for (let i = 0;
            (i < res.length); i++) {
            dept.department_id = res[i].department_id;
            dept.department_name = res[i].department_name;
            departments.push(dept);
        }

        displayDepartmentTable(departments);
    });
}

function displayDepartmentTable(departments) {
    const table = new Table({
        head: ['Department #', 'Department'],
        colWidths: [15, 20]
    });

    for (let i = 0;
        (i < departments.length); i++) {
        let row = [];
        row.push(departments[i].department_id);
        row.push(departments[i].department_name);
        table.push(row);
    }

    console.log(table.toString());
}