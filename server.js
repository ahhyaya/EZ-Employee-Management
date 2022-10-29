// require express and mysql2
const express = require('express');
const mysql = require('mysql2');

// setup PORT and app
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());
