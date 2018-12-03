DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

DROP TABLE IF EXISTS products;
CREATE TABLE products (
	id INTEGER NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(255),
    department_name VARCHAR(255),
    price DECIMAL(10,2),
    stock_quantity INTEGER(10),
    product_sales DECIMAL(10,2),
    PRIMARY KEY(id)
);

INSERT INTO products (product_name, department_name,price,stock_quantity,product_sales)
VALUES ("Safety Razor","Health/Beauty",16.98,100,0);

INSERT INTO products (product_name, department_name,price,stock_quantity,product_sales)
VALUES ("Snow Remover","Automotive Parts",26.96,100,0);

INSERT INTO products (product_name, department_name,price,stock_quantity,product_sales)
VALUES ("Philips Headlight","Automotive Parts",27.99,100,0);

INSERT INTO products (product_name, department_name,price,stock_quantity,product_sales)
VALUES ("Audio XLR3M Cable","Musical Instruments",07.79,100,0);

INSERT INTO products (product_name, department_name,price,stock_quantity,product_sales)
VALUES ("BEHRINGER Audio Interface(UMC22)","Musical Instruments",59.99,100,0);

INSERT INTO products (product_name, department_name,price,stock_quantity,product_sales)
VALUES ("Precision Gyroscope Metal Balance Toy","Toys & Games",49.99,100,0);

INSERT INTO products (product_name, department_name,price,stock_quantity,product_sales)
VALUES ("Eagle Creek Packing Cubes","Clothing, Shoes & Jewelry",27.95,100,0);

INSERT INTO products (product_name, department_name,price,stock_quantity,product_sales)
VALUES ("Men's Short Sleeve Polo","Clothing, Shoes & Jewelry",25.99,100,0);

INSERT INTO products (product_name, department_name,price,stock_quantity,product_sales)
VALUES ("Aveeno Daily Facial Moisturizer","Health/Beauty",12.19,100,0);

DROP TABLE IF EXISTS departments;
CREATE TABLE departments (
	department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(255) NOT NULL,
    over_head_costs INT ,
    PRIMARY KEY(department_id)
);

INSERT INTO departments (department_name,over_head_costs)
VALUES ("Automotive Parts",40000);

INSERT INTO departments (department_name,over_head_costs)
VALUES ("Clothing, Shoes, & Jewelry",30000);

INSERT INTO departments (department_name,over_head_costs)
VALUES ("Health/Beauty",20000);

INSERT INTO departments (department_name,over_head_costs)
VALUES ("Musical Instruments",25000);

INSERT INTO departments (department_name,over_head_costs)
VALUES ("Toys & Games",50000);

