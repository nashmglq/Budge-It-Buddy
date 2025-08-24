const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const postGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, targetAmount, currentAmount } = req.body;

    if (!title || !targetAmount || !currentAmount) {
      return res.status(400).json({ error: "Please input all fields." });
    }

    await prisma.goal.create({
      data: {
        userId,
        title,
        targetAmount: parseInt(targetAmount),
        currentAmount: parseInt(currentAmount),
      },
    });

    return res.status(200).json({ success: "Goal successfully created." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong." });
  }
};

const getGoal = async (req, res) => {
  try {
    const userId = req.user.id;

    const goal = await prisma.goal.findMany({
      where: {
        userId,
      },
    });

    return res.status(200).json({ success: goal });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong." });
  }
};

const updateGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, currentAmount, targetAmount } = req.body;

    console.log(userId, title, currentAmount, targetAmount, id);

    if (!title || !currentAmount || !targetAmount) {
      return res.status(400).json({ error: "Please input all fields." });
    }

    if (!id) {
      return res.status(400).json({ error: "No ID found." });
    }

    const checkUser = await prisma.goal.findUnique({
      where: { id: parseInt(id) },
    });

    console.log(checkUser);
    if (checkUser.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to perform this action." });
    }
    await prisma.goal.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        currentAmount: parseInt(currentAmount),
        targetAmount: parseInt(targetAmount),
      },
    });
    return res.status(200).json({ success: "Goal successfully updated." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong." });
  }
};

const deleteGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "No ID found" });
    }
    const checkUser = await prisma.goal.findUnique({
      where: { id: parseInt(id) },
    });
    if (checkUser.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to perform this action." });
    }
    await prisma.goal.delete({
      where: {
        id: parseInt(id),
      },
    });
    return res.status(200).json({ success: "Goal successfully deleted." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { postGoal, getGoal, updateGoal, deleteGoal };
