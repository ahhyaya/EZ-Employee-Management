INSERT INTO departments (name)
VALUES ("Engineering"), 
        ("Finance"),
        ("Legal"),
        ("Sales"),
        ("Service");

INSERT INTO roles (title, salary, department_id)
VALUES  ("Sales Lead", 150000, 4),
        ("Salesperson", 50000, 4),
        ("Lead Engineer", 200000, 1),
        ("Software Engineer", 200000, 1),
        ("Accountant", 200000, 2),
        ("Legal Team Lead", 200000, 3),
        ("Lawyer", 200000, 3),
        ("Customer Service", 200000, 5);



INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES  ("John", "Doe", 2, 2),
        ("Mike", "Chan", 1, null),
        ("Ashley", "Rodriguez", 5, null),
        ("Kevin", "Tupik", 4, 5),
        ("Kunal", "Singh", 3, null),
        ("Malia", "Brown", 6, null),
        ("Amy", "Kim", 4, 5),
        ("Shawn", "Lopez", 4, 5),
        ("Olivia", "White", 2, 2),
        ("Beckett", "Mott", 4, 5);
