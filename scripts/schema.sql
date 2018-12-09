DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INTEGER NOT NULL PRIMARY KEY,
    department_id INTEGER NOT NULL,
	product_name VARCHAR(100) NOT NULL,
	price DECIMAL(10,2),
	stock_quantity INTEGER
);


INSERT INTO products (item_id, product_name, department_id, price, stock_quantity)
VALUES 
(19374, "Coffee Maker", 1, 69.99, 100),
(71936, "Microsoft X-Box One", 4, 499.99, 5),
(99812, "Cardigan Sweater", 3, 79.99, 20),
(03726, "Alarm Clock", 4, 14.95, 100),
(39273, "Chamois Shirt", 2, 49.99, 25),
(44572, "Golf bag", 5, 299.95, 1),
(99872, "Tamagotchi", 6, 19.99, 20),
(29173, "Baseball glove", 5, 89.99, 10),
(67771, "Men's watch", 2, 199.99, 20),
(92746, "Forza 7 Motorsports", 6, 39.99, 3),
(39583, "Hotel-style Bathrobe", 3, 100, 10),
(00918, "Blue Jeans", 2, 49.99, 12),
(17261, "Wool Hiking Socks", 2, 29.99, 40),
(11883, "Bamazon Echo", 4, 49.99, 100),
(76443, "Samsung Television", 4, 800, 30),
(44432, "Yo-Yo", 6, 4.99, 50),
(90276, "Toaster", 1, 29.99, 20),
(27463, "Bamazon DeepRover", 4, 249.99, 0);

CREATE TABLE departments (
	department_id INTEGER NOT NULL PRIMARY KEY,
	department_name VARCHAR(100),
    overhead_cost DECIMAL(10,2)
);

INSERT INTO departments (department_id, department_name) 
VALUES 
(1, "Household"),
(2, "Men's Clothing"),
(3, "Women's Clothing"),
(4, "Electronics"),
(5, "Sporting Goods"),
(6, "Toys & Games");

select item_id, department_name, product_name, price, stock_quantity FROM bamazon.products
INNER JOIN departments ON products.department_id = departments.department_id
WHERE stock_quantity > 0
ORDER BY department_name, product_name ASC;

UPDATE bamazon.products
SET stock_quantity = 14
WHERE item_id = 39583