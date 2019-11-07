const express = require("express");
const db = require("../database/queries");
const { admin, user } = require("./roles");

const router = new express.Router();

router.get("/employees", db.HasRole(user), db.getEmployees);
router.get("/employees/:id", db.getEmployeeById);
router.post("/employees", db.createEmployee);
router.post("/employee/login", db.employeeLogin);
router.put("/employees/:id", db.updateEmployee);
router.delete("/employees/:id", db.HasRole(admin), db.deleteEmployee);

module.exports = router;
