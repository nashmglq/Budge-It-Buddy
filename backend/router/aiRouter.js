const express = require("express");
const { authCheck } = require("../middleware/authCheck");
const { chatBot, getChat } = require("../controller/genController/aiGen");
const chatBotRouter = express.Router();

chatBotRouter.post("/summary", authCheck, chatBot);
chatBotRouter.get("/getChat", authCheck, getChat);

module.exports = {chatBotRouter};