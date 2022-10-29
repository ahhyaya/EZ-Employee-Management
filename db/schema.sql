DROP DATABASE IF EXISTS organization_db;
CREATE DATABASE organization_db;

USE organization_db;

CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMINT PRIMARY KEY,
    name VARCHAR(30),
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMINT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
);

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMINT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NOT NULL,
    manager_id INT,
);

