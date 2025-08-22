const { GoogleGenerativeAI } = require("@google/generative-ai")
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

const chatBot = async (req, res) => {
  try {
    const userId = req.user.id;
    // NEW LOGIC 1: Receive the chat history from the frontend.
    // It defaults to an empty array if it's the first message.
    const { userMessage, history = [] } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: "No user message provided." });
    }

    // Step 2: Fetch the financial data (this is still done on every turn for real-time context)
    const incomes = await prisma.income.findMany({ where: { userId } });
    const expenses = await prisma.expenses.findMany({ where: { userId } });
    const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + item.price, 0);
    const netBalance = totalIncome - totalExpenses;

    // NEW LOGIC 2: Create a system context prompt. This is the "brain" for the AI.
    // It's separate from the user's direct messages.
    const systemContextPrompt = `You are "Buddy", a friendly and helpful financial assistant from the Philippines. Your goal is to provide simple, approachable financial advice and answer questions based on the user's data.

    Here is the user's current financial summary (use this to inform your answers):
    - Total Income: ${totalIncome.toLocaleString()} PHP
    - Total Expenses: ${totalExpenses.toLocaleString()} PHP
    - Net Balance: ${netBalance.toLocaleString()} PHP`;

    // NEW LOGIC 3: Use the AI's dedicated "chat" mode.
    // We provide it with the system context and the previous conversation turns.
    const chat = model.startChat({
      history: [
        // This structure is how the AI understands the flow of conversation
        { role: "user", parts: [{ text: systemContextPrompt }] },
        { role: "model", parts: [{ text: "Got it! I'm ready to help. What's on your mind?" }] },
        ...history, // This adds all the previous messages from your chat.
      ],
    });

    // NEW LOGIC 4: Send only the NEW message to the ongoing chat session.
    const result = await chat.sendMessage(userMessage);
    const aiResponse = result.response;
    const responseMessage = aiResponse.text();

    return res.status(200).json({ reply: responseMessage });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "I had some trouble analyzing your data." });
  }
};


module.exports = {
  chatBot,
}
