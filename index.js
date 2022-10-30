const inquirer = require('inquirer');
const mysql = require('mysql2');


// log main title

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

// // query to show all departments table
// db.query(`SELECT * FROM departments`, function (err, results) {
//     console.table(results);
// });

// // query to show all roles table
// db.query(`SELECT * FROM roles`, function (err, results) {
//     console.table(results);
// });

// // query to show all employees table
// db.query(`SELECT * FROM employees`, function (err, results) {
//     console.table(results);
// });


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
        }
    ])
        .then((answers) => {
            const { choices } = answers;
            switch (answers) {
                case 'View All Departments':
                    viewAllDepartments();
                    break;

                case 'Add Department':
                    addDepartment();
                    break;

                case 'View All Employees':
                    viewAllEmployees();
                    break;

                case 'Add Employee':
                    addEmployee();
                    break;

                case 'Update Employee Role':
                    updateEmployeeRole();
                    break;

                case 'View All Roles':
                    viewAllRoles();
                    break;

                case 'Add Role':
                    addRole();
                    break;

            }
        })
};

// add department
const addDepartment = () => {
    query = `SELECT name AS 'Departments' FROM departments`;
    db.query(query, (err, results) => {
        if (err) throw err;
        console.table('All departments: ', results);
   
    inquirer.prompt(
    [
        {
            type: 'input',
            name: 'department',
            message: 'What is the name of the department?'
        }
    ])
    .then((answers) => {
        db.query(`INSERT INTO departments TABLE(?)`, answers.department)
        chooseAction();
    })
})
};

// add role
const addRole = () => {
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

// add employee
const addEmployee = () => {
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
            message: 'Which employee\'s role do you want to update?',
            choices: []  //from employee database
        },
    ]
    addRole();
    chooseAction();
};






// function init() {
//     inquirer.createPromptModule(mainQuestions)
//         .then()
// }

chooseAction()
   