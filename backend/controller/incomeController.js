const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

const postIncome = async (req, res) => {
  try {
    const userId = req.user.id
    const { name, amount } = req.body

    if (!name || !amount) {
      return res.status(400).json({ error: "Please input all fields." })
    }

    await prisma.income.create({
      data: {
        userId,
        name,
        amount: parseInt(amount),
      },
    })

    return res.status(200).json({ success: "Income successfully created." })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Something went wrong." })
  }
}

const getIncome = async (req, res) => {
  try {
    const userId = req.user.id

    const income = await prisma.income.findMany({
      where: {
        userId,
      },
    })

    const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);

    return res.status(200).json({ success: income, totalIncome })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Something went wrong." })
  }
}

const updateIncome = async (req, res) => {
    try{
        const userId = req.user.id;
        const { id } = req.params;
        const { name, amount } = req.body;
        
        if (!name || !amount ) {
            return res.status(400).json({ error: "Please input all fields."});
        }

        if (!id) {
            return res.status(400).json({ error: "No ID found." });
        }

        const checkUser = await prisma.income.findUnique({
            where: { id: parseInt(id) },
        });
        if (checkUser.userId !== userId) {
            return res
            .status(403)
            .json({error: "You are not authorized to perform this action."});
        }
        await prisma.income.update({
            where: {
                id: parseInt(id),
            },
            data: {
                name,
                amount: parseInt(amount),
            },
        });
        return res.status(200).json({ success: "Income successfully updated."});
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong."});
    }
}

const deleteIncome = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "No ID found"});
        }
        const checkUser = await prisma.income.findUnique({
            where: { id: parseInt(id) },
        });
        if (checkUser.userId !== userId){
            return res
            .status(403)
            .json({ error: "You are not authorized to perform this action."})
        }
        await prisma.income.delete({
            where: {
                id: parseInt(id),
            },
        });
        return res.status(200).json({ success: "Expenses successfully deleted."});
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong"});
    }
};

module.exports = {
  postIncome,
  getIncome,
  updateIncome,
  deleteIncome
}
