import type { ChallengePath } from "../../lib/challenges";

export type Challenge = {
  title: string;
  description: string;
  action: string;
  why: string;
};

export const pathDetails: Record<
  ChallengePath,
  {
    label: string;
    color: string;
    softColor: string;
    textColor: string;
    goal: string;
    challenges: readonly Challenge[];
  }
> = {
  stability: {
    label: "Stability",
    color: "bg-[#4648d4]",
    softColor: "bg-[#e1e0ff]",
    textColor: "text-[#4648d4]",
    goal: "Build control, awareness, and confidence with your day-to-day money.",
    challenges: [
      {
        title: "Find one money leak",
        description:
          "Look at your last 7 days of spending and choose one expense that did not really improve your life.",
        action:
          "Write down the expense and one rule to avoid repeating it this week.",
        why: "Stability starts with awareness. Small leaks become big pressure when they stay invisible.",
      },
      {
        title: "Do a 5-minute spending check-in",
        description:
          "Check your simulated wallet profile and see what money came in, what went out, and what is still available.",
        action:
          "Write your current available amount and one thing you need to protect it from.",
        why: "A short check-in reduces uncertainty and makes spending decisions easier.",
      },
      {
        title: "Create one spending boundary",
        description:
          "Pick one category where you usually overspend: food delivery, shopping, subscriptions, or entertainment.",
        action: "Set one simple limit for the next 48 hours.",
        why: "Boundaries create control without requiring a perfect budget.",
      },
    ],
  },
  saving: {
    label: "Saving",
    color: "bg-[#006b5f]",
    softColor: "bg-[#e8fffb]",
    textColor: "text-[#006b5f]",
    goal: "Build a repeatable saving rhythm and a stronger cash buffer.",
    challenges: [
      {
        title: "Save before spending",
        description:
          "Move a small amount to savings before making any non-essential purchase today.",
        action: "Transfer any amount you can repeat — even $1 counts.",
        why: "The goal is not the amount. The goal is teaching your money to move toward safety first.",
      },
      {
        title: "Name your buffer",
        description:
          "Give your emergency fund or savings goal a clear name so it feels real and specific.",
        action: "Rename the account or write the goal somewhere visible.",
        why: "A named goal is easier to protect than a vague intention to save more.",
      },
      {
        title: "Set a repeatable saving rule",
        description:
          "Choose a tiny rule that can happen every time money arrives.",
        action:
          "Pick a rule like: save 5%, save $5, or round up every deposit.",
        why: "Saving improves fastest when it becomes automatic and repeatable.",
      },
    ],
  },
  investing: {
    label: "Investing",
    color: "bg-[#904900]",
    softColor: "bg-[#ffdcc5]",
    textColor: "text-[#904900]",
    goal: "Build investing confidence with simple, low-pressure wealth-building actions.",
    challenges: [
      {
        title: "Learn one investing term",
        description:
          "Pick one concept you have heard before but do not fully understand yet.",
        action:
          "Learn the meaning of index fund, diversification, compound growth, or risk tolerance.",
        why: "Confidence grows when investing stops feeling like a mystery.",
      },
      {
        title: "Check your foundation first",
        description:
          "Before thinking about returns, check whether your stability and saving habits can support risk.",
        action:
          "Write one thing that would make investing safer for you right now.",
        why: "Strong investing works best when it is supported by cash flow and savings.",
      },
      {
        title: "Choose a beginner investing question",
        description:
          "Instead of trying to learn everything, choose one question to answer today.",
        action:
          "Write and answer one question like: what is an ETF, or what does long-term mean?",
        why: "Small learning loops prevent overwhelm and build steady investing confidence.",
      },
    ],
  },
};

export function getValidDay(day: number, maxDay: number): number {
  if (!Number.isInteger(day) || day < 0) {
    return 0;
  }

  return Math.min(day, maxDay);
}
