// require express and mysql2
const express = require('express');
const mysql = require('mysql2');
const init = require('./public/scripts/index')
// setup PORT and app
// const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());


// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'organization_db'
    },
    console.log(`Successfully connected to the organization_db database!`)
);

// query to show all departments table
db.query(`SELECT * FROM departments`, function (err, results) {
    console.table(results);
});

// query to show all roles table
db.query(`SELECT * FROM roles`, function (err, results) {
    console.table(results);
});

// query to show all employees table
db.query(`SELECT * FROM employees`, function (err, results) {
    console.table(results);
});

// app.listen(PORT, () => {
//     console.log(`EZ-EMPLOYEE-MANAGEMENT running on port ${PORT}`);
// });