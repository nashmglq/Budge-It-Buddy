const express = require("express");
const { register, login, getProfile, updateProfile } = require("../controller/authController");
const { authCheck } = require("../middleware/authCheck");
const authRoute = express.Router();

authRoute.post("/register", register);
authRoute.post("/login", login);
authRoute.get("/profile", authCheck, getProfile)
authRoute.put("/update-profile", authCheck, updateProfile)

module.exports = { authRoute };