const { GoogleGenerativeAI } = require("@google/generative-ai");
const { PrismaClient } = require("@prisma/client");
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

module.exports = {
  chatBot,
  getChat
};
