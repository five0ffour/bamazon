DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
	product_name VARCHAR(100) NOT NULL,
	department_name VARCHAR(100),
	price DECIMAL(10,2),
	stock_quantity INTEGER
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
("Bathrobe, pink", "Women's Clothing", 100, 10),
("Coffee Maker", "Household", 69.99, 100),
("Microsoft X-box One", "Electronics", 499.99, 5),
("Cardigan Sweater", "Women's Clothing", 79.99, 20),
("Alarm Clock", "Electronics", 14.95, 100),
("Chamois Shirt", "Men's Clothing", 49.99, 25),
("Golf bag", "Sporting Goods", 299.95, 1),
("Tamagotchi", "Toys", 19.99, 20),
("Baseball glove", "Sporting Goods", 89.99, 10),
("Men's watch", "Men's Clothing", 199.99, 20),
("Forza 7 Motorsports DVD", "Electronics", 39.99, 3),
("Blue Jeans", "Men's Clothing", 49.99, 12),
("Merino Wool Socks", "Men's CLothing", 29.99, 40),
("Bamazon Echo", "Electronics", 49.99, 100),
("Samsung Television", "Electronics", 800, 30),
("Yo-Yo", "Toys", 4.99, 50),
("Toaster", "Household", 29.99, 20);


select * from bamazon.products
ORDER BY department_name, product_name ASC;
