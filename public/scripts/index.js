const inquirer = require('inquirer');
const fs = require ('fs');
const { default: Choices } = require('inquirer/lib/objects/choices');

const mainQuestions = [
    {
        type: 'list',
        name: 'actions',
        message: 'What would you like to do?',
        choices: [
            'View All Departments',
            'Add Department',
            'View All Employees',
            'Add Employee',
            'Update Employee Role',
            'View All Roles',
            'Add Role'
        ]
        // after: show related info
    },
    {
        type: 'input',
        name: 'department',
        message: 'What is the name of the department?'
    },
    
   
]


function init() {
    inquirer.createPromptModule(mainQuestions)
        .then()
}