const express = require("express");
const { register, login, getProfile } = require("../controller/authController");
const { authCheck } = require("../middleware/authCheck");
const authRoute = express.Router();

authRoute.post("/register", register);
authRoute.post("/login", login);
authRoute.get("/profile", authCheck, getProfile)

module.exports = { authRoute };