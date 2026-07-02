import type { ChallengePath } from "./challenges";

export type TransactionCategory =
  | "food"
  | "shopping"
  | "transport"
  | "subscriptions"
  | "rent"
  | "entertainment"
  | "online_shopping"
  | "bills"
  | "income"
  | "saving"
  | "investing"
  | "essentials" // legacy
  | "dining"; // legacy

export type Transaction = {
  id: string;
  date: string;
  description: string;
  categoryName: string;
  amount: number;
  category: TransactionCategory;
  isLeak: boolean;
  isSubscription: boolean;
};

export type DecisionChoice = {
  id: string;
  title: string;
  cost: number;
  xpReward: number;
  coinReward: number;
  effect: string;
  badge?: string;
};

export type QuestTransaction = {
  description: string;
  categoryName: string;
  amount: number;
  dateLabel: string;
  impact: string;
  emotion: string;
  isLeak: boolean;
};

export type QuestDetail = {
  day: number;
  path: ChallengePath;
  title: string;
  situation: string;
  difficulty: "Easy" | "Medium" | "Hard";
  goal: string;
  pennyMessage: string;
  leakDetector: string;
  threshold: number;
  thresholdLabel: string;
  thresholdType: "min" | "max";
  recentTransactions: QuestTransaction[];
  choices: DecisionChoice[];
};

// Deterministic seed-based random generator
function createRandom(seedStr: string) {
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(31, h) + seedStr.charCodeAt(i) | 0;
  }
  return function () {
    h = (h + 0x9e3779b9) | 0;
    let z = h;
    z ^= z >>> 16;
    z = Math.imul(z, 0x21f0aa7b);
    z ^= z >>> 15;
    z = Math.imul(z, 0x735a2d97);
    z ^= z >>> 15;
    return (z >>> 0) / 4294967296;
  };
}

export function getScaleFactor(
  stabilityLevel: number,
  savingLevel: number,
  investingLevel: number
): number {
  const stability = stabilityLevel;
  const saving = savingLevel;
  const investing = investingLevel;
  
  const hasHighStability = stability >= 4;
  const hasHighSaving = saving >= 4;
  const hasHighInvesting = investing >= 4;

  let profile = "The Explorer";
  if (stability <= 1 && saving <= 1 && investing <= 1) {
    profile = "The Survivor";
  } else if (hasHighStability && hasHighSaving && hasHighInvesting) {
    profile = "The Wealth Architect";
  } else if (hasHighStability && hasHighSaving && !hasHighInvesting) {
    profile = "The Builder";
  } else if (!hasHighStability && hasHighSaving && hasHighInvesting) {
    profile = "The Opportunist";
  } else if (hasHighStability && !hasHighSaving && hasHighInvesting) {
    profile = "The Strategist";
  } else if (hasHighStability && !hasHighSaving && !hasHighInvesting) {
    profile = "The Stabilizer";
  } else if (!hasHighStability && hasHighSaving && !hasHighInvesting) {
    profile = "The Saver";
  } else if (!hasHighStability && !hasHighSaving && hasHighInvesting) {
    profile = "The Investor";
  }

  switch (profile) {
    case "The Survivor":
      return 1.0; // ex: coffee is $4
    case "The Explorer":
      return 1.25; // ex: coffee is $5
    case "The Saver":
    case "The Stabilizer":
      return 1.5; // ex: coffee is $6
    case "The Builder":
    case "The Strategist":
    case "The Opportunist":
      return 1.75; // ex: coffee is $7
    case "The Wealth Architect":
      return 2.0; // ex: coffee is $8
    default:
      return 1.0;
  }
}

