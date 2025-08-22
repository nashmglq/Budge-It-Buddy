const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const postExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Please input all fields." });
    }

    await prisma.expenses.create({
      data: {
        userId,
        name,
        price: parseInt(price),
      },
    });

    return res.status(200).json({ success: "Expenses successfully created." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong." });
  }
};

const deleteExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "No ID found." });
    }
    const checkUser = await prisma.expenses.findUnique({
      where: { id : parseInt(id) },
    });
    if (checkUser.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to perform this action." });
    }
    await prisma.expenses.delete({
      where: {
        id : parseInt(id),
      },
    });
    return res.status(200).json({ success: "Expenses successfully deleted." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong." });
  }
};

const updateExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Please input all fields." });
    }

    if (!id) {
      return res.status(400).json({ error: "No ID found." });
    }

    const checkUser = await prisma.expenses.findUnique({
      where: { id: parseInt(id) },
    });
    if (checkUser.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to perform this action." });
    }
    await prisma.expenses.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
        price : parseInt(price),
      },
    });
    return res.status(200).json({ success: "Expenses successfully updated." });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong." });
  }
};

const getExpenses = async (req, res) => {
  try {
    const userId = req.user.id;

    const expenses = await prisma.expenses.findMany({
      where: {
        userId,
      },
    });

    const totalExpenses = expenses.reduce((sum, item) => sum + item.price, 0);

    return res.status(200).json({ success: expenses, totalExpenses });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something went wrong." });
  }
};

module.exports = {
  postExpenses,
  deleteExpenses,
  updateExpenses,
  getExpenses,
};
