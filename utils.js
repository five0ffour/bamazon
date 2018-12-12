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

function validateNumber(num)
{
    let reg = /^[0-9]+$/;
    if (!reg.test(num)) {
    //    console.log("\nSorry! We can only accept a whole number here.");
        return false;
    }

    reg.lastIndex = 0;
    return true;
}

function validatePrice(price) {
       
    let reg = /^\d{0,8}(\.\d{1,4})?$/;
    if (!reg.test(price)) {
  //      console.log("\nSorry! We can only accept a decimal number here.");
        return false;
    }

    reg.lastIndex = 0;
    return true;
}

function validateText (text) {

    // Regex expression parsing,  accept alphanumerics only, upper or lower case
    // let reg = /^[a-zA-Z]*$/;
    let reg = /^[a-zA-Z\d\-_\s]+$/i; 
    if (!reg.test(text)) {
//        console.log("Sorry! We can only accept a alphanumerics here.");
        return false;
    }

    reg.lastIndex = 0;
    return true;
}

module.exports = {
    bamazon : bamazon,
    validateNumber : validateNumber,
    validateNumber : validatePrice,
    validateText   : validateText
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

// unitTest();