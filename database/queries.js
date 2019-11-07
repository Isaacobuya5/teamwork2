const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const pool = new Pool({
  user: "isaac",
  host: "localhost",
  database: "employees",
  password: "Phestustoma5",
  port: 5432
});

function HasRolex(role) {
  const auth = async (req, res, next) => {
    const rawToken = req.header("Authorization");
    console.log("token" + rawToken);
    const Token = rawToken.replace("Bearer ", "");
    const data = jwt.verify(Token, "daragon");
    console.log(data);
    // console.log(Token);
    // const query = "SELECT * FROM employee_info WHERE id = $1";
    // try {
    //   const employee = await pool.query(query, [data.id]);
    //   console.log(employee.rows);
    //   if (employee.rowCount === 0) {
    //     throw new Error();
    //   }
    //   next();
    // } catch (error) {
    //   res.status(400).send({ message: `Unauthorized Access ${error}` });
    // }
    // res.status(200).send({ role: data.role });
    console.log(data.role);
  };
}

function HasRole(role) {
  return function(req, res, next) {
    const rawToken = req.header("Authorization");

    const Token = rawToken.replace("Bearer ", "");
    const data = jwt.verify(Token, "daragon");

    if (role.includes(String(data.role.trim()))) {
      next();
    } else {
      res.status(500).send({ message: "Access Denied" });
    }
  };
}

// comparing password entered by user vs hash password
const comparePassword = (password, hashPassword) =>
  bcrypt.compareSync(password, hashPassword);

// generating authentication tokens
const generateToken = (id, role) => {
  console.log({ id, role });
  const token = jwt.sign({ id, role }, "daragon");
  return token;
};

const getEmployees = async (req, res) => {
  const query = "SELECT * FROM employee_data ORDER BY name ASC";
  try {
    const results = await pool.query(query);
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};

const getEmployeeById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const query = "SELECT * FROM employee_data WHERE id = $1";
  try {
    const results = await pool.query(query, [id]);
    const { rows } = results;
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};
// create a new employee
const createEmployee = async (req, res) => {
  const { name, email, age, password, roles } = req.body;
  console.log(req.body);
  const query =
    "INSERT INTO employee_data (name, email, age, password, roles) VALUES ($1, $2, $3, $4, $5)";
  // hash my password before saving into the data

  // generate token for this particular user

  try {
    const encrypted = await bcrypt.hashSync(password, bcrypt.genSaltSync(8));
    const results = await pool.query(query, [
      name,
      email,
      age,
      encrypted,
      roles
    ]);
    res.status(201).send(`User added with id ${results}`);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

// modify an existing employee
const updateEmployee = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, email, age } = req.body;
  const query =
    "UPDATE employee_info SET name = $1, email = $2, age = $3 WHERE id = $4";
  // hash my password before saving into the data
  try {
    const results = await pool.query(query, [name, email, age, id]);
    res.status(200).send(`User modified with ID: ${id}`);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

// delete an employee
const deleteEmployee = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const query = "DELETE FROM employee_info WHERE id = $1";
  try {
    await pool.query(query, [id]);
    res.status(200).send(`Employee with id ${id} deleted succesfully`);
  } catch (error) {
    res.status(500).send(error);
  }
};

// login an existing user
const employeeLogin = async (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM employee_data WHERE email=$1";
  try {
    // check for email
    const results = await pool.query(query, [email]);
    if (results.rowCount === 0) {
      throw new Error("User does not exist");
    }
    // time to check if password exists
    const isPasswordValid = comparePassword(password, results.rows[0].password);
    // wrong password
    if (!isPasswordValid) {
      throw new Error("Sorry,,you entered wrong password..");
    }
    const token = generateToken(results.rows[0].email, results.rows[0].roles);
    res.status(200).send(token);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  employeeLogin,
  HasRole
};
