DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INTEGER NOT NULL PRIMARY KEY,
    department_id INTEGER NOT NULL,
	product_name VARCHAR(100) NOT NULL,
	price DECIMAL(10,2),
	stock_quantity INTEGER,
    product_sales DECIMAL (10,2)
);


INSERT INTO products (item_id, product_name, department_id, price, stock_quantity, product_sales)
VALUES 
(19374, "Coffee Maker", 1, 69.99, 100, 0),
(71936, "Microsoft X-Box One", 4, 499.99, 5, 0),
(99812, "Cardigan Sweater", 3, 79.99, 20, 0),
(03726, "Alarm Clock", 4, 14.95, 100, 0),
(39273, "Chamois Shirt", 2, 49.99, 25, 0),
(44572, "Golf bag", 5, 299.95, 1, 0),
(99872, "Tamagotchi", 6, 19.99, 20, 0),
(29173, "Baseball glove", 5, 89.99, 10, 0),
(67771, "Men's watch", 2, 199.99, 20, 0),
(92746, "Forza 7 Motorsports", 6, 39.99, 3, 0),
(39583, "Bathrobe, Hotel-style", 3, 100, 10, 0),
(00918, "Blue Jeans", 2, 49.99, 12, 0),
(17261, "Hiking Socks, Wool", 2, 29.99, 40, 0),
(11883, "Bamazon Echo", 4, 49.99, 100, 0),
(76443, "Samsung Television", 4, 800, 30, 0),
(44432, "Yo-Yo", 6, 4.99, 50, 0),
(90276, "Toaster", 1, 29.99, 20, 0),
(27463, "Bamazon DeepRover", 4, 249.99, 0, 0);

CREATE TABLE departments (
	department_id INTEGER NOT NULL PRIMARY KEY,
	department_name VARCHAR(100),
    overhead_costs DECIMAL(10,2)
);

INSERT INTO departments (department_id, department_name, overhead_costs) 
VALUES 
(1, "Household", 12000),
(2, "Men's Clothing", 10000),
(3, "Women's Clothing", 30000),
(4, "Electronics", 50000),
(5, "Sporting Goods", 25000),
(6, "Toys & Games", 8000);

select item_id, department_name, product_name, price, stock_quantity FROM bamazon.products
INNER JOIN departments ON products.department_id = departments.department_id
WHERE stock_quantity > 0
ORDER BY department_name, product_name ASC;

SELECT departments.department_id, department_name, product_sales, overhead_costs, SUM(product_sales) as department_sales, (SUM(product_sales) - departments.overhead_costs) AS total_profit FROM bamazon.products
INNER JOIN bamazon.departments ON products.department_id = departments.department_id
GROUP BY (department_id)
ORDER BY department_id ASC;

SELECT department_id, department_name, overhead_costs 
FROM bamazon.departments
