const inquirer = require('inquirer');
const mysql = require('mysql2');
require('console.table');

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

db.connect(() => {
    chooseAction();
})


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
                'View All Employees by Manager',
                'Add Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'View All Roles',
                'Add Role',
                'Quit'
            ]
        }
    ])
        .then((answers) => {
            const { actions } = answers;
            switch (actions) {
                case 'View All Departments':
                    viewAllDepartments();
                    break;

                case 'Add Department':
                    addDepartment();
                    break;

                case 'View All Employees':
                    viewAllEmployees();
                    break;

                case 'View All Employees by Manager':
                    viewAllEmployeesByManager();
                    break;

                case 'Add Employee':
                    addEmployee();
                    break;

                case 'Update Employee Role':
                    updateEmployeeRole();
                    break;

                case 'Update Employee Manager':
                    updateEmployeeManager();
                    break;

                case 'View All Roles':
                    viewAllRoles();
                    break;

                case 'Add Role':
                    addRole();
                    break;

                case 'Quit':
                    db.end();
                    console.log(`\n 
                    ***************************************************
                    *                                                 *
                    *  Successfully Exit From EZ-Employee-Management. *
                    *                                                 *
                    *               Thanks for using!                 *
                    *                                                 *
                    ***************************************************
                    \n`)
                    return;
                default:
                    break;
            }
        })
};

// view all departments 
const viewAllDepartments = () => {
    db.query(`SELECT * FROM departments`, (err, results) => {
        console.table(results);
        chooseAction();
    })
}

// view all roles
const viewAllRoles = () => {
    db.query(`SELECT * FROM roles`, (err, results) => {
        console.table(results);
        chooseAction();
    })
}




// add department
const addDepartment = () => {

    inquirer.prompt(
        [
            {
                type: 'input',
                name: 'department',
                message: 'What is the name of the department?'
            }
        ])
        .then((answers) => {
            db.query(`INSERT INTO departments (name) VALUES(?)`, answers.department, (err, results) => {
                viewAllDepartments();
            })
        })
};

// add role
const addRole = () => {
    db.query(`SELECT * FROM departments;`, (err, res) => {
        if (err) throw err;
        let department = res.map(departments => (
            {
                name: departments.name,
                value: departments.id
            }
        ))
        inquirer.prompt(
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
                    type: 'rawlist',
                    name: 'roleDepartment',
                    message: 'Which department does the role belong to?',
                    choices: department
                },
            ])
            .then((answers) => {
                db.query(`INSERT INTO roles (title, salary, department_id) VALUES(?,?,?)`, [answers.role, answers.salary, answers.roleDepartment], (err, results) => {
                    viewAllRoles();
                })
            });
    })
};

// view all employees
const viewAllEmployees = () => {
    db.query(`SELECT * FROM employees`, (err, results) => {
        console.table(results);
        chooseAction();
    })
}

// allows users to view employees by manager
const viewAllEmployeesByManager = () => {
    db.query("SELECT * FROM employees WHERE manager_id IS NULL;", (err, results) => {
        inquirer.prompt({
            type: "list",
            message: "Please select a manager",
            name: "managerId",
            choices: results.map((res) => {
                return {
                    name: res.first_name + " " + res.last_name,
                    value: res.id
                }
            })
        })
        .then((ans) => {
            db.query(`SELECT * FROM employees WHERE manager_id = ${ans.managerId}`,(err, results) => {
                console.table(results)
                chooseAction();

            })
        })
    })
   

}

// add employee
const addEmployee = () => {
    db.query(`SELECT * FROM roles;`, (err, res) => {
        if (err) throw err;
        let role = res.map(roles => (
            {
                name: roles.title,
                value: roles.id
            }
        ))
        db.query(`SELECT * FROM employees;`, (err, res) => {
            if (err) throw err;
            let employee = res.map(employees => (
                {
                    name: employees.first_name + ' ' + employees.last_name,
                    value: employees.id
                }
            ))

            inquirer.prompt(
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
                        type: 'rawlist',
                        name: 'role',
                        message: 'What is employee\'s role?',
                        choices: role
                    },
                    {
                        type: 'rawlist',
                        name: 'manager',
                        message: 'Who is employee\'s Manager?',
                        choices: employee
                    },
                ])
                .then((answers) => {
                    db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)`, [answers.firstName, answers.lastName, answers.role, answers.manager], (err, results) => {
                        viewAllEmployees();
                    })
                    // db.query(`INSERT INTO roles (title, salary, department_id) VALUES(?,?,?)`, [answers.role, answers.salary, answers.roleDepartment], (err, results) => {
                    //     viewAllRoles();
                    // })
                    chooseAction();
                })

        })
    })
}

const updateEmployeeRole = () => {
    db.query(`SELECT * FROM employees;`, (err, res) => {
        if (err) throw err;
        let employee = res.map(employees => (
            {
                name: employees.first_name + ' ' + employees.last_name,
                value: employees.id
            }
        ))
        db.query(`SELECT * FROM departments;`, (err, res) => {
            if (err) throw err;
            let department = res.map(departments => (
                {
                    name: departments.name,
                    value: departments.id
                }
            ))
            db.query(`SELECT * FROM roles;`, (err, res) => {
                if (err) throw err;
                let role = res.map(roles => (
                    {
                        name: roles.title,
                        value: roles.id
                    }
                ))
                inquirer.prompt(
                    [
                        {
                            type: 'rawlist',
                            name: 'employee',
                            message: 'Which employee\'s role do you want to update?',
                            choices: employee
                        },
                        {
                            type: 'rawlist',
                            name: 'role',
                            message: 'What is the Employee\'s new title?',
                            choices: role
                        },
                        {
                            type: 'input',
                            name: 'salary',
                            message: 'What is the Employee\'s new salary?',
                        },
                        {
                            type: 'rawlist',
                            name: 'department',
                            message: 'What is the Employee\'s new department?',
                            choices: department
                        },
                    ])

                    .then((answers) => {
                        db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)`, [answers.first_name, answers.last_name, answers.role, answers.manager], (err, results) => {
                            viewAllEmployees();
                        })
                        chooseAction();
                    })
            })
        })
    })
};

// allows users to update employee managers

const updateEmployeeManager = () => {
    db.query(`SELECT * FROM employees;`, (err, res) => {
        if (err) throw err;
        let employee = res.map(employees => (
            {
                name: employees.first_name + ' ' + employees.last_name,
                value: employees.id
            }
        ))
        inquirer.prompt(
            [
                {
                    type: 'rawlist',
                    name: 'employee',
                    message: 'Which employee\'s manager do you want to update?',
                    choices: employee
                },
                {
                    type: 'rawlist',
                    name: 'manager',
                    message: 'Which manager is going to be employee\'s new manager?',
                    choices: employee
                }
            ])

            .then((answers) => {
                db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)`, [answers.first_name, answers.last_name, answers.role, answers.manager], (err, results) => {
                    viewAllEmployees();
                })
                chooseAction();
            })
    })
};




