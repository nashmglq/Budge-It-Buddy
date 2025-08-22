const express = require("express");
const { authCheck } = require("../middleware/authCheck");
const { postIncome, getIncome, updateIncome, deleteIncome } = require("../controller/incomeController");
const incomeRouter = express.Router();

incomeRouter.post("/post-income", authCheck, postIncome);
incomeRouter.get("/get-income", authCheck, getIncome);
incomeRouter.put("/update-income/:id", authCheck, updateIncome);
incomeRouter.delete("/delete-income/:id", authCheck, deleteIncome);

module.exports = {incomeRouter}