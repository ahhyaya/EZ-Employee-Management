const inquirer = require('inquirer');
const fs = require('fs');
const { default: Choices } = require('inquirer/lib/objects/choices');

// log main title

const chooseAction = () => {
    console.log(
        `
=======================================
    EZ-Employee-Management
---------------------------------------
     `);
    // main questions array
    return inquirer.prompt([
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
        }
    ])
};

// setup department
const setDepartment = () => {
    [
        {
            type: 'input',
            name: 'department',
            message: 'What is the name of the department?'
        },
    ]
    chooseAction();
};

// setup role
const setRole = () => {
    [
        {
            type: 'input',
            name: 'role',
            message: 'What is the name of the role?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the role?'
        },
        {
            type: 'list',
            name: 'roleDepartment',
            message: 'Which department does the role belong to?',
            choices: [
                'Engineering',
                'Finance',
                'Legal',
                'Sales',
                'Service'
            ]
        },
    ]
    chooseAction();
};

// setup employee
const setEmployee = () => {
    [
        {
            type: 'input',
            name: 'firstName',
            message: 'What is employee\'s first name?',
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is employee\'s last name?',
        },
        {
            type: 'list',
            name: 'employeeRole',
            message: 'What is employee\'s role?',
            choices: [
                'Sales Lead',
                'Salesperson',
                'Lead Engineer',
                'Software Engineer',
                'Account Manager',
                'Accountant',
                'Legal Team Lead',
                'Lawyer',
                'Customer Service'
            ]
        },
        {
            type: 'list',
            name: 'employeesManager',
            message: 'Who is employee\'s Manager?',
            choices: [
                'None',
                'John Doe',
                'Mike Chan',
                'Ashley Rodriguez',
                'Software Engineer',
                'Kevin Tupik',
                'Kunal Singh',
                'Malia Brown',
            ]
        },
    ]
    chooseAction();
}

const updateEmployeeRole = () => {
    [
        {
            type: 'list',
            name: 'employees',
            message: 'Which employee\'s role do you want to update?'
            choices: []  //from employee database
        },
    ]
    setRole();
    chooseAction();
};






function init() {
    inquirer.createPromptModule(mainQuestions)
        .then()
}