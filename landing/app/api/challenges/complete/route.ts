import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { decryptChallengeToken } from "../../../../lib/challenge-token";
import { calculateConsecutiveStreak } from "../../../../lib/challenge-streak";
import type { UserGoal } from "../../../../lib/challenges";

type CompleteRequestBody = {
  token?: unknown;
  challengeTitle?: unknown;
  proof?: unknown;
  choiceLabel?: unknown;
  choiceCost?: unknown;
  dailyThreshold?: unknown;
  savings?: unknown;
  depositGoalId?: unknown;
};

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return NextResponse.json(
      {
        error:
          "Service temporarily unavailable. Please try again later.",
      },
      { status: 500 },
    );
  }

  let body: CompleteRequestBody;

  try {
    body = (await request.json()) as CompleteRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const token = typeof body.token === "string" ? body.token.trim() : "";
  const challengeTitle =
    typeof body.challengeTitle === "string" ? body.challengeTitle.trim() : "";
  let proof = typeof body.proof === "string" ? body.proof.trim() : null;

  // Optional: limit proof length to prevent extremely large values being stored
  if (proof && proof.length > 2000) {
    proof = proof.slice(0, 2000);
  }

  if (!token) {
    return NextResponse.json(
      { error: "Missing challenge token." },
      { status: 400 },
    );
  }

  let tokenPayload;

  try {
    tokenPayload = decryptChallengeToken(token);
  } catch {
    return NextResponse.json(
      { error: "Invalid challenge token." },
      { status: 400 },
    );
  }

  if (!challengeTitle) {
    return NextResponse.json(
      { error: "Missing challenge title." },
      { status: 400 },
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const choiceLabel = typeof body.choiceLabel === "string" ? body.choiceLabel.trim() : null;
  const choiceCost = typeof body.choiceCost === "number" ? body.choiceCost : null;
  const dailyThreshold = typeof body.dailyThreshold === "number" ? body.dailyThreshold : null;
  const depositGoalId = typeof body.depositGoalId === "string" ? body.depositGoalId.trim() : null;

  const { error } = await supabase.from("challenge_completions").upsert(
    {
      user_id: tokenPayload.userId,
      path: tokenPayload.path,
      day: tokenPayload.day,
      challenge_title: challengeTitle,
      proof,
      completed_at: new Date().toISOString(),
      choice_label: choiceLabel,
      choice_cost: choiceCost,
      daily_threshold: dailyThreshold,
    },
    { onConflict: "user_id,path,day" },
  );

  if (error) {
    return NextResponse.json(
      { error: error.message || "Unable to validate this challenge." },
      { status: 500 },
    );
  }

  // Load waitlist goals and update active goal if savings > 0
  const { data: userData, error: userError } = await supabase
    .from("waitlist")
    .select("goals")
    .eq("id", tokenPayload.userId)
    .maybeSingle();

  let updatedGoals: UserGoal[] = [];
  if (!userError && userData) {
    let goalsList = (Array.isArray(userData.goals) ? userData.goals : []) as UserGoal[];
    if (goalsList.length === 0) {
      goalsList = [
        { id: "emergency", name: "🚨 Emergency Fund", target: 1000, current: 150, category: "stability", isActive: true },
        { id: "trip", name: "✈️ Tokyo Summer Trip", target: 2500, current: 0, category: "saving", isActive: false },
        { id: "crypto", name: "🚀 Moonshot Crypto Bag", target: 500, current: 0, category: "investing", isActive: false }
      ];
    }
    const savingsAmount = typeof body.savings === "number" ? body.savings : 0;
    
    if (savingsAmount > 0) {
      let targetGoalId = depositGoalId;
      if (!targetGoalId) {
        const currentActive = goalsList.find((g: UserGoal) => g.isActive);
        if (currentActive) {
          targetGoalId = currentActive.id;
        } else if (goalsList.length > 0) {
          targetGoalId = goalsList[0].id;
        }
      }

      // Check if targetGoalId exists in goalsList, if not add the preset
      const exists = goalsList.some((g: UserGoal) => g.id === targetGoalId);
      if (!exists && targetGoalId) {
        const standardPresets = [
          { id: "emergency", name: "🚨 Emergency Fund", target: 1000, current: 150, category: "stability", isActive: false },
          { id: "trip", name: "✈️ Tokyo Summer Trip", target: 2500, current: 0, category: "saving", isActive: false },
          { id: "crypto", name: "🚀 Moonshot Crypto Bag", target: 500, current: 0, category: "investing", isActive: false }
        ];
        const matchingPreset = standardPresets.find(p => p.id === targetGoalId);
        if (matchingPreset) {
          goalsList.push(matchingPreset);
        }
      }

      updatedGoals = goalsList.map((g: UserGoal) => {
        const isTarget = g.id === targetGoalId;
        return {
          ...g,
          isActive: isTarget,
          current: isTarget ? Math.round((g.current + savingsAmount) * 100) / 100 : g.current,
        };
      });
      
      // Save goals back to database
      await supabase
        .from("waitlist")
        .update({ goals: updatedGoals })
        .eq("id", tokenPayload.userId);
    } else {
      updatedGoals = goalsList;
    }
  }

  const { data: completions, error: streakError } = await supabase
    .from("challenge_completions")
    .select("day")
    .eq("user_id", tokenPayload.userId)
    .eq("path", tokenPayload.path)
    .order("day", { ascending: true });

  if (streakError) {
    return NextResponse.json(
      { error: streakError.message || "Unable to refresh your streak." },
      { status: 500 },
    );
  }

  const streak = calculateConsecutiveStreak(
    completions
      ?.map((completion) => completion.day)
      .filter((day) => typeof day === "number") ?? [],
  );

  return NextResponse.json({ success: true, streak, goals: updatedGoals });
}
