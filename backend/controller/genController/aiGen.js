const { GoogleGenerativeAI } = require("@google/generative-ai");
const { PrismaClient } = require("@prisma/client");
const {
  GoogleAuthExceptionMessages,
} = require("google-auth-library/build/src/auth/googleauth");
const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const chatBot = async (req, res) => {
  try {
    const userId = req.user.id;
    const { userMessage } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: "No user message provided." });
    }

    const historyDB = await prisma.chat.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    const history = historyDB.map((msg) => ({
      role: msg.isAI ? "model" : "user",
      parts: [{ text: msg.message }],
    }));

    const incomes = await prisma.income.findMany({ where: { userId } });
    const expenses = await prisma.expenses.findMany({ where: { userId } });
    const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + item.price, 0);
    const netBalance = totalIncome - totalExpenses;

    const systemContextPrompt = `You are "Buddy", a friendly and helpful financial assistant from the Philippines. 
    Your goal is to provide simple, approachable financial advice and answer questions based on the user's data.

    Here is the user's current financial summary (use this to inform your answers):
    - Total Income: ${totalIncome.toLocaleString()} PHP
    - Total Expenses: ${totalExpenses.toLocaleString()} PHP
    - Net Balance: ${netBalance.toLocaleString()} PHP`;

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemContextPrompt }] },
        {
          role: "model",
          parts: [{ text: "Got it! I'm ready to help. What's on your mind?" }],
        },
        ...history,
      ],
    });

    const result = await chat.sendMessage(userMessage);
    const aiResponse = result.response;
    const responseMessage = aiResponse.text();

    await prisma.chat.create({
      data: {
        message: userMessage,
        isAI: false,
        userId,
      },
    });

    await prisma.chat.create({
      data: {
        message: responseMessage,
        isAI: true,
        userId: userId,
      },
    });

    return res.status(200).json({ success: responseMessage });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "I had some trouble analyzing your data." });
  }
};

const getChat = async (req, res) => {
  try {
    const userId = req.user.id;

    const chat = await prisma.chat.findMany({ where: { userId } });

    return res.status(200).json({ success: chat });
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong." });
  }
};

const insightsAI = async (req, res) => {
  try {
    const userId = req.user.id;

    const lastInsight = await prisma.insights.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    const lastPromptTime = lastInsight ? lastInsight.createdAt : new Date(0);

    const latestIncome = await prisma.income.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    const latestExpense = await prisma.expenses.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    const latestGoal = await prisma.goal.findFirst({
      where: { userId },
      orderBy: { id: "desc" },
    });

    if (
      (latestIncome && latestIncome.createdAt > lastPromptTime) ||
      (latestExpense && latestExpense.createdAt > lastPromptTime) ||
      (latestGoal && latestGoal.id > (lastInsight ? lastInsight.id : 0))
    ) {
      const income = await prisma.income.findMany({ where: { userId } });
      const expenses = await prisma.expenses.findMany({ where: { userId } });
      const goal = await prisma.goal.findMany({ where: { userId } });

      const totalIncome = await prisma.income.aggregate({
        _sum: { amount: true },
        where: { userId },
      });
      const expensesIncome = await prisma.expenses.aggregate({
        _sum: { price: true },
        where: { userId },
      });

      const prompt = `
You are a financial assistant. The user has the following financial data:
- Total Income: ${totalIncome._sum.amount || 0}
- Total Expenses: ${expensesIncome._sum.price || 0}
- Goals: ${goal.map((g) => g.title).join(", ") || "No goals yet"}
- Income Details: ${
        income.map((i) => `${i.name}: ${i.amount}`).join(", ") || "No income yet"
      }
- Expense Details: ${
        expenses.map((e) => `${e.name}: ${e.price}`).join(", ") || "No expenses yet"
      }

Based on this data, give **actionable financial advice** in short bullet points using this style:

Tip 1  
Tip 2  
Tip 3  

Focus on:
- Reducing unnecessary expenses  
- Saving or investing wisely  
- Helping the user reach their financial goals  

Keep it friendly, concise, and practical.
`;

      const result = await model.generateContent(prompt);
      const advice = result.response.text();

      await prisma.insights.create({
        data: { userId, message: advice },
      });

      return res.status(200).json({ success: advice });
    } else {
      console.log("RETURN OLD PROMPT")
      return res.status(200).json({ success: lastInsight ? lastInsight.message : "" });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ error: "Something went wrong." });
  }
};


module.exports = {
  chatBot,
  getChat,
  insightsAI,
};
