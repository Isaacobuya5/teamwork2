const express = require("express");
const db = require("../database/queries");

const router = new express.Router();

router.get("/employees", db.getEmployees);
router.get("/employees/:id", db.getEmployeeById);
router.post("/employees", db.createEmployee);
router.post("/employee/login", db.employeeLogin);
router.put("/employees/:id", db.updateEmployee);
router.delete("/employees/:id", db.deleteEmployee);

module.exports = router;
