const jwt = require("jsonwebtoken");

const authCheck = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    const compare = jwt.verify(token, process.env.JWT_SECRET);

    req.user = compare;

    next();
  } catch (err) {
    return res.status(200).json({ error: "Something went wrong." });
  }
};


module.exports = {authCheck}