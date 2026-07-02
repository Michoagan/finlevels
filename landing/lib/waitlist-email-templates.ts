export type WaitlistEmailTemplate = {
  day: number;
  title: string;
  subject: string;
  previewText: string;
  greeting: string;
  intro: readonly string[];
  lesson: readonly string[];
  challenge: readonly string[];
  currentCtaLabel: string;
  outro: readonly string[];
  signature: string;
};

export const waitlistEmailTemplates: readonly WaitlistEmailTemplate[] = [
  {
    day: 0,
    title: "Welcome to FinLevels 👋",
    subject: "Welcome to FinLevels — Discover Your Financial Profile",
    previewText: "Thank you for joining the FinLevels waitlist.",
    greeting: "Hi {{first_name}},",
    intro: [
      "Thank you for joining the FinLevels waitlist.",
      "We're excited to have you here.",
      "Most financial apps start by showing you budgets, charts, or investment tips.",
      "We don't.",
      "Because before improving your finances, you need to understand something more important:",
      "How you behave with money.",
      "Every financial decision you make is influenced by habits, emotions, beliefs, and patterns that often go unnoticed.",
      "That's why the first step in FinLevels is discovering your Financial Profile.",
      "Your profile helps reveal:",
      "• How you naturally manage money",
      "• Your strengths today",
      "• The habits holding you back",
      "• Your readiness to save, invest, and build wealth",
      "This profile becomes the foundation of everything you'll unlock inside FinLevels.",
      "The more accurately we understand you, the more personalized your journey becomes.",
    ],
    lesson: [],
    challenge: [],
    currentCtaLabel: "Discover My Financial Profile",
    outro: ["Welcome aboard."],
    signature: "The FinLevels Team",
  },
  {
    day: 1,
    title: "You already have a financial identity",
    subject: "You already have a financial identity",
    previewText: "Whether you realize it or not, you already have a financial identity.",
    greeting: "Hi {{first_name}},",
    intro: [
      "Whether you realize it or not, you already have a financial identity.",
    ],
    lesson: [],
    challenge: [
      "Whether you realize it or not, you already have a financial identity.",
      "Some people naturally save before spending.",
      "Some spend first and hope to save what's left.",
      "Some are comfortable taking risks.",
      "Others avoid investing entirely.",
    ],
    currentCtaLabel: "Discover Your Financial Profile",
    outro: [],
    signature: "The FinLevels Team",
  },
  {
    day: 2,
    title: "The future you want starts with understanding where you are",
    subject: "The future you want starts with understanding where you are",
    previewText: "Think about where you want to be financially one year from now.",
    greeting: "Hi {{first_name}},",
    intro: [],
    lesson: [],
    challenge: [
      "Think about where you want to be financially one year from now.",
      "Maybe you want:",
      "• More money saved",
      "• Less financial stress",
      "• Your first investment portfolio",
      "• Better money habits",
      "• More confidence in your financial decisions",
    ],
    currentCtaLabel: "Build Your Financial Profile",
    outro: [],
    signature: "The FinLevels Team",
  },
  {
    day: 3,
    title: "Why most financial advice never works",
    subject: "Why most financial advice never works",
    previewText: "The internet is full of financial advice — it's rarely personalized.",
    greeting: "Hi {{first_name}},",
    intro: [],
    lesson: [],
    challenge: [
      "The internet is full of financial advice.",
      "The advice isn't wrong, but it's the same for everyone.",
      "FinLevels is built around a simple belief: behavior matters more than information.",
    ],
    currentCtaLabel: "Get Your Financial Profile",
    outro: [],
    signature: "The FinLevels Team",
  },
  {
    day: 4,
    title: "Your FinLevels journey is waiting",
    subject: "Your FinLevels journey is waiting",
    previewText: "The first step is still waiting for you.",
    greeting: "Hi {{first_name}},",
    intro: [],
    lesson: [],
    challenge: [
      "You joined FinLevels because you want to improve your financial future.",
      "But your journey hasn't started yet — we still know very little about your financial behavior.",
      "Your Financial Profile unlocks that understanding.",
    ],
    currentCtaLabel: "Create Your Financial Profile",
    outro: ["We'll be ready when you are."],
    signature: "The FinLevels Team",
  },
];
