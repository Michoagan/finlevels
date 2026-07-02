import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { plaidClient } from "../../../../lib/plaid";
import { decryptChallengeToken } from "../../../../lib/challenge-token";
import { sendPushToUser } from "../../../../lib/server-push";

const getSupabaseClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
};

export async function POST(request: Request) {
  try {
    const { accessToken: clientAccessToken, token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Missing session token." }, { status: 400 });
    }

    let payload;
    try {
      payload = decryptChallengeToken(decodeURIComponent(token));
    } catch (e) {
      return NextResponse.json({ error: "Session token is invalid or expired." }, { status: 401 });
    }

    const { userId } = payload;
    const sb = getSupabaseClient();

    let accessToken = clientAccessToken;
    if (!accessToken) {
      // Load Plaid access token from waitlist table in DB
      const { data: userData, error: fetchErr } = await sb
        .from("waitlist")
        .select("plaid_access_token")
        .eq("id", userId)
        .maybeSingle();

      if (userData && userData.plaid_access_token) {
        accessToken = userData.plaid_access_token;
      }
    }

    if (!accessToken) {
      return NextResponse.json({ error: "Missing Plaid access token (bank not connected)." }, { status: 400 });
    }


    // Fetch all historical transactions available from Plaid
    let plaidTransactions: any[] = [];
    try {
      const endDate = new Date().toISOString().split("T")[0];
      const startDate = "2000-01-01";

      const plaidResponse = await plaidClient.transactionsGet({
        access_token: accessToken,
        start_date: startDate,
        end_date: endDate,
        options: { count: 500 },
      });
      plaidTransactions = plaidResponse.data.transactions || [];
    } catch (err: any) {
      console.warn("Plaid transactions not ready during analysis (non-blocking):", err.message);
    }




    // Format transactions for Gemini context
    const formattedTx = plaidTransactions.map((t) => ({
      date: t.date,
      merchant: t.name || t.merchant_name || "Unknown Merchant",
      amount: t.amount,
      category: t.category ? t.category.join(" > ") : "General",
    }));

    console.log(`[Plaid AI Analysis] Sending ${formattedTx.length} transactions to Gemini for user ID: ${userId}...`);

    const geminiApiKey = process.env.GEMINI_API_KEY;
    let analysisResult;

    if (geminiApiKey) {
      try {
        analysisResult = await runGeminiAnalysis(formattedTx, geminiApiKey);
        console.log("[Plaid AI Analysis] Gemini response received:", JSON.stringify(analysisResult, null, 2));
      } catch (geminiError: any) {
        console.error("Gemini AI API analysis failed, using fallback engine:", geminiError);
        analysisResult = runFallbackAnalysis(formattedTx);
      }
    } else {
      console.warn("GEMINI_API_KEY is not configured. Using local fallback rule engine.");
      analysisResult = runFallbackAnalysis(formattedTx);
    }


    // Determine primary focus coin based on lowest score
    const { stabilityLevel, savingLevel, investingLevel } = analysisResult;
    let primaryFocusCoin = "stability";
    if (savingLevel <= stabilityLevel && savingLevel <= investingLevel) {
      primaryFocusCoin = "saving";
    } else if (investingLevel <= stabilityLevel && investingLevel <= savingLevel) {
      primaryFocusCoin = "investing";
    }

    // Map Gemini suggested cagnottes into structured UserGoal array
    const mappedGoals = (analysisResult.suggestedGoals || []).map((g: any, index: number) => ({
      id: `plaid_goal_${index}_${Date.now()}`,
      name: g.name || "Épargne Objectif",
      target: Number(g.target || 1000),
      current: 0,
      category: g.category || "saving",
      isActive: index === 0, // default first goal as active
    }));

    let finalSummary = "";
    if (typeof analysisResult.analysisSummary === "object" && analysisResult.analysisSummary !== null) {
      const s = analysisResult.analysisSummary;
      finalSummary = `🏆 Financial Score
${s.financialScore || s.score || "Level 1"}

💪 Biggest Strength
${s.biggestStrength || s.strength || "N/A"}

⚠️ Biggest XP Leak
${s.biggestXpLeak || s.xpLeak || s.leak || "N/A"}

🎯 Main Quest
${s.mainQuest || "N/A"}

🗡️ Side Quest
${s.sideQuest || "N/A"}

🎁 Reward
${s.reward || "N/A"}`;
    } else {
      finalSummary = String(analysisResult.analysisSummary || "");
    }

    // Update Supabase with the newly determined AI profile and goals
    const { error: dbError } = await sb
      .from("waitlist")
      .update({
        profile_name: analysisResult.archetype,
        stability_level: stabilityLevel,
        saving_level: savingLevel,
        investing_level: investingLevel,
        primary_focus_coin: primaryFocusCoin,
        goals: mappedGoals,
        analysis_summary: finalSummary,
        last_analysis_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (dbError) {
      throw new Error(`Failed to save AI Profile to DB: ${dbError.message}`);
    }

    // Auto-generate Quests & Bosses based on AI analysis
    try {
      const suggestedGoals = analysisResult.suggestedGoals || [];
      const subscriptions = analysisResult.recurringSubscriptions || [];

      // 1. Delete any existing pending quests to avoid hoarding choices
      const { error: deleteErr } = await sb
        .from("quests")
        .delete()
        .eq("user_id", userId)
        .eq("status", "pending");

      if (deleteErr) {
        console.warn("Failed to delete old pending quests:", deleteErr.message);
      }

      // 2. Generate exactly 3 Quêtes from the suggestedGoals in status 'pending'
      if (suggestedGoals.length > 0) {
        const questsToInsert = suggestedGoals.map((sg: any) => {
          const diff = (sg.difficulty || "medium").toLowerCase();
          let xpReward = 100;
          let coinReward = 20;

          if (diff === "easy") {
            xpReward = 50;
            coinReward = 10;
          } else if (diff === "hard") {
            xpReward = 150;
            coinReward = 30;
          } else if (diff === "epic") {
            xpReward = 200;
            coinReward = 40;
          }

          return {
            user_id: userId,
            title: sg.name || "🛡️ Défi Sans Nom",
            description: sg.description || "Complétez cette quête pour économiser et progresser.",
            difficulty: diff,
            category: sg.category || "saving",
            target_merchant: sg.name || "General",
            target_amount: Number(sg.target || 0),
            duration_days: Number(sg.duration_days || 7),
            status: "pending",
            xp_reward: xpReward,
            coin_reward: coinReward,
          };
        });

        const { error: questErr } = await sb.from("quests").insert(questsToInsert);
        if (questErr) console.warn("Failed to save auto-generated quests to DB:", questErr.message);
      }

      // 2. Generate Boss "Subscription Dragon" if subscriptions exist (purge prior active boss first to avoid duplication)
      if (subscriptions.length > 0) {
        const { error: deleteBossErr } = await sb
          .from("bosses")
          .delete()
          .eq("user_id", userId)
          .eq("status", "active");

        if (deleteBossErr) {
          console.warn("Failed to delete old active boss battles:", deleteBossErr.message);
        }

        // Calculate estimated monthly cost (HP)
        // Assume default average monthly cost of 12.99€ per subscription
        const avgMonthlyCost = 12.99;
        const totalMonthlyCost = Math.round(subscriptions.length * avgMonthlyCost);

        const { error: bossErr } = await sb.from("bosses").insert({
          user_id: userId,
          name: "The Subscription Dragon 🐉",
          max_hp: totalMonthlyCost,
          current_hp: totalMonthlyCost,
          target_subscriptions: subscriptions,
          status: "active",
          gold_reward: 200,
        });
        if (bossErr) console.warn("Failed to save Boss battle to DB (ensure bosses table exists):", bossErr.message);
      }
    } catch (questGenErr: any) {
      console.error("Non-blocking Quest & Boss generation failed:", questGenErr.message);
    }

    // Trigger Day 0 initial email
    const { data: updatedUser } = await sb
      .from("waitlist")
      .select("email")
      .eq("id", userId)
      .maybeSingle();

    const email = updatedUser?.email || "";
    if (email) {
      try {
        const siteUrl = (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
        await fetch(`${siteUrl}/api/challenges/send-initial-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }).catch((err) => console.error("Non-blocking background email trigger failed:", err));
      } catch (e) {
        console.error("Non-blocking initial email error:", e);
      }
    }

    // Trigger non-blocking push notification to signal Penny's audit is complete
    try {
      sendPushToUser(userId, {
        title: "🦉 Diagnostic Complete!",
        body: `Penny: "Yo! I just audited your bank logs. You are officially '${analysisResult.archetype}'! Let's check your new quests! ⚔️"`,
        url: `/profile/${token}`,
      }).catch((err) => console.error("Non-blocking server push failed:", err));
    } catch (e) {
      console.error("Non-blocking server-side push alert trigger error:", e);
    }


    return NextResponse.json({
      success: true,
      archetype: analysisResult.archetype,
      stabilityLevel,
      savingLevel,
      investingLevel,
      analysisSummary: analysisResult.analysisSummary,
      suggestedGoals: mappedGoals,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to analyze transactions" }, { status: 500 });
  }
}

async function runGeminiAnalysis(transactions: any[], apiKey: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

 const promptText = `
You are Coach Penny, the in-game financial coach of FinLevels. You are not a financial advisor—you are the player's trusted companion who helps them level up their money habits.

Analyze the user's last 2 weeks of Plaid transactions.

Your mission is to:

1. Identify the user's strongest financial habit based only on their transaction data (consistent saving, stable income, controlled spending, investing, etc.).

2. Identify the biggest spending pattern or financial behavior slowing their progress (frequent restaurants, coffee, shopping, subscriptions, transportation, impulse purchases, lack of savings, lack of investing, unstable cash flow, etc.).

3. Determine which ONE financial area should be improved first:
   - Stability
   - Saving
   - Investing

Choose only one priority and explain why it will have the greatest positive impact.

4. Classify the player into one of these archetypes:
   - The Survivor
   - The Explorer
   - The Stabilizer
   - The Saver
   - The Builder
   - The Investor
   - The Strategist
   - The Opportunist
   - The Wealth Architect

5. Detect recurring subscriptions.

6. Generate three realistic financial goals adapted to the player's habits.

========================
COACH PENNY PERSONA
========================

Coach Penny is supportive, motivating, optimistic and confident.

She celebrates progress before pointing out weaknesses.

She never makes the player feel guilty or judged.

She speaks naturally, like a smart friend who understands money.

She never sounds like:
- a bank
- a financial institution
- a budgeting app
- a financial advisor
- an AI assistant

Never mention AI, Plaid, algorithms, JSON, models or databases.

========================
ANALYSIS SUMMARY
========================

For the user analysis output, format the coaching summary as a short RPG-style player report.

The output must follow this structure:

🏆 Financial Score
Display the player's financial level (for example: "Level 12 Explorer").

💪 Biggest Strength
Highlight the user's strongest financial habit based only on their transaction history.

⚠️ Biggest XP Leak
Identify the single spending habit or behavior causing the greatest financial drag. Mention merchants or spending categories when appropriate.

🎯 Main Quest
Recommend the ONE financial skill the player should unlock next (Saving, Stability, Investing, Credit, Debt, etc.) with a short explanation.

🗡️ Side Quest
Give one simple challenge the player can realistically complete within the next 7 days.

🎁 Reward
Describe the reward for completing the quest using RPG language. Include XP and, when possible, the estimated amount of money they could save or invest.

The coaching report should:
- feel like a game, not a banking app
- be energetic and motivating
- celebrate progress before giving advice
- never shame the player
- never invent financial facts
- use only insights supported by the user's Plaid data
- keep every section short (1–3 lines)
- avoid long paragraphs
- sound natural for Gen Z users in the United States.

========================
OUTPUT FORMAT
========================

Respond ONLY with valid JSON.

{
  "archetype": "...",
  "stabilityLevel": 0,
  "savingLevel": 0,
  "investingLevel": 0,

  "analysisSummary": "...",

  "detectedWeaknesses": [
    {
      "merchant": "",
      "category": "stability"
    }
  ],

  "recurringSubscriptions": [],

  "suggestedGoals": [
    {
      "name": "Engaging RPG Quest Title (ex: '🛡️ Payday Split Challenge')",
      "description": "Clear step-by-step instructions of the task in French or English (ex: 'Move 50$ to your savings chest right after your next income.')",
      "target": 50,
      "category": "stability",
      "difficulty": "easy",
      "duration_days": 7
    },
    {
      "name": "Engaging RPG Quest Title (ex: '☕ Starbucks Swapper')",
      "description": "Clear instructions in French or English (ex: 'Limit Starbucks spending to less than 15$ this week.') - ALWAYS scale down budget targets realistically to fit the weekly duration (e.g., limit fast food to 30$ for 7 days, not a monthly amount of 200$!).",
      "target": 15,
      "category": "saving",
      "difficulty": "medium",
      "duration_days": 7
    },
    {
      "name": "Engaging RPG Quest Title (ex: '📈 Index ETF Starter')",
      "description": "Clear instructions in French or English (ex: 'Open your broker view and research 2 Vanguard ETF shares.')",
      "target": 2,
      "category": "investing",
      "difficulty": "hard",
      "duration_days": 7
    }
  ]
}

Transactions:
${JSON.stringify(transactions, null, 2)}
`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API returned status ${response.status}`);
  }

  const resultData = await response.json();
  const text = resultData.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Empty response from Gemini");
  }

  return JSON.parse(text.trim());
}

function runFallbackAnalysis(transactions: any[]) {
  // Simple rule-based fallback if Gemini API is unavailable
  let foodSpends = 0;
  let retailSpends = 0;
  let savingsTransfers = 0;
  let investingTransfers = 0;

  transactions.forEach((tx) => {
    const name = tx.merchant.toLowerCase();
    const cat = tx.category.toLowerCase();
    const amt = Math.abs(tx.amount);

    if (name.includes("starbucks") || name.includes("uber") || name.includes("restaurant") || cat.includes("food") || cat.includes("dining")) {
      foodSpends += amt;
    }
    if (name.includes("amazon") || name.includes("apparel") || cat.includes("shop") || cat.includes("retail")) {
      retailSpends += amt;
    }
    if (name.includes("savings") || name.includes("virement") || cat.includes("transfer") || cat.includes("saving")) {
      savingsTransfers += amt;
    }
    if (name.includes("etf") || name.includes("broker") || name.includes("crypto") || cat.includes("invest")) {
      investingTransfers += amt;
    }
  });

  let archetype = "The Survivor";
  let stabilityLevel = 1;
  let savingLevel = 1;
  let investingLevel = 0;
  let analysisSummary = "";

  if (foodSpends > 300 || retailSpends > 400) {
    analysisSummary = `🏆 Financial Score
Level 12 Survivor

💪 Biggest Strength
You track your balances carefully and have set up active connections.

⚠️ Biggest XP Leak
Heavy spending on fast food ($${Math.round(foodSpends)} total) and shopping ($${Math.round(retailSpends)} total) are draining your gold coins.

🎯 Main Quest
Unlock Stability. Establish an emergency buffer to shield your character from unexpected damage.

🗡️ Side Quest
Limit Starbucks and Amazon purchases to less than $30 this week.

🎁 Reward
Earn 150 XP and save up to $50.`;
    archetype = "The Survivor";
    stabilityLevel = 1;
  } else {
    archetype = "The Builder";
    stabilityLevel = 4;
    savingLevel = 3;
    investingLevel = 1;
    analysisSummary = `🏆 Financial Score
Level 20 Builder

💪 Biggest Strength
Your basic daily spending is well-controlled. You are very disciplined with your cash flow.

⚠️ Biggest XP Leak
Lack of automated savings. Leaving cash unallocated leaves you vulnerable to lazy gold decay.

🎯 Main Quest
Unlock Saving. Set up automated deposits to grow your treasury stash by default.

🗡️ Side Quest
Move $20 to your savings chest within 24h after your next income.

🎁 Reward
Unlock 100 XP and build a stronger foundation.`;
  }

  if (savingsTransfers > 150) {
    savingLevel = 4;
    archetype = "The Saver";
  }
  if (investingTransfers > 50) {
    investingLevel = 3;
    archetype = "The Opportunist";
  }
  if (savingLevel >= 3 && investingLevel >= 3 && stabilityLevel >= 3) {
    archetype = "The Wealth Architect";
  }

  return {
    archetype,
    stabilityLevel,
    savingLevel,
    investingLevel,
    analysisSummary,
    detectedWeaknesses: [
      { merchant: "Starbucks", category: "saving" },
      { merchant: "Amazon", category: "stability" }
    ],
    recurringSubscriptions: [
      "Netflix", "Spotify"
    ],
    suggestedGoals: [
      { 
        name: "🛡️ Emergency Shield", 
        description: "Build an emergency buffer of $500 to shield yourself from unexpected damage. Set aside a fixed amount every week until you hit your target.", 
        target: 500, 
        category: "stability",
        difficulty: "easy",
        duration_days: 30
      },
      { 
        name: "☕ Treat Swap Quest", 
        description: "Limit treat spending (Starbucks, snacks, coffee shops) to less than $30 this week. Every dollar saved is XP in your treasury.", 
        target: 30, 
        category: "saving",
        difficulty: "medium",
        duration_days: 7
      },
      { 
        name: "📈 Investment Starter Scrolls", 
        description: "Research 2 index ETFs and decide where you'd allocate $100 of virtual gold. Knowledge is the first step to leveling up your investing skill.", 
        target: 100, 
        category: "investing",
        difficulty: "hard",
        duration_days: 7
      },
    ],
  };
}


