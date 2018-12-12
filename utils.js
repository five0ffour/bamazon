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
});

// exit() - closes the database connection and display optional message
function exitStore(msg) {
    if (msg) {
        console.log("\n" + msg + "\n");
    }
    bamazon.end();
}

function validateNumber(num)
{
    let reg = /^[0-9]+$/;
    if (!reg.test(num)) {
        return false;
    }

    reg.lastIndex = 0;
    return true;
}

function validatePrice(price) {
       
    let reg = /^\d{0,8}(\.\d{1,4})?$/;
    if (!reg.test(price)) {
        return false;
    }

    reg.lastIndex = 0;
    return true;
}

function validateText (text) {

    // Regex expression parsing,  accept alphanumerics only, upper or lower case, lines and spaces
    let reg = /^[a-zA-Z\d\-_\s]+$/i; 
    if (!reg.test(text)) {
        return false;
    }

    reg.lastIndex = 0;
    return true;
}


function unitTest() {
    // These should pass
    console.log(validateNumber("14")       ? "success number - correct" : "fail number - wrong");
    console.log(validatePrice("14.99")     ? "success price - correct"  : "fail price - wrong");
    console.log(validateText("Mike G 123") ? "success text - correct"   : "fail text - wrong");

    // These should fail
    console.log(validateNumber("14x")      ? "success number - wrong"   : "fail number - correct");
    console.log(validatePrice("14.99x")    ? "success price - wrong"    : "fail price - correct");
    console.log(validateText("Mike G %")   ? "success text - wrong"     : "fail text - correct");
}

module.exports = {
    bamazon : bamazon,
    exitStore : exitStore,
    validateNumber : validateNumber,
    validateNumber : validatePrice,
    validateText   : validateText
}

/* UNIT TEST to valdiate string logic - uncomment and run this module to test */
// unitTest();