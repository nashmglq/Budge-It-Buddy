const express = require("express");
const { authCheck } = require("../middleware/authCheck");
const { getExpenses, postExpenses, updateExpenses, deleteExpenses } = require("../controller/expensesController");
const expensesRouter = express.Router();

expensesRouter.get("/get-expenses", authCheck, getExpenses);
expensesRouter.post("/post-expenses", authCheck, postExpenses);
expensesRouter.put("/update-expenses/:id", authCheck, updateExpenses);
expensesRouter.delete("/delete-expenses/:id", authCheck, deleteExpenses);

module.exports = {expensesRouter}