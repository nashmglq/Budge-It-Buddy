const express = require("express");
const { authCheck } = require("../middleware/authCheck");
const { chatBot, getChat, insightsAI } = require("../controller/genController/aiGen");
const chatBotRouter = express.Router();

chatBotRouter.post("/summary", authCheck, chatBot);
chatBotRouter.get("/getChat", authCheck, getChat);
chatBotRouter.get("/insights", authCheck, insightsAI)

module.exports = {chatBotRouter};