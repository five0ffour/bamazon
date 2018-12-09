//--------------------------------------------
// keys.js - secret keys for API calls
//         - environment variables are set via the require("dotenv").config() call
//--------------------------------------------

exports.mysql = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PWD
};