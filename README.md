# bamazon - an e-Commerce command line store 
A CLI based e-commerce website developed with Node.js and MySQL  

## Overview  
Bamazon is an Amazon-like storefront developed in node and leveraging a MySQL backend. The app takes orders from customers and depletes stock from the store's inventory. The bonus features track product sales across the store's departments and  provides a summary of the highest-grossing departments in the store  
  
## Customer Portal capabilties
  1) __View Proudcts for Sale__ - displays a listing of product id, name, department, price and stock quantity (except those not in stock)  
  2) __Purchase an Item__ - prompts user for purchase by product number and quantity, updates the sales records  
  3) __Exit Store__ - closes sql connection and exits the prompts  

## Manager Portal capabilties
  1) __View Proudcts for Sale__ - displays a listing of product id, name, department, price and stock quantity (including those out of stock)  
  2) __View Low Inventory__ - displays a list of product id, name, department and stock quantity for all items with a quantity of 5 or less  
  3) __Add to Inventory__ - add to the stock quantity of an item based on product id  
  4) __Add New Product__ - add a new product to an existing department based on prod id, department id, product name, price and stock quantity  
  5) __Exit Store__ - closes sql connection and exits the prompts  

## Supervisor Portal capabilties
  1) __View Product Sales by Department__ - view department id, name, sales, overhead cost and total profit by department
  2) __Create New Department__ - add a new department with an id, name and overhead cost
  3) __Exit Store__ - closes sql connection and exits the prompts  

__Command line syntax:__   
Bamazon supports the follow commands and yields the corresponding content:  
  
|       | Command                    | Result                                       |
| ----- | -------------------------- | -------------------------------------------- |
| __1__ | `node bamazonCustomer.js`  | Customer Portal to view and purchase products from the online store |
| __2__ | `node bamazonManager.js`   | Manager Portal to check inventory, add stock, and add new products  |
| __3__ | `node bamazonSupervisor.js`| Supervisor Portal to check department finances and add new departments |

### Demonstration of Functionality  
  
Each of the videos provides an example of to use each of the applications:  
  
__1) Bamazon Customer Portal__     
  Video file to demontrate the Bamazon Customer application (displays inventory and a sample purchase)   
![Customer Portal](./assets/images/example-customer.gif)  
![Customer - MP4 Download](./assets/images/example-customer.mp4)  
  
__2) Bonus Feature - Bamazon Manager Portal__    
  Video file to demontrate the Department Manager application  (displays department view, low inventory, adding stock and adding new products)  
![Manager Portal](./assets/images/example-manager.gif)  
![Manager - MP4 Download](./assets/images/example-manager.mp4)  
   
__3) Bonus Feature - Bamazon Supervisor Portal__  
  Video file to demontrate the overall Supervisor's application  (displays department finances, adds a new department, shows the department view in the manager portal and adds a product to the new department, demonstrates a customer purchase of that new product.  Closes with the supervisors financial view of that new department sales )  
![Supervisor Portal](./assets/images/example-supervisor.gif)  
![Supervisor - MP4 Download](./assets/images/example-supervisor.mp4)  
  
### Developer notes  
- **.env:**  environment variables used by dotenv package holding secret keys and passwords for mySQL, not included in GIT  
- **keys.js:**  Module exporting the client keys and passwords  
- **bamazonCustomer.js:** display logic and SQL code for the Customer Portal   
- **bamazonManager.js:** display logic and SQL code for the Department Manager Portal   
- **bamazonSupervisor.js:** display logic and SQL code for the Supervisor Portal  
 
 ### How to install/run the application  
1. Download and install the latest version of Node.js following the website instructions for your platform  
   ` https://nodejs.org/en/download/`   
2. Clone this repository into a clean diretory  
   `$ git clone <repository url>`  
3. Bring down the latest package dependencies using node package manager  
   `npm install`  
4. Download and install the latest version of mySQL  
   ` https://www.mysql.com/downloads/`   
5. This package requires a database configuration and password for mySQL. The parameters are captured in a .env file which must be supplied to the root directory of the project.  Use the installation of mySQLWorkbench to configure the installation and then use your favorite IDE to enter the following keys-values pairs to the .env file with your id and passowrd:  
  
| File        | Parameters needed for mySQL                                          |
| ----------- | -------------------------------------------------------------------- |
| .env        | DB_HOST=__your mySQL host name__   (usually localhost)               | 
|             | DB_USER=__your mySQL account__     (usually root)                    |
|             | DB_PWD=__your mySQL password__                                       |
|             | DB_PORT=__your mySQL port__        (usually 3306)                    |
  
__Note:__  the .gitignore file is coded to prevent your config and password from being shared in your git repository pubically    

1. Execute the schemas.sql from the scripts directory in MySQLWorkbench to create the tables and populate some sample data  
2. Run a command manuallly from the command line  
   `node bamazonCustomer.js`  
  
### Technology Used  
    
| Package/Interface | Version     | Description                                                              |
| ----------------- | ----------- | ------------------------------------------------------------------------ |
| Node.js           | __11.1.0__  | Main javascript engine for this application                              |
| npm mySQL         | __2.16.0__  | mySQL relational database management system & workbench                  |
| npm Inquirer      | __6.2.0__   | Library to handle the command line prompting                             |
| npm dotenv        | __6.2.0__   | Utility package to hide the secret keys in a .env file and away from git |
| npm cli-table     | __0.3.1__   | Command line interface utility                                           |
| npm color         | __1.3.2__   | String package to manage ascii text color                                |
| mySQL Workbench   | __8.0.13__  | mySQL IDE to run schema.sql database configuration file                  | 

## Authors  
Michael Galarneau - Initial work - five0ffour  
December, 2018  

# Acknowledgements  
Cli-tables - ascii text table formatting tool, provides UI sizzle  
Colors - ascii text color tool, more UI sizzle  
DotEnv - environment variables management tool  
Inquirer - command line interface tool  
mySql - the ubiquitous relational database management system  