export function generateTransactions(
  userId: number,
  stabilityLevel: number,
  savingLevel: number,
  investingLevel: number
): Transaction[] {
  const seed = `user-${userId}-${stabilityLevel}-${savingLevel}-${investingLevel}`;
  const random = createRandom(seed);
  const factor = getScaleFactor(stabilityLevel, savingLevel, investingLevel);

  const transactions: Transaction[] = [];
  const now = new Date();

  // Helper: Get random date in last 365 days that falls on one of the allowedDays of the week
  // 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday
  const getRandomDateForDayOfWeek = (allowedDays: number[]) => {
    const weeksAgo = Math.floor(random() * 52);
    const targetDay = allowedDays[Math.floor(random() * allowedDays.length)]!;
    const d = new Date(now.getTime());
    d.setDate(d.getDate() - weeksAgo * 7);
    const currentDay = d.getDay();
    const diff = targetDay - currentDay;
    d.setDate(d.getDate() + diff);
    
    // Ensure it's in the past
    if (d.getTime() > now.getTime()) {
      d.setDate(d.getDate() - 7);
    }
    return d.toISOString().split("T")[0] || "";
  };

  const getRoutineDate = (category: TransactionCategory, desc?: string) => {
    let allowedDays = [0, 1, 2, 3, 4, 5, 6]; // default fallback
    const descLower = desc ? desc.toLowerCase() : "";
    
    switch (category) {
      case "income":
        allowedDays = [1, 2]; // Lundi, Mardi (travail)
        break;
      case "transport":
        allowedDays = [1, 2]; // Lundi, Mardi (travail commute)
        break;
      case "food":
        // Monday/Tuesday for work coffee/fast-food, Friday for restaurant
        if (
          descLower.includes("starbucks") || 
          descLower.includes("dunkin") || 
          descLower.includes("mcdonald") || 
          descLower.includes("wendy") || 
          descLower.includes("taco bell") ||
          descLower.includes("panera") ||
          descLower.includes("popeyes") ||
          descLower.includes("chick-fil-a")
        ) {
          allowedDays = [1, 2]; // travail
        } else {
          allowedDays = [5]; // vendredi (restaurant)
        }
        break;
      case "shopping":
      case "online_shopping":
        allowedDays = [6]; // samedi (shopping)
        break;
      case "entertainment":
        allowedDays = [0]; // dimanche (repos)
        break;
      case "subscriptions":
        allowedDays = [0]; // dimanche (repos)
        break;
      case "saving":
      case "investing":
        allowedDays = [0]; // dimanche (repos)
        break;
      case "bills":
        allowedDays = [3, 4]; // Wednesday, Thursday
        break;
    }
    
    return getRandomDateForDayOfWeek(allowedDays);
  };

  let txCounter = 1;
  const generateTxId = () => `tx-${txCounter++}`;

  // 1. Rent: 12 transactions (1 per month, on the 1st of each month)
  const baseRent = 1200 * factor;
  for (let m = 0; m < 12; m++) {
    const rentDate = new Date(now.getFullYear(), now.getMonth() - m, 1);
    transactions.push({
      id: generateTxId(),
      date: rentDate.toISOString().split("T")[0] || "",
      description: "Rent Payment",
      categoryName: "Rent",
      amount: -Math.round(baseRent),
      category: "rent",
      isLeak: false,
      isSubscription: false,
    });
  }

  // 2. Income: 50 transactions
  // - 26 Payroll Deposits (bi-weekly, on Mondays)
  const baseSalary = 2200 * factor;
  for (let w = 0; w < 26; w++) {
    const incomeDate = new Date(now.getTime() - w * 14 * 24 * 60 * 60 * 1000);
    const day = incomeDate.getDay();
    if (day !== 1) {
      incomeDate.setDate(incomeDate.getDate() - (day - 1));
    }
    if (incomeDate.getTime() > now.getTime()) {
      incomeDate.setDate(incomeDate.getDate() - 14);
    }
    transactions.push({
      id: generateTxId(),
      date: incomeDate.toISOString().split("T")[0] || "",
      description: "Payroll Deposit",
      categoryName: "Income",
      amount: Math.round(baseSalary),
      category: "income",
      isLeak: false,
      isSubscription: false,
    });
  }
  // - 24 Freelance or other incomes
  const incomeMerchants = ["Freelance Payment", "DoorDash Earnings", "Uber Eats Earnings", "Cashback Reward", "Tax Refund", "Interest Payment"];
  for (let i = 0; i < 24; i++) {
    const desc = incomeMerchants[Math.floor(random() * incomeMerchants.length)]!;
    let amount = 0;
    if (desc.includes("Refund")) amount = 400 * factor;
    else if (desc.includes("Earnings")) amount = (50 + random() * 100) * factor;
    else if (desc.includes("Freelance")) amount = (150 + random() * 300) * factor;
    else if (desc.includes("Interest")) amount = 1 + random() * 10;
    else amount = (5 + random() * 20) * factor;

    transactions.push({
      id: generateTxId(),
      date: getRoutineDate("income", desc),
      description: desc,
      categoryName: "Income",
      amount: Math.round(amount * 100) / 100,
      category: "income",
      isLeak: false,
      isSubscription: false,
    });
  }

  // 3. Subscriptions: 100 transactions (e.g. 10 services, generated monthly on Sunday)
  const subs = [
    { name: "Spotify Premium", amount: 10.99 },
    { name: "Netflix", amount: 15.49 },
    { name: "Hulu", amount: 14.99 },
    { name: "Disney+", amount: 13.99 },
    { name: "YouTube Premium", amount: 13.99 },
    { name: "Apple Music", amount: 10.99 },
    { name: "ChatGPT Plus", amount: 20.00 },
    { name: "iCloud+", amount: 2.99 },
    { name: "Xbox Game Pass", amount: 16.99 },
    { name: "PlayStation Plus", amount: 14.99 }
  ];
  for (let s = 0; s < 100; s++) {
    const service = subs[s % subs.length]!;
    const monthsAgo = Math.floor(s / subs.length);
    const subDate = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 5 + (s % 20));
    const day = subDate.getDay();
    if (day !== 0) {
      subDate.setDate(subDate.getDate() - day);
    }
    if (subDate.getTime() > now.getTime()) {
      subDate.setDate(subDate.getDate() - 7);
    }
    transactions.push({
      id: generateTxId(),
      date: subDate.toISOString().split("T")[0] || "",
      description: service.name,
      categoryName: "Subscriptions",
      amount: -service.amount,
      category: "subscriptions",
      isLeak: false,
      isSubscription: true,
    });
  }

  // Helper to generate remaining transactions
  const addCategoryTransactions = (
    category: TransactionCategory,
    categoryName: string,
    merchants: string[],
    count: number,
    minAmount: number,
    maxAmount: number,
    isLeakFunc?: () => boolean
  ) => {
    for (let c = 0; c < count; c++) {
      const desc = merchants[Math.floor(random() * merchants.length)]!;
      const rawAmt = minAmount + random() * (maxAmount - minAmount);
      const amount = -Math.round(rawAmt * factor * 100) / 100;
      transactions.push({
        id: generateTxId(),
        date: getRoutineDate(category, desc),
        description: desc,
        categoryName,
        amount,
        category,
        isLeak: isLeakFunc ? isLeakFunc() : false,
        isSubscription: false,
      });
    }
  };

  // 4. Food & Drinks: 265 transactions (240 + 25 redistributed from rent)
  addCategoryTransactions(
    "food",
    "Food & Drinks",
    ["Starbucks", "Chipotle", "Chick-fil-A", "McDonald's", "Taco Bell", "Dunkin'", "Panera Bread", "Domino's", "Popeyes", "Wendy's"],
    265,
    3.5,
    25,
    () => random() < 0.25
  );

  // 5. Shopping: 200 transactions (180 + 20 redistributed)
  addCategoryTransactions(
    "shopping",
    "Shopping",
    ["Amazon", "Walmart", "Target", "Nike", "Sephora", "Ulta Beauty", "Apple", "Best Buy", "SHEIN", "Etsy"],
    200,
    10,
    150,
    () => random() < 0.2
  );

  // 6. Transport: 133 transactions (120 + 13 redistributed)
  addCategoryTransactions(
    "transport",
    "Transport",
    ["Uber", "Lyft", "Lime", "Bird", "Shell", "Chevron"],
    133,
    3,
    55,
    () => random() < 0.3
  );

  // 7. Entertainment: 90 transactions (80 + 10 redistributed)
  addCategoryTransactions(
    "entertainment",
    "Entertainment",
    ["AMC Theatres", "Ticketmaster", "Steam Games", "Spotify Live"],
    90,
    10,
    90,
    () => random() < 0.15
  );

  // 8. Online Shopping: 60 transactions
  addCategoryTransactions(
    "online_shopping",
    "Online Shopping",
    ["ASOS", "Zara", "Gymshark", "Temu"],
    60,
    10,
    80,
    () => random() < 0.35
  );

  // 9. Bills & P2P: 50 transactions
  addCategoryTransactions(
    "bills",
    "Bills & P2P",
    ["Venmo", "Cash App", "Zelle", "PayPal"],
    50,
    10,
    75
  );

  // 10. Savings & Investing: 40 transactions
  addCategoryTransactions(
    "saving",
    "Savings & Investing",
    ["Vault Savings Transfer", "Robinhood", "Vanguard ETF", "Coinbase Crypto"],
    40,
    10,
    150
  );

  return transactions.sort((a, b) => b.date.localeCompare(a.date));
}

function getRelativeDateLabel(txDateStr: string): string {
  const now = new Date();
  const txDate = new Date(txDateStr);
  const diffTime = now.getTime() - txDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return daysOfWeek[txDate.getDay()] || txDate.toLocaleDateString("en-US", { weekday: "long" });
}

