const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const register = async (req, res) => {
  try {
    const { email, name, password1, password2 } = req.body;

    if (!email || !name || !password1 || !password2) {
      return res.status(400).json({ error: "Please input all fields." });
    }

    const findUser = await prisma.user.findUnique({ where: { email } });
    if (findUser)
      return res.status(400).json({ error: "Email already exist." });

    if (password1 !== password2)
      return res.status(400).json({ error: "Password do not match." });

    if (
      validator.isStrongPassword(password1) &&
      validator.isStrongPassword(password2)
    ) {
      const hashedPassword = await bcrypt.hash(password1, 10);

      await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
        },
      });
      return res.status(200).json({ success: "Registered Successfully" });
    }

    return res
      .status(400)
      .json({
        error:
          "Password is weak. It must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please input all fields" });
    }

    const findUser = await prisma.user.findUnique({ where: { email } });

    if (!findUser) {
      return res.status(400).json({ error: "Email not found." });
    }

    const compareHash = await bcrypt.compare(password, findUser.password);

    if (compareHash) {
      const token = await jwt.sign(
        { id: findUser.id },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      return res.status(200).json({ success: { token: token } });
    }

    return res.status(400).json({ error: "Incorrect password." });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getProfile = async(req,res) => {
  try{
    const userId = req.user.id;

    const profile = await prisma.user.findUnique({
      where: {id :userId},
      select: {
        name: true,
        email: true,
        profilePic: true
      }
    })    

    return res.status(200).json({success: profile})
    
  }catch(err){
    console.log(err);
    return res.status(500).json({ error: "Something went wrong." });
  }
}



module.exports = {
  register,
  login,
  getProfile
};
