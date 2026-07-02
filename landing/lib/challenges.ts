export type ChallengePath = "stability" | "saving" | "investing";

type ChallengeProgress = {
  token: string;
};

type ChallengeProgressResponse = {
  progress?: ChallengeProgress | null;
  error?: string;
};

export type ChallengeCompletion = {
  token: string;
  challengeTitle: string;
  proof?: string;
  choiceLabel?: string;
  choiceCost?: number;
  dailyThreshold?: number;
  savings?: number;
  depositGoalId?: string;
};

export type ChallengeCompletionResponse = {
  success?: boolean;
  streak?: number;
  goals?: UserGoal[];
  error?: string;
};

export async function getChallengeProgressForEmail(
  email: string,
): Promise<ChallengeProgress | null> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new Error("Please enter a valid email address.");
  }

  const response = await fetch("/api/challenges/progress", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: normalizedEmail }),
  });

  const result = (await response.json()) as ChallengeProgressResponse;

  if (!response.ok) {
    throw new Error(
      result.error || "Unable to check your challenge progress right now.",
    );
  }

  return result.progress ?? null;
}

export async function saveChallengeCompletion({
  token,
  challengeTitle,
  proof,
  choiceLabel,
  choiceCost,
  dailyThreshold,
  savings,
  depositGoalId,
}: ChallengeCompletion): Promise<{ streak: number | null; goals?: UserGoal[] }> {
  if (!token) {
    throw new Error("Missing challenge token.");
  }

  const response = await fetch("/api/challenges/complete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
      challengeTitle,
      proof: typeof proof === "string" ? proof : undefined,
      choiceLabel,
      choiceCost,
      dailyThreshold,
      savings,
      depositGoalId,
    }),
  });

  const result = (await response.json()) as ChallengeCompletionResponse;

  if (!response.ok) {
    throw new Error(result.error || "Unable to validate this challenge.");
  }

  return {
    streak: typeof result.streak === "number" ? result.streak : null,
    goals: result.goals,
  };
}

export function getCompletedBudgetChallenges(userId: number): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(`budget_completed_${userId}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveBudgetChallengeCompletion(
  userId: number,
  path: ChallengePath,
  day: number
): void {
  if (typeof window === "undefined") return;
  try {
    const key = `budget_completed_${userId}`;
    const completed = getCompletedBudgetChallenges(userId);
    completed[`${path}_${day}`] = true;
    localStorage.setItem(key, JSON.stringify(completed));
  } catch (e) {
    console.error("Failed to save budget completion:", e);
  }
}

export type UserGoal = {
  id: string;
  name: string;
  target: number;
  current: number;
  category: string;
  isActive: boolean;
  ticker?: string;
};

export function getUserGoals(userId: number): UserGoal[] {
  if (typeof window === "undefined") return [];
  try {
    const key = `user_goals_${userId}`;
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
    
    // No default presets, return empty array so user defines them themselves
    localStorage.setItem(key, JSON.stringify([]));
    return [];
  } catch {
    return [];
  }
}

export function saveUserGoal(userId: number, goal: UserGoal): void {
  if (typeof window === "undefined") return;
  try {
    const key = `user_goals_${userId}`;
    const goals = getUserGoals(userId);
    const index = goals.findIndex(g => g.id === goal.id);
    if (index >= 0) {
      goals[index] = goal;
    } else {
      goals.push(goal);
    }
    localStorage.setItem(key, JSON.stringify(goals));
  } catch (e) {
    console.error("Failed to save user goal:", e);
  }
}

export function allocateGoalSavings(userId: number, goalId: string, amount: number): void {
  if (typeof window === "undefined") return;
  try {
    const key = `user_goals_${userId}`;
    const goals = getUserGoals(userId);
    const index = goals.findIndex(g => g.id === goalId);
    if (index >= 0 && goals[index]) {
      goals[index].current = Math.round((goals[index].current + amount) * 100) / 100;
      localStorage.setItem(key, JSON.stringify(goals));
    }
  } catch (e) {
    console.error("Failed to allocate goal savings:", e);
  }
}

export function getProfileOverride(userId: number): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(`profile_override_${userId}`);
  } catch {
    return null;
  }
}

export function saveProfileOverride(userId: number, profileName: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`profile_override_${userId}`, profileName);
  } catch (e) {
    console.error("Failed to save profile override:", e);
  }
}export async function saveUserGoalsToDb(
  token: string,
  goals: UserGoal[]
): Promise<void> {
  const response = await fetch("/api/profile/goals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
      goals,
    }),
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.error || "Failed to sync goals to database.");
  }
}