function getQuestTransactionDetails(desc: string, category: string, isLeak: boolean): { impact: string; emotion: string } {
  const lowerDesc = desc.toLowerCase();
  let emotion = "Routine 💳";
  let impact = isLeak ? "Budget Leak detected" : "Normal expense";
  if (lowerDesc.includes("starbucks") || lowerDesc.includes("dunkin") || lowerDesc.includes("coffee") || lowerDesc.includes("latte")) {
    emotion = "Daily habit ☕";
    impact = isLeak ? "Above coffee limit" : "Routine coffee";
  } else if (lowerDesc.includes("uber") || lowerDesc.includes("lyft") || lowerDesc.includes("cab") || lowerDesc.includes("taxi")) {
    emotion = "Convenience 🚗";
    impact = isLeak ? "Surge / taxi leak" : "Commute cost";
  } else if (lowerDesc.includes("mcdonald") || lowerDesc.includes("chipotle") || lowerDesc.includes("wendy") || lowerDesc.includes("burger") || lowerDesc.includes("pizza") || lowerDesc.includes("delivery") || lowerDesc.includes("eats")) {
    emotion = isLeak ? "Impulse 🍔" : "Quick snack 🍟";
    impact = isLeak ? "Delivery fee leak" : "Comfort food";
  } else if (lowerDesc.includes("sushi") || lowerDesc.includes("restaurant") || lowerDesc.includes("diner")) {
    emotion = "Splurge 🍣";
    impact = isLeak ? "High-end dining leak" : "Social meal";
  } else if (lowerDesc.includes("spotify") || lowerDesc.includes("netflix") || lowerDesc.includes("hulu") || lowerDesc.includes("disney") || lowerDesc.includes("youtube") || lowerDesc.includes("chatgpt")) {
    emotion = "TV/Music 🎵";
    impact = isLeak ? "Unused sub leak" : "Monthly charge";
  } else if (lowerDesc.includes("amazon") || lowerDesc.includes("walmart") || lowerDesc.includes("target") || lowerDesc.includes("zara") || lowerDesc.includes("nike") || lowerDesc.includes("asos") || lowerDesc.includes("temu") || lowerDesc.includes("shein")) {
    emotion = isLeak ? "Shopping spree 🛍️" : "Retail buy 📦";
    impact = isLeak ? "Impulse retail leak" : "Standard shopping";
  } else if (lowerDesc.includes("coinbase") || lowerDesc.includes("crypto") || lowerDesc.includes("robinhood") || lowerDesc.includes("hype stock")) {
    emotion = "Speculation 🚀";
    impact = isLeak ? "FOMO crypto buy" : "Asset investment";
  } else if (lowerDesc.includes("savings") || lowerDesc.includes("vanguard") || lowerDesc.includes("etf")) {
    emotion = "Future planning 📈";
    impact = "Emergency reserves";
  } else if (lowerDesc.includes("gym") || lowerDesc.includes("fitness")) {
    emotion = "Gym 🏋️";
    impact = isLeak ? "Low utilization sub" : "Health investment";
  }
  return { impact, emotion };
}

function getPathDayCategories(path: ChallengePath, day: number): TransactionCategory[] {
  if (path === "stability") {
    if (day === 0 || day === 1 || day === 2) return ["food", "transport"];
    if (day === 3) return ["food", "shopping"];
  } else if (path === "saving") {
    if (day === 0) return ["subscriptions"];
    if (day === 1) return ["shopping"];
    if (day === 2) return ["entertainment", "subscriptions"];
    if (day === 3) return ["shopping", "entertainment"];
  } else if (path === "investing") {
    if (day === 0) return ["saving", "entertainment"];
    if (day === 1) return ["saving", "food"];
    if (day === 2) return ["shopping", "transport"];
    if (day === 3) return ["shopping", "entertainment"];
  }
  return ["food", "shopping"];
}

