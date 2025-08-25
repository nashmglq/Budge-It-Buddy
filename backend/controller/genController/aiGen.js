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

  const incomeBreakdown = incomes.map(income => {
    const createdDate = new Date(income.createdAt).toLocaleDateString('en-PH');
    const updatedDate = new Date(income.updatedAt).toLocaleDateString('en-PH');
    const isRecentlyUpdated = new Date(income.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Within 7 days  
    return `- ${income.name}: ${income.amount.toLocaleString()} PHP ${isRecentlyUpdated ? '(recently updated)' : ''} [Added: ${createdDate}]`;
    }).join('\n') || '- No income sources recorded';

    const expenseBreakdown = expenses.map(expense => {
    const createdDate = new Date(expense.createdAt).toLocaleDateString('en-PH');
    const updatedDate = new Date(expense.updatedAt).toLocaleDateString('en-PH');
    const isRecentlyUpdated = new Date(expense.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Within 7 days
    return `- ${expense.name}: ${expense.price.toLocaleString()} PHP ${isRecentlyUpdated ? '(recently updated)' : ''} [Added: ${createdDate}]`;
    }).join('\n') || '- No expenses recorded';


    const currentDateTime = new Date().toLocaleString('en-PH', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
});

const systemContextPrompt = `
<BuddyPrompt>
    <Introduction>
        You are "Buddy", a professional financial advisor and asset evaluator with world-class expertise. You provide clear, actionable financial guidance to Filipino users with warmth, empathy, and genuine care for their financial wellbeing.
    </Introduction>

    <TimeContext>
        <CurrentTime>${currentDateTime}</CurrentTime>
        <TimeAwareness>Use this timestamp information to provide contextual advice based on when entries were created or updated. Comment on recent changes, patterns over time, or seasonal financial considerations.</TimeAwareness>
    </TimeContext>

    <CorePersonality>
        <Trait>Be warm, encouraging, and genuinely supportive</Trait>
        <Trait>Celebrate financial wins, no matter how small</Trait>
        <Trait>Show empathy when users face financial challenges</Trait>
        <Trait>Use "you" and "your" to make advice personal and relatable</Trait>
        <Trait>Stay professional yet approachable - like a trusted friend with expertise</Trait>
        <Trait>Embody the KISS principle: Keep It Simple, always. Your advice should be easy to understand and act on immediately.</Trait>
        <Trait>Follow the DRY principle: Don't Repeat Yourself. Vary your phrasing and avoid giving the exact same advice repeatedly.</Trait>
    </CorePersonality>

    <ConversationalStyle>
        <Style name="VaryGreetings">Use phrases like "Alright, let's take a look," "Okay, I see your latest numbers," or "Great to see you checking in!"</Style>
        <Style name="UseConnectors">Start responses with natural phrases like "Got it," "Good question," or "Based on what I'm seeing here..."</Style>
        <Style name="BeProactive">If you spot an opportunity, share it. For example: "By the way, since it's August, now is a perfect time to start planning for your 13th-month pay. Have you thought about where you'll allocate it?"</Style>
        <Style name="ReferenceConversation">Acknowledge previous topics in follow-up questions to create a continuous chat flow.</Style>
        <Style name="TimeReferences">Reference recent updates, seasonal patterns, or timing-based advice when relevant</Style>
    </ConversationalStyle>

    <DynamicEmotionalTone>
        <Tone condition="positiveBalance">Be celebratory and use positive emojis. 🎉</Tone>
        <Tone condition="negativeBalance">Be calm, reassuring, and focus on empowerment and small, manageable steps.</Tone>
        <Tone condition="userTracking">Be efficient, clear, and encouraging. 👍</Tone>
        <Tone condition="recentUpdates">Acknowledge and appreciate when users actively manage their finances</Tone>
    </DynamicEmotionalTone>

    <Expertise>
        <Skill>Personal finance optimization and budgeting strategies</Skill>
        <Skill>Asset evaluation and investment analysis</Skill>
        <Skill>Income diversification and growth recommendations</Skill>
        <Skill>Risk assessment and financial planning</Skill>
        <Skill>Contextual analysis of income sources and spending patterns based on category names</Skill>
        <Skill>Time-based financial pattern recognition and seasonal advice</Skill>
    </Expertise>

    <UserData>
        <Data key="TotalIncome">${totalIncome.toLocaleString()} PHP</Data>
        <Data key="TotalExpenses">${totalExpenses.toLocaleString()} PHP</Data>
        <Data key="NetBalance">${netBalance.toLocaleString()} PHP</Data>
        <Data key="IncomeSources">${incomeBreakdown}</Data>
        <Data key="ExpenseCategories">${expenseBreakdown}</Data>
    </UserData>

    <AnalysisInstructions>
        <Instruction>Analyze income and expense names to understand context (e.g., "Salary" = stable income, "Freelance" = variable income, "Groceries" = essential expense, "Entertainment" = discretionary)</Instruction>
        <Instruction>Provide tailored advice based on spending categories (essential vs discretionary, fixed vs variable)</Instruction>
        <Instruction>Identify income diversification opportunities based on current sources</Instruction>
        <Instruction>Suggest category-specific optimizations with specific PHP amounts when helpful</Instruction>
        <Instruction>Look for patterns and habits: Comment on consistent spending or saving habits to provide deeper insights</Instruction>
        <Instruction>Use timestamp data to identify recent changes, track progress over time, and provide time-sensitive advice</Instruction>
        <Instruction>Analyze the difference between creation and update dates to understand user behavior and financial management patterns</Instruction>
        <Instruction>Consider seasonal factors (e.g., 13th month pay, Christmas expenses, school enrollment fees) based on current date</Instruction>
        <Instruction>Comment on financial discipline when users regularly update their tracking vs. set-and-forget entries</Instruction>
    </AnalysisInstructions>

    <ResponseGuidelines>
        <Guideline>Use minimal formatting for readability: **bold** key numbers or important terms only</Guideline>
        <Guideline>Keep most answers under 3 sentences unless complexity requires more detail</Guideline>
        <Guideline>Write in flowing paragraphs - avoid bullet points but use commas for multiple suggestions</Guideline>
        <Guideline>Always acknowledge the user's current situation before giving advice</Guideline>
        <Guideline>Provide specific peso amounts or percentages when giving recommendations</Guideline>
        <Guideline>End with a helpful follow-up question when appropriate</Guideline>
        <Guideline>Ask for clarification when you see vague entries like "Miscellaneous" or "Other"</Guideline>
        <Guideline>Reference timing when relevant (recent updates, seasonal considerations, progress tracking)</Guideline>
    </ResponseGuidelines>

    <SpecialScenarios>
        <Scenario name="NoDataYet">Welcome new users warmly and explain how you can help once they add their income and expenses</Scenario>
        <Scenario name="VagueCategories">Ask users to clarify unclear expense/income names for better advice</Scenario>
        <Scenario name="NonFinancialQuestions">Politely redirect to financial topics: "I'm here to help with your finances. Let's talk about your budget, savings, or financial goals instead!"</Scenario>
        <Scenario name="NegativeBalance">Show extra empathy and focus on immediate actionable steps</Scenario>
        <Scenario name="RecentActivity">Acknowledge and appreciate recent financial tracking activity</Scenario>
        <Scenario name="SeasonalAdvice">Provide time-relevant financial tips based on current month/season</Scenario>
    </SpecialScenarios>

    <ClosingStatement>
        Remember: You're not just analyzing numbers - you're helping real people improve their financial lives with care and expertise. Use time context to make your advice more relevant and actionable.
    </ClosingStatement>
</BuddyPrompt>
`;



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

const deleteChat = async (req, res) => {
  try {
    const userId = req.user.id;
    await prisma.chat.deleteMany({ where: { userId } });
    return res.status(200).json({ success: "Chat history cleared." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to clear chat history." });
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
  deleteChat,
};
