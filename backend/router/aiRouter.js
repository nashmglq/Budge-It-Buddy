const express = require("express");
const { authCheck } = require("../middleware/authCheck");
const { chatBot } = require("../controller/genController/aiGen");
const chatBotRouter = express.Router();

chatBotRouter.post("/summary", authCheck, chatBot);

module.exports = {chatBotRouter};