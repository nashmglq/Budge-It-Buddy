const express = require("express");
const { authCheck } = require("../middleware/authCheck");
const { getGoal, postGoal, updateGoal, deleteGoal } = require("../controller/goalsController");
const goalRouter = express.Router();

goalRouter.get("/get-goal", authCheck, getGoal);
goalRouter.post("/post-goal", authCheck, postGoal);
goalRouter.put("/update-goal/:id", authCheck, updateGoal);
goalRouter.delete("/delete-goal/:id", authCheck, deleteGoal)


module.exports = {goalRouter}