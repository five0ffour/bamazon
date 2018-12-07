DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INTEGER NOT NULL PRIMARY KEY,
	product_name VARCHAR(100) NOT NULL,
	department_name VARCHAR(100),
	price DECIMAL(10,2),
	stock_quantity INTEGER
);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES 
(39583, "Bathrobe, pink", "Women's Clothing", 100, 10),
(19374, "Coffee Maker", "Household", 69.99, 100),
(71936, "Microsoft X-Box One", "Electronics", 499.99, 5),
(99812, "Cardigan Sweater", "Women's Clothing", 79.99, 20),
(03726, "Alarm Clock", "Electronics", 14.95, 100),
(39273, "Chamois Shirt", "Men's Clothing", 49.99, 25),
(44572, "Golf bag", "Sporting Goods", 299.95, 1),
(99872, "Tamagotchi", "Toys", 19.99, 20),
(29173, "Baseball glove", "Sporting Goods", 89.99, 10),
(67771, "Men's watch", "Men's Clothing", 199.99, 20),
(92746, "Forza 7 Motorsports", "Electronics", 39.99, 3),
(00918, "Blue Jeans", "Men's Clothing", 49.99, 12),
(17261, "Merino Wool Socks", "Men's CLothing", 29.99, 40),
(11883, "Bamazon Echo", "Electronics", 49.99, 100),
(76443, "Samsung Television", "Electronics", 800, 30),
(44432, "Yo-Yo", "Toys", 4.99, 50),
(90276, "Toaster", "Household", 29.99, 20);


select * from bamazon.products
ORDER BY department_name, product_name ASC;
