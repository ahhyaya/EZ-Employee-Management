const inquirer = require('inquirer');
const fs = require ('fs');


const mainQuestions = [
    {
        type: 'list',
        name: 'actions',
        message: 'What would you like to do?'
        choices: [
            'View All Departments',
            'Add Department',
            'View All Employees',
            'Add Employee',
            'Update Employee Role',
            'View All Roles',
            'Add Role'
        ]
    },
   
]