function generateChoicesFromTransactions(
  transactions: Transaction[],
  path: ChallengePath,
  day: number,
  scaleFactor: number
): DecisionChoice[] {
  const choices: DecisionChoice[] = [];
  const targetCategories = getPathDayCategories(path, day);
  const filtered = transactions
    .filter((tx) => targetCategories.includes(tx.category) && tx.amount < 0)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  filtered.forEach((tx, idx) => {
    const desc = tx.description;
    const amount = Math.abs(tx.amount);
    const descLower = desc.toLowerCase();
    
    // Generate GOOD choice
    if (idx < 3) {
      let goodChoice: DecisionChoice;
      if (descLower.includes("starbucks") || descLower.includes("dunkin") || descLower.includes("coffee") || descLower.includes("latte")) {
        goodChoice = {
          id: `good_coffee_${tx.id}`,
          title: `Brew coffee at home instead of ${desc}`,
          cost: Math.round(0.50 * scaleFactor * 10) / 10,
          xpReward: 30,
          coinReward: 5,
          effect: "Budget Health ↑",
          badge: "Coffee Maker"
        };
      } else if (descLower.includes("uber") || descLower.includes("lyft") || descLower.includes("cab") || descLower.includes("taxi")) {
        goodChoice = {
          id: `good_transit_${tx.id}`,
          title: `Take public transit instead of ${desc}`,
          cost: Math.round(2.50 * scaleFactor * 10) / 10,
          xpReward: 35,
          coinReward: 10,
          effect: "Commute Health ↑",
          badge: "Transit Rider"
        };
      } else if (descLower.includes("mcdonald") || descLower.includes("chipotle") || descLower.includes("wendy") || descLower.includes("burger") || descLower.includes("pizza") || descLower.includes("delivery") || descLower.includes("eats") || descLower.includes("lunch")) {
        goodChoice = {
          id: `good_lunch_${tx.id}`,
          title: `Pack a home-cooked meal instead of ${desc}`,
          cost: Math.round(4.00 * scaleFactor * 10) / 10,
          xpReward: 40,
          coinReward: 10,
          effect: "Budget Health ↑",
          badge: "Meal Prepper"
        };
      } else if (descLower.includes("sushi") || descLower.includes("restaurant") || descLower.includes("dining") || descLower.includes("diner")) {
        goodChoice = {
          id: `good_diner_${tx.id}`,
          title: `Grab a standard diner special instead of ${desc}`,
          cost: Math.round(12.00 * scaleFactor * 10) / 10,
          xpReward: 40,
          coinReward: 10,
          effect: "Social Life ↑",
          badge: "Smart Diner"
        };
      } else if (tx.category === "subscriptions") {
        goodChoice = {
          id: `good_sub_${tx.id}`,
          title: `Cancel or downgrade ${desc} to basic plan`,
          cost: Math.round(6.99 * scaleFactor * 10) / 10,
          xpReward: 45,
          coinReward: 15,
          effect: "Sub Health ↑",
          badge: "Sub Auditor"
        };
      } else if (tx.category === "shopping" || tx.category === "online_shopping") {
        goodChoice = {
          id: `good_shop_${tx.id}`,
          title: `Buy standard or thrift alternative instead of ${desc}`,
          cost: Math.round((amount * 0.3) * 10) / 10,
          xpReward: 40,
          coinReward: 10,
          effect: "Utility Health ↑",
          badge: "Smart Shopper"
        };
      } else if (tx.category === "saving" || tx.category === "investing") {
        goodChoice = {
          id: `good_invest_${tx.id}`,
          title: `Allocate to safe broad Index ETF instead of ${desc}`,
          cost: Math.round((amount * 0.4) * 10) / 10,
          xpReward: 50,
          coinReward: 15,
          effect: "Asset Growth ↑",
          badge: "Index Investor"
        };
      } else {
        goodChoice = {
          id: `good_generic_${tx.id}`,
          title: `Opt for budget-friendly option instead of ${desc}`,
          cost: Math.round((amount * 0.25) * 10) / 10,
          xpReward: 30,
          coinReward: 5,
          effect: "Budget Health ↑"
        };
      }
      choices.push(goodChoice);
    }
    
    // Generate BAD choice
    if (idx < 2) {
      let badChoice: DecisionChoice;
      if (descLower.includes("starbucks") || descLower.includes("dunkin") || descLower.includes("coffee") || descLower.includes("latte")) {
        badChoice = {
          id: `bad_coffee_${tx.id}`,
          title: `Order premium delivery from ${desc}`,
          cost: amount,
          xpReward: 10,
          coinReward: 0,
          effect: "Wallet Damage ↓"
        };
      } else if (descLower.includes("uber") || descLower.includes("lyft") || descLower.includes("cab") || descLower.includes("taxi")) {
        badChoice = {
          id: `bad_transit_${tx.id}`,
          title: `Take surge ride with ${desc}`,
          cost: amount,
          xpReward: 10,
          coinReward: 0,
          effect: "Wallet Damage ↓"
        };
      } else if (descLower.includes("spotify") || descLower.includes("netflix") || descLower.includes("hulu") || descLower.includes("disney") || descLower.includes("youtube") || descLower.includes("chatgpt") || tx.category === "subscriptions") {
        badChoice = {
          id: `bad_sub_${tx.id}`,
          title: `Maintain premium ad-free plan for ${desc}`,
          cost: amount,
          xpReward: 10,
          coinReward: 0,
          effect: "Wallet Damage ↓"
        };
      } else if (tx.category === "shopping" || tx.category === "online_shopping") {
        badChoice = {
          id: `bad_shop_${tx.id}`,
          title: `Purchase premium item: ${desc}`,
          cost: amount,
          xpReward: 10,
          coinReward: 0,
          effect: "Wallet Damage ↓"
        };
      } else if (tx.category === "saving" || tx.category === "investing") {
        badChoice = {
          id: `bad_invest_${tx.id}`,
          title: `FOMO speculate on volatile ${desc}`,
          cost: amount,
          xpReward: 10,
          coinReward: 0,
          effect: "Wallet Damage ↓"
        };
      } else {
        badChoice = {
          id: `bad_generic_${tx.id}`,
          title: `Keep luxury option for ${desc}`,
          cost: amount,
          xpReward: 10,
          coinReward: 0,
          effect: "Wallet Damage ↓"
        };
      }
      choices.push(badChoice);
    }
  });

  while (choices.length < 5) {
    const isGood = choices.filter(c => c.coinReward > 0).length < 3;
    if (isGood) {
      choices.unshift({
        id: `fallback_good_${choices.length}`,
        title: "Opt for a home-cooked standard meal",
        cost: Math.round(5.00 * scaleFactor * 10) / 10,
        xpReward: 30,
        coinReward: 5,
        effect: "Budget Health ↑"
      });
    } else {
      choices.push({
        id: `fallback_bad_${choices.length}`,
        title: "Order gourmet restaurant takeout delivery",
        cost: Math.round(25.00 * scaleFactor * 10) / 10,
        xpReward: 10,
        coinReward: 0,
        effect: "Wallet Damage ↓"
      });
    }
  }
  
  return choices;
}

// Generate the fully structured Daily Quest with Decision Matrix based on user and day
export function getDailyQuestDetail(
  path: ChallengePath,
  day: number,
  userName: string,
  userId: number = 1,
  stabilityLevel: number = 3,
  savingLevel: number = 3,
  investingLevel: number = 3
): QuestDetail {
  const maxAvailableDay = 3;
  const clampedDay = Math.min(Math.max(day, 0), maxAvailableDay);

  const matrices: Record<ChallengePath, Record<number, Omit<QuestDetail, "day" | "path">>> = {
    stability: {
      0: {
        title: "Food & Commute Routine",
        situation: "Managing your standard daily nutrition and travel.",
        difficulty: "Easy",
        goal: "Stay under your daily lifestyle spending limit",
        pennyMessage: `Hey ${userName}! Penny here. Everyday coffee runs and convenience rides add up fast. Let's look at standard options vs premium upgrades today.`,
        leakDetector: "Snacking & commute spending is 28% above your target level.",
        threshold: 25.0,
        thresholdLabel: "Max Daily Nutrition & Commute Budget",
        thresholdType: "max",
        recentTransactions: [
          { description: "Starbucks Latte", categoryName: "Food & Drinks", amount: 4.00, dateLabel: "Today", impact: "28% above coffee limit", emotion: "Daily habit ☕", isLeak: true },
          { description: "Uber Commute", categoryName: "Transport", amount: 15.00, dateLabel: "Yesterday", impact: "Commute cost", emotion: "Convenience 🚗", isLeak: true },
          { description: "McDonald's", categoryName: "Food & Drinks", amount: 10.00, dateLabel: "Monday", impact: "Quick snack", emotion: "Comfort 🍟", isLeak: false },
        ],
        choices: [
          {
            id: "home_brew",
            title: "Brew coffee at home",
            cost: 0.50,
            xpReward: 30,
            coinReward: 5,
            effect: "Budget Health ↑",
            badge: "Coffee Maker",
          },
          {
            id: "public_transit",
            title: "Take the city subway commute",
            cost: 2.50,
            xpReward: 35,
            coinReward: 10,
            effect: "Commute Health ↑",
            badge: "Transit Rider",
          },
          {
            id: "cook_lunch",
            title: "Pack a home-cooked lunch box",
            cost: 4.00,
            xpReward: 40,
            coinReward: 10,
            effect: "Budget Health ↑",
            badge: "Meal Prepper",
          },
          {
            id: "premium_latte",
            title: "Order premium Starbucks & pastry delivery",
            cost: 12.00,
            xpReward: 10,
            coinReward: 0,
            effect: "Wallet Damage ↓",
          },
          {
            id: "rideshare_surge",
            title: "Take an Uber commute during surge pricing",
            cost: 22.00,
            xpReward: 10,
            coinReward: 0,
            effect: "Wallet Damage ↓",
          },
        ],
      },
      1: {
        title: "Evening Choices",
        situation: "Deciding on dinner and getting home after a long day.",
        difficulty: "Medium",
        goal: "Protect your food and travel budget",
        pennyMessage: `Hey ${userName}! After a long day, it's easy to order takeout on autopilot. Let's balance comfort and cost!`,
        leakDetector: "Food delivery is 35% above your profile target.",
        threshold: 30.0,
        thresholdLabel: "Max Dinner & Transport Budget",
        thresholdType: "max",
        recentTransactions: [
          { description: "UberEats Delivery", categoryName: "Food & Drinks", amount: 32.00, dateLabel: "Today", impact: "35% above food target", emotion: "Impulse 🍔", isLeak: true },
          { description: "Target Shopping", categoryName: "Shopping", amount: 85.00, dateLabel: "Yesterday", impact: "Impulse retail", emotion: "Insta-cart 📦", isLeak: true },
          { description: "Starbucks", categoryName: "Food & Drinks", amount: 7.50, dateLabel: "Monday", impact: "Daily spend", emotion: "Comfort ☕", isLeak: false },
        ],
        choices: [
          {
            id: "cook_pasta",
            title: "Cook a simple pasta dinner at home",
            cost: 3.00,
            xpReward: 40,
            coinReward: 10,
            effect: "Budget Health ↑",
            badge: "Home Chef",
          },
          {
            id: "metro_ride",
            title: "Ride the evening metro line home",
            cost: 2.75,
            xpReward: 30,
            coinReward: 5,
            effect: "Commute Health ~",
            badge: "Subway Native",
          },
          {
            id: "stream_movie",
            title: "Stream a standard definition movie",
            cost: 3.99,
            xpReward: 20,
            coinReward: 5,
            effect: "Leisure OK ~",
          },
          {
            id: "burger_delivery",
            title: "Order late-night burger & fries delivery",
            cost: 26.00,
            xpReward: 10,
            coinReward: 0,
            effect: "Wallet Damage ↓",
          },
          {
            id: "premium_taxi",
            title: "Call a premium rideshare taxi home",
            cost: 20.00,
            xpReward: 10,
            coinReward: 0,
            effect: "Wallet Damage ↓",
          },
        ],
      },
      2: {
        title: "Mid-Week Socials",
        situation: "Catching up with colleagues or friends during the week.",
        difficulty: "Easy",
        goal: "Find a balance during social activities",
        pennyMessage: `Hey ${userName}! Socializing is important, but fancy dinners and drinks can wipe out your wallet. Let's find a balance!`,
        leakDetector: "Dining and transport are 42% above your target.",
        threshold: 35.0,
        thresholdLabel: "Max Social & Dining Budget",
        thresholdType: "max",
        recentTransactions: [
          { description: "Sushi Dinner", categoryName: "Food & Drinks", amount: 45.00, dateLabel: "Today", impact: "45% above food target", emotion: "Splurge 🍣", isLeak: true },
          { description: "Electric Bike Rent", categoryName: "Transport", amount: 3.50, dateLabel: "Yesterday", impact: "Green transport", emotion: "Active 🚲", isLeak: false },
          { description: "Metro commute", categoryName: "Transport", amount: 2.50, dateLabel: "Monday", impact: "Routine commute", emotion: "Transport 🚇", isLeak: false },
        ],
        choices: [
          {
            id: "diner_special",
            title: "Grab a standard diner special meal",
            cost: 12.00,
            xpReward: 40,
            coinReward: 10,
            effect: "Social Life ↑",
            badge: "Smart Diner",
          },
          {
            id: "ebike_share",
            title: "Rent a city e-bike for commute",
            cost: 3.50,
            xpReward: 30,
            coinReward: 5,
            effect: "Commute Health ↑",
            badge: "Eco Rider",
          },
          {
            id: "energy_drink",
            title: "Buy a basic energy drink",
            cost: 2.50,
            xpReward: 15,
            coinReward: 0,
            effect: "Energy Up ~",
          },
          {
            id: "sushi_splurge",
            title: "Go to a high-end sushi lounge",
            cost: 45.00,
            xpReward: 10,
            coinReward: 0,
            effect: "Wallet Damage ↓",
          },
          {
            id: "taxi_rain",
            title: "Take a rain-express taxi cab",
            cost: 18.00,
            xpReward: 10,
            coinReward: 0,
            effect: "Wallet Damage ↓",
          },
        ],
      },
      3: {
        title: "Weekend Prep",
        situation: "Getting groceries and planning weekend travel.",
        difficulty: "Hard",
        goal: "Avoid weekend shopping cart splurges",
        pennyMessage: `Hey ${userName}! Weekend shopping trips and delivery fees are stealthy budget killers. Let's stick to the basics!`,
        leakDetector: "Shopping retail is 50% above your budget profile.",
        threshold: 45.0,
        thresholdLabel: "Max Grocery & Travel Budget",
        thresholdType: "max",
        recentTransactions: [
          { description: "Gourmet delivery", categoryName: "Food & Drinks", amount: 48.00, dateLabel: "Today", impact: "50% above food target", emotion: "Gourmet 🥩", isLeak: true },
          { description: "ASOS Online cart", categoryName: "Shopping", amount: 55.00, dateLabel: "Yesterday", impact: "Clothing splurge", emotion: "Shopping 🛍️", isLeak: true },
          { description: "Local grocery run", categoryName: "Food & Drinks", amount: 22.00, dateLabel: "Monday", impact: "Basic groceries", emotion: "Healthy 🥦", isLeak: false },
        ],
        choices: [
          {
            id: "basic_groceries",
            title: "Buy basic weekly pantry groceries",
            cost: 28.00,
            xpReward: 50,
            coinReward: 15,
            effect: "Grocery Stock ↑",
            badge: "Pantry Master",
          },
          {
            id: "transit_pass",
            title: "Get a standard 1-day transit pass",
            cost: 5.00,
            xpReward: 30,
            coinReward: 5,
            effect: "Commute Pass ↑",
            badge: "Transit Saver",
          },
          {
            id: "pharmacy_copay",
            title: "Pick up basic pharmacy prescription",
            cost: 10.00,
            xpReward: 25,
            coinReward: 5,
            effect: "Health Shield ↑",
          },
          {
            id: "gourmet_delivery",
            title: "Order instant gourmet grocery delivery",
            cost: 48.00,
            xpReward: 10,
            coinReward: 0,
            effect: "Wallet Damage ↓",
          },
          {
            id: "apparel_spree",
            title: "Add trendy online apparel to your cart",
            cost: 55.00,
            xpReward: 10,
            coinReward: 0,
            effect: "Wallet Damage ↓",
          },
        ],
      },
    },
    saving: {
      0: {
        title: "Digital Subscriptions Audit",
        situation: "Reviewing your active streaming and app subscriptions.",
        difficulty: "Easy",
        goal: "Audit duplicate subscriptions and control costs",
        pennyMessage: `Hey ${userName}! Subscription billing runs in the background. Auditing unused tiers and opting for standard plans is an easy win!`,
        leakDetector: "Subscription leakage detected: $22.99/mo.",
        threshold: 20.0,
        thresholdLabel: "Max Subscriptions & Media Budget",
        thresholdType: "max",
        recentTransactions: [
          { description: "Spotify Premium", categoryName: "Subscriptions", amount: 10.99, dateLabel: "Today", impact: "Monthly charge", emotion: "Music 🎵", isLeak: false },
          { description: "Netflix Premium", categoryName: "Subscriptions", amount: 22.99, dateLabel: "Yesterday", impact: "Unused sub", emotion: "TV 📺", isLeak: true },
          { description: "Amazon checkout", categoryName: "Shopping", amount: 45.00, dateLabel: "Monday", impact: "Impulse gadget", emotion: "Shopping 📦", isLeak: true },
        ],
        choices: [
          {
            id: "base_streaming",
            title: "Keep base ad-supported streaming plan",
            cost: 6.99,
            xpReward: 40,
            coinReward: 10,
            effect: "Sub Health ↑",
            badge: "Sub Auditor",
          },
          {
            id: "cloud_storage",
            title: "Maintain basic iCloud storage plan",
            cost: 2.99,
            xpReward: 30,
            coinReward: 5,
            effect: "Data Health ~",
            badge: "Byte Saver",
          },
          {
            id: "library_book",
            title: "Borrow a book from the local library",
            cost: 0.00,
            xpReward: 40,
            coinReward: 10,
            effect: "Leisure Score ↑",
            badge: "Bookworm",
          },
          {
            id: "premium_streaming",
            title: "Upgrade to premium ad-free streaming bundle",
            cost: 24.99,
            xpReward: 10,
            coinReward: 0,
            effect: "Wallet Damage ↓",
          },
          {
            id: "gaming_sub",
            title: "Subscribe to a premium gaming pass",
            cost: 16.99,
            xpReward: 10,
            coinReward: 0,
            effect: "Wallet Damage ↓",
          },
        ],
      },
      1: {
        title: "Shopping & Lifestyle Leaks",
        situation: "Buying everyday tech and lifestyle items.",
        difficulty: "Easy",
        goal: "Distinguish between everyday needs and retail wants",
        pennyMessage: `Hey ${userName}! Impulse shopping online is too easy with one-click checkouts. Let's distinguish between needs and wants!`,
        leakDetector: "Shopping retail is 30% above your safety target.",
        threshold: 40.0,
        thresholdLabel: "Max Shopping & Retail Budget",
        thresholdType: "max",
        recentTransactions: [
          { description: "Target shopping", categoryName: "Shopping", amount: 55.00, dateLabel: "Today", impact: "30% above retail limit", emotion: "Impulse 🛍️", isLeak: true },
          { description: "Starbucks latte", categoryName: "Food & Drinks", amount: 6.50, dateLabel: "Yesterday", impact: "Coffee upgrade", emotion: "Routine ☕", isLeak: false },
          { description: "iCloud+ storage", categoryName: "Subscriptions", amount: 2.99, dateLabel: "Monday", impact: "Storage tier", emotion: "Cloud ☁️", isLeak: false },
        ],
        choices: [
          {
            id: "basic_cable",
            title: "Buy a standard replacement charging cable",
            cost: 12.00,
            xpReward: 35,
            coinReward: 10,
            effect: "Utility Health ↑",
            badge: "Device Keeper",
          },
          {
            id: "hygiene_supplies",
            title: "Pick up basic personal hygiene supplies",
            cost: 15.00,
            xpReward: 30,
            coinReward: 5,
            effect: "Hygiene Health ↑",
            badge: "Care Organizer",
          },
          {
            id: "loose_tea",
            title: "Brew loose leaf tea at home",
            cost: 1.00,
            xpReward: 25,
            coinReward: 5,
            effect: "Budget Health ↑",
          },
          {
            id: "smart_gadget",
            title: "Purchase an impulse smart-home gadget",
            cost: 35.00,
            xpReward: 10,
            coinReward: 0,
            effect: "Wallet Damage ↓",
          },
          {
            id: "designer_tee",
            title: "Order a trendy designer t-shirt online",
            cost: 45.00,
            xpReward: 10,
            coinReward: 0,
            effect: "Wallet Damage ↓",
          },
        ],
      },
      2: {
        title: "Leisure & Entertainment",
        situation: "Planning a movie night or workout routine.",
        difficulty: "Medium",
        goal: "Avoid luxury seating and subscription extras",
        pennyMessage: `Hey ${userName}! Gym memberships and tickets are great, but are we overpaying for premium upgrades we don't use?`,
        leakDetector: "Entertainment and transport are 35% above target.",
        threshold: 30.0,
        thresholdLabel: "Max Leisure & Activity Budget",
        thresholdType: "max",
        recentTransactions: [
          { description: "VIP Cinema seat", categoryName: "Entertainment", amount: 28.00, dateLabel: "Today", impact: "Movie ticket upgrade", emotion: "Luxury 🎬", isLeak: true },
          { description: "Uber commute", categoryName: "Transport", amount: 18.00, dateLabel: "Yesterday", impact: "Ride home", emotion: "Transport 🚗", isLeak: true },
          { description: "Local gym billing", categoryName: "Subscriptions", amount: 45.00, dateLabel: "Monday", impact: "Low utilization", emotion: "Gym 🏋️", isLeak: true },
        ],
        choices: [
          {
            id: "movie_ticket",
            title: "Buy a standard movie theatre ticket",
            cost: 14.00,
            xpReward: 40,
            coinReward: 10,
            effect: "Social Score ↑",
            badge: "Moviegoer",
          },
          {
            id: "park_pass",
            title: "Get a local park entry pass",
            cost: 5.00,
            xpReward: 35,
            coinReward: 10,
            effect: "Health Score ↑",
            badge: "Nature Walker",
          },
          {
            id: "grocery_snacks",
            title: "Buy movie theater snacks at a grocery store",
            cost: 3.00,
            xpReward: 20,
            coinReward: 5,
            effect: "Snack Budget ↑",
          },
          {
            id: "vip_seating",
            title: "Upgrade to premium VIP lounge seating",
            cost: 28.00,
            xpReward: 10,
            coinReward: 0,
            effect: "Wallet Damage ↓",
          },
          {
            id: "fitness_club",
            title: "Sign up for a luxury fitness club trial",
            cost: 39.00,
            xpReward: 10,
            coinReward: 0,
            effect: "Wallet Damage ↓",
          },
        ],
      },
      3: {
        title: "Weekend Activities",
        situation: "Choosing how to spend Saturday afternoon.",
        difficulty: "Hard",
        goal: "Steer clear of shopping hauls and ticket markups",
        pennyMessage: `Hey ${userName}! Weekends tempt us to splurge on shopping carts. Stick to standard activities and keep your savings safe!`,
        leakDetector: "Weekend spending is 40% above your target.",
        threshold: 50.0,
        thresholdLabel: "Max Weekend Activity Budget",
        thresholdType: "max",
        recentTransactions: [
          { description: "Zara checkout", categoryName: "Shopping", amount: 65.00, dateLabel: "Today", impact: "Fast-fashion haul", emotion: "Shopping 🛍️", isLeak: true },
          { description: "Spotify billing", categoryName: "Subscriptions", amount: 10.99, dateLabel: "Yesterday", impact: "Routine charge", emotion: "Music 🎵", isLeak: false },
          { description: "Diner lunch", categoryName: "Food & Drinks", amount: 15.00, dateLabel: "Monday", impact: "Social lunch", emotion: "Food 🍔", isLeak: false },
        ],
        choices: [
          {
            id: "thrift_apparel",
            title: "Buy vintage thrift store apparel",
            cost: 18.00,
            xpReward: 50,
            coinReward: 15,
            effect: "Wardrobe Score ↑",
            badge: "Thrift Hunter",
          },
          {
            id: "cafe_coffee",
            title: "Have a standard coffee & snack with a friend",
            cost: 8.50,
            xpReward: 40,
            coinReward: 10,
            effect: "Social Score ↑",
            badge: "Social Saver",
          },
          {
            id: "museum_day",
            title: "Walk to a local museum on free entry day",
            cost: 0.00,
            xpReward: 50,
            coinReward: 15,
            effect: "Culture Score ↑",
            badge: "Culture Buff",
          },
          {
            id: "mall_spree",
            title: "Go on a fast-fashion mall shopping haul",
            cost: 65.00,
            xpReward: 10,
            coinReward: 0,
            effect: "Wallet Damage ↓",
          },
          {
            id: "lastminute_concert",
            title: "Buy a last-minute ticket to a concert",
            cost: 75.00,
            xpReward: 10,
            coinReward: 0,
            effect: "Wallet Damage ↓",
          },
        ],
      },
    },
    investing: {
      0: {
        title: "Cash Reserves vs Speculation",
        situation: "Allocating cash between everyday safety and hype investments.",
        difficulty: "Easy",
        goal: "Secure basic needs before speculating on meme coins",
        pennyMessage: `Hey ${userName}! Before throwing cash at speculative assets, we must secure our standard needs and emergency buffer!`,
        leakDetector: "Speculative transfers are 60% above target index.",
        threshold: 30.0,
        thresholdLabel: "Max Discretionary Allocations Budget",
        thresholdType: "max",
        recentTransactions: [
          { description: "CoinBase crypto buy", categoryName: "Savings & Investing", amount: 50.00, dateLabel: "Today", impact: "Memecoin pump", emotion: "Speculation 🚀", isLeak: true },
          { description: "Shell Gas station", categoryName: "Transport", amount: 45.00, dateLabel: "Yesterday", impact: "Fuel refill", emotion: "Transport ⛽", isLeak: false },
          { description: "McDonald's run", categoryName: "Food & Drinks", amount: 12.00, dateLabel: "Monday", impact: "Quick dinner", emotion: "Food 🍟", isLeak: false },
        ],
        choices: [
          {
            id: "groceries_refill",
            title: "Restock basic household groceries",
            cost: 18.00,
            xpReward: 40,
            coinReward: 10,
            effect: "Reserves Growth ↑",
            badge: "Larder Builder",
          },
          {
            id: "transit_card_topup",
            title: "Top up your daily transit card",
            cost: 5.00,
            xpReward: 30,
            coinReward: 5,
            effect: "Transit Credit ↑",
            badge: "Card Refiller",
          },
          {
            id: "cash_deposit",
            title: "Deposit small cash into checking account",
            cost: 0.00,
            xpReward: 25,
            coinReward: 5,
            effect: "Cash Safety ↑",
            badge: "Liquid Safe",
          },
          {
            id: "altcoin_fomo",
            title: "Speculate on a trending meme altcoin",
            cost: 40.00,
            xpReward: 10,
            coinReward: 0,
            effect: "Wallet Damage ↓",
          },
          {
            id: "lootbox_skin",
            title: "Purchase a gaming loot box / skin package",
            cost: 15.00,
            xpReward: 10,
            coinReward: 0,
            effect: "Wallet Damage ↓",
          },
        ],
      },
      1: {
        title: "Stock Market Allocation",
        situation: "Managing cash flow for future investments.",
        difficulty: "Easy",
        goal: "Fund your stock ETF index and grab a standard lunch",
        pennyMessage: `Hey ${userName}! Investing is a standard habit, but we must protect our checking account from lifestyle leaks to fund it.`,
        leakDetector: "Checking cash buffer is 18% below target.",
        threshold: 35.0,
        thresholdLabel: "Max Asset & Food Budget",
        thresholdType: "max",
        recentTransactions: [
          { description: "Hype tech share", categoryName: "Savings & Investing", amount: 65.00, dateLabel: "Today", impact: "FOMO buying", emotion: "Speculation 📈", isLeak: true },
          { description: "Netflix sub", categoryName: "Subscriptions", amount: 15.49, dateLabel: "Yesterday", impact: "Monthly bill", emotion: "TV 📺", isLeak: false },
          { description: "Starbucks run", categoryName: "Food & Drinks", amount: 7.00, dateLabel: "Monday", impact: "Coffee run", emotion: "Coffee ☕", isLeak: false },
        ],
        choices: [
          {
            id: "index_etf",
            title: "Buy fractional shares of a broad index ETF",
            cost: 15.00,
            xpReward: 50,
            coinReward: 15,
            effect: "Asset Growth ↑",
            badge: "Index Investor",
          },
          {
            id: "deli_lunch",
            title: "Grab a standard local deli lunch special",
            cost: 10.00,
            xpReward: 30,
            coinReward: 5,
            effect: "Energy Level ↑",
            badge: "Smart Eater",
          },
          {
            id: "walk_office",
            title: "Walk back to office after lunch",
            cost: 0.00,
            xpReward: 25,
            coinReward: 5,
            effect: "Transit Savings ↑",
            badge: "Active Commuter",
          },
          {
            id: "hype_stock",
            title: "Buy a volatile meme stock at peak price",
            cost: 45.00,
            xpReward: 10,
            coinReward: 0,
            effect: "Wallet Damage ↓",
          },
          {
            id: "sushi_delivery",
            title: "Order premium sushi delivery with high fees",
            cost: 35.00,
            xpReward: 10,
            coinReward: 0,
            effect: "Wallet Damage ↓",
          },
        ],
      },
      2: {
        title: "Tech & Subscriptions",
        situation: "Deciding on hardware and app services.",
        difficulty: "Medium",
        goal: "Purchase standard work tools and avoid overpricing",
        pennyMessage: `Hey ${userName}! Work and study require standard tech setups. Avoid over-spec'd gadgets that drain your funds!`,
        leakDetector: "Accessory spending is 45% above your profile target.",
        threshold: 45.0,
        thresholdLabel: "Max Tech & Commute Budget",
        thresholdType: "max",
        recentTransactions: [
          { description: "Smartwatch band", categoryName: "Shopping", amount: 35.00, dateLabel: "Today", impact: "Luxury band", emotion: "Accessory ⌚", isLeak: true },
          { description: "Metro commute", categoryName: "Transport", amount: 2.50, dateLabel: "Yesterday", impact: "Routine commute", emotion: "Transport 🚇", isLeak: false },
          { description: "Pizza night", categoryName: "Food & Drinks", amount: 18.00, dateLabel: "Monday", impact: "Quick meal", emotion: "Food 🍕", isLeak: false },
        ],
        choices: [
          {
            id: "app_license",
            title: "Pay for a standard productivity app license",
            cost: 15.00,
            xpReward: 40,
            coinReward: 10,
            effect: "Tool Quality ↑",
            badge: "Pro Worker",
          },
          {
            id: "train_ticket",
            title: "Buy a standard commuter train ticket",
            cost: 8.00,
            xpReward: 30,
            coinReward: 5,
            effect: "Commute Health ↑",
            badge: "Rail Rider",
          },
          {
            id: "brewed_energy",
            title: "Pack a home-brewed energy drink",
            cost: 1.50,
            xpReward: 20,
            coinReward: 5,
            effect: "Focus Score ↑",
          },
          {
            id: "smartwatch_band",
            title: "Purchase an unnecessary luxury smartwatch band",
            cost: 35.00,
            xpReward: 10,
            coinReward: 0,
            effect: "Wallet Damage ↓",
          },
          {
            id: "gadget_warranty",
            title: "Add an overpriced extended gadget warranty",
            cost: 25.00,
            xpReward: 10,
            coinReward: 0,
            effect: "Wallet Damage ↓",
          },
        ],
      },
      3: {
        title: "Emergency & Health",
        situation: "Handling an unexpected minor expense.",
        difficulty: "Hard",
        goal: "Cover standard health expenses and bypass luxury accessories",
        pennyMessage: `Hey ${userName}! When minor emergencies strike, use standard savings reserves. Don't put luxury buys on a credit card!`,
        leakDetector: "Medical buffer utilization is 40% below safety index.",
        threshold: 60.0,
        thresholdLabel: "Max Medical & Travel Budget",
        thresholdType: "max",
        recentTransactions: [
          { description: "Designer apparel", categoryName: "Shopping", amount: 75.00, dateLabel: "Today", impact: "Luxury sunglasses", emotion: "Shopping 🕶️", isLeak: true },
          { description: "Pharmacy copay", categoryName: "Bills", amount: 15.00, dateLabel: "Yesterday", impact: "Prescription fill", emotion: "Health 💊", isLeak: false },
          { description: "Subway lunch", categoryName: "Food & Drinks", amount: 8.50, dateLabel: "Monday", impact: "Quick lunch", emotion: "Food 🥪", isLeak: false },
        ],
        choices: [
          {
            id: "clinic_copay",
            title: "Pay a standard clinic medical co-pay",
            cost: 25.00,
            xpReward: 50,
            coinReward: 15,
            effect: "Body Health ↑",
            badge: "Care Payer",
          },
          {
            id: "prescription_fill",
            title: "Pick up a standard pharmacy prescription",
            cost: 15.00,
            xpReward: 40,
            coinReward: 10,
            effect: "Body Recovery ↑",
            badge: "Recovery Guard",
          },
          {
            id: "transit_home",
            title: "Ride transit back home from the clinic",
            cost: 3.00,
            xpReward: 25,
            coinReward: 5,
            effect: "Wallet Health ~",
          },
          {
            id: "designer_glasses",
            title: "Buy designer branded sunglasses online",
            cost: 75.00,
            xpReward: 10,
            coinReward: 0,
            effect: "Wallet Damage ↓",
          },
          {
            id: "vip_upgrade",
            title: "Pay for a VIP concert ticket upgrade",
            cost: 50.00,
            xpReward: 10,
            coinReward: 0,
            effect: "Wallet Damage ↓",
          },
        ],
      },
    },
  };

  const pathQuests = matrices[path] || matrices.stability;
  const quest = pathQuests[clampedDay] || pathQuests[0]!;

  const scaleFactor = getScaleFactor(stabilityLevel, savingLevel, investingLevel);

  // Generate simulated transactions for the user
  const userTransactions = generateTransactions(userId, stabilityLevel, savingLevel, investingLevel);
  const targetCategories = getPathDayCategories(path, clampedDay);
  
  // Filter for matching categories & sort by date (most recent first)
  const filteredTxs = userTransactions
    .filter((tx) => targetCategories.includes(tx.category) && tx.amount < 0)
    .sort((a, b) => b.date.localeCompare(a.date));

  const dynamicRecentTransactions: QuestTransaction[] = filteredTxs.slice(0, 3).map((tx) => {
    const { impact, emotion } = getQuestTransactionDetails(tx.description, tx.category, tx.isLeak);
    return {
      description: tx.description,
      categoryName: tx.categoryName,
      amount: Math.abs(tx.amount),
      dateLabel: getRelativeDateLabel(tx.date),
      impact,
      emotion,
      isLeak: tx.isLeak,
    };
  });

  const recentTransactions = dynamicRecentTransactions.length >= 3 
    ? dynamicRecentTransactions 
    : quest.recentTransactions.map((tx) => ({
        ...tx,
        amount: Math.round(tx.amount * scaleFactor * 100) / 100,
      }));

  const scaleText = (text: string) => {
    return text.replace(/\$\d+(\.\d+)?/g, (match) => {
      const val = parseFloat(match.slice(1));
      return `$${Math.round(val * scaleFactor)}`;
    });
  };

  const scaledChoices = generateChoicesFromTransactions(userTransactions, path, clampedDay, scaleFactor);

  return {
    day: clampedDay,
    path,
    ...quest,
    title: scaleText(quest.title),
    situation: scaleText(quest.situation),
    pennyMessage: scaleText(quest.pennyMessage),
    threshold: Math.round(quest.threshold * scaleFactor * 100) / 100,
    thresholdLabel: scaleText(quest.thresholdLabel),
    recentTransactions,
    choices: scaledChoices,
  };
}
