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

console.log(
    `
    ***************************************************
    *                                                 *
    *        Welcome To EZ-Employee-Management!       *
    *                                                 *
    *                     Enjoy!                      *
    *                                                 *
    ***************************************************
 `);

const chooseAction = () => {
   
    // main questions array
    return inquirer.prompt([
        {
            type: 'list',
            name: 'actions',
            message: 'What would you like to do?',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add Department',
                'Add Role',
                'Add Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'View All Employees by Manager',
                'View All Employees by department',
                'View Department Budget',
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

                case 'View All Employees by department':
                    viewAllEmployeesByDepartment();
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

                case 'View Department Budget':
                    viewDepartmentBudget();
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
    db.query(`SELECT departments.id AS DepartmentID, departments.name AS Department FROM departments`, (err, results) => {
        if(err) throw err;
        console.table(results);
        chooseAction();
    })
}

// view all roles
const viewAllRoles = () => {
    db.query(`SELECT roles.id AS RoleID, roles.title AS Title, roles.salary AS Salary,departments.name AS Department FROM departments LEFT JOIN roles ON departments.id = roles.department_id ORDER BY roles.id asc`, (err, results) => {
        if(err) throw err;
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
    db.query(`SELECT employees.id AS EmployeeID, employees.first_name AS FirstName, employees.last_name AS LastName, employees.manager_id AS ManagerId, roles.title AS Title, roles.salary AS Salary, departments.name AS Department
                FROM employees
                LEFT JOIN roles
                    ON employees.role_id = roles.id
                LEFT JOIN departments
                    ON roles.department_id = departments.id`,(err, results) => {
        if(err) throw err;
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
            db.query(`SELECT employees.id AS EmployeeID, employees.first_name AS FirstName, employees.last_name AS LastName, roles.title AS Title, roles.salary AS Salary, departments.name AS Department, employees.manager_id AS ManagerID 
            FROM employees 
            LEFT JOIN roles ON employees.role_id = roles.id 
            LEFT JOIN departments ON roles.department_id = departments.id
            WHERE manager_id = ${ans.managerId}`
            ,(err, results) => {
                if(err) throw err;
                console.table(results)
                chooseAction();
            })
        })
    })
}

// allows users to view employees by department
const viewAllEmployeesByDepartment = () => {
    db.query("SELECT * FROM employees WHERE role_id;", (err, results) => {
        inquirer.prompt({
            type: "list",
            message: "Please select a department",
            name: "department",
            choices: results.map((res) => {
                return {
                    name: res.name,
                    value: res.id
                }
            })
        })
        .then((ans) => {
            db.query(`SELECT * FROM employees LEFT JOIN roles ON employees.role_id = roles.id WHERE roles.department_id = ?;`,[ans.department], (err, results) => {
                if(err) throw err;
                console.table(results)
                chooseAction();
                }
            )
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
                    name: employees.first_name + ' ' + employees.last_name + ' (ManagerID: ' + employees.manager_id + ')',
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
                        console.log('\n')
                        viewAllEmployees();
                    })
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
                    ])

                    .then((answers) => {
                        db.query(`UPDATE employees SET role_id = ? WHERE id = ?`, [answers.role, answers.employee], (err, results) => {
                            if(err) throw err;
                            console.log('\n')
                            viewAllEmployees();
                        })
                        chooseAction();
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
                db.query(`UPDATE employees SET manager_id = ? WHERE id = ?`, [answers.manager, answers.employee], (err, results) => {
                    if(err) throw err;
                    console.log('\n')
                    viewAllEmployees();
                })
                chooseAction();
            })
    })
};

// allows users to view the total utilized budget of a department—in other words, the combined salaries of all employees in that department (8 points).

const viewDepartmentBudget = () => {
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
                type: 'list',
                name: 'department',
                message: 'Please select a department to view the budget: ',
                choices: department
            },
        ])
            .then((ans)  => {
                db.query(`SELECT SUM(roles.salary) AS DepartmentBudget FROM employees LEFT JOIN roles ON employees.role_id = roles.id WHERE roles.department_id = ?;`,[ans.department], (err, res) => {
                    if (err) throw err;
                    console.log('\n')
                    console.table(res)
            })
            chooseAction();
            })
})
}
