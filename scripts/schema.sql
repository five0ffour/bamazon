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
(19374, "Coffee Maker", 1, 69.99, 100, 1600),
(71936, "Microsoft X-Box One", 4, 499.99, 5, 1000),
(99812, "Cardigan Sweater", 3, 79.99, 20, 400),
(03726, "Alarm Clock", 4, 14.95, 100, 500),
(39273, "Chamois Shirt", 2, 49.99, 25, 900),
(44572, "Golf bag", 5, 299.95, 1, 390),
(99872, "Tamagotchi", 6, 19.99, 20, 200),
(29173, "Baseball glove", 5, 89.99, 10, 40),
(67771, "Men's watch", 2, 199.99, 20, 200),
(92746, "Forza 7 Motorsports", 6, 39.99, 3, 300),
(39583, "Bathrobe, Hotel-style", 3, 100, 10, 390),
(00918, "Blue Jeans", 2, 49.99, 12, 690),
(17261, "Hiking Socks, Wool", 2, 29.99, 40, 980),
(11883, "Bamazon Echo", 4, 49.99, 100, 1400),
(76443, "Samsung Television", 4, 800, 30, 3000),
(44432, "Yo-Yo", 6, 4.99, 50, 540),
(90276, "Toaster", 1, 29.99, 20, 100),
(27463, "Bamazon DeepRover", 4, 249.99, 0, 0);

CREATE TABLE departments (
	department_id INTEGER NOT NULL PRIMARY KEY,
	department_name VARCHAR(100),
    overhead_costs DECIMAL(10,2)
);

INSERT INTO departments (department_id, department_name, overhead_costs) 
VALUES 
(1, "Household", 1200),
(2, "Men's Clothing", 1000),
(3, "Women's Clothing", 3000),
(4, "Electronics", 5000),
(5, "Sporting Goods", 2500),
(6, "Toys & Games", 800);

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
ORDER BY department_id ASC
