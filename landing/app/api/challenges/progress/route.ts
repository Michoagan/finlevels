import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { encryptChallengeToken } from "../../../../lib/challenge-token";
import { challengeEmailTemplates } from "../../../../lib/challenge-email-templates";
import type { ChallengePath } from "../../../../lib/challenges";

type ProgressRequestBody = {
  email?: unknown;
};

function isChallengePath(path: unknown): path is ChallengePath {
  return path === "stability" || path === "saving" || path === "investing";
}

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

  let body: ProgressRequestBody;

  try {
    body = (await request.json()) as ProgressRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const normalizedEmail =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data: waitlistEntry, error: waitlistError } = await supabase
    .from("waitlist")
    .select("id, profile_name, primary_focus_coin")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (waitlistError) {
    return NextResponse.json(
      {
        error:
          waitlistError.message ||
          "Unable to check your quiz profile right now.",
      },
      { status: 500 },
    );
  }

  const primaryFocusCoin =
    typeof waitlistEntry?.primary_focus_coin === "string"
      ? waitlistEntry.primary_focus_coin.trim().toLowerCase()
      : waitlistEntry?.primary_focus_coin;

  if (
    !waitlistEntry?.profile_name ||
    !Number.isInteger(waitlistEntry.id) ||
    !isChallengePath(primaryFocusCoin)
  ) {
    return NextResponse.json({ progress: null });
  }

  const userId = waitlistEntry.id;
  const { data: latestEmailSend, error: emailSendError } = await supabase
    .from("email_sends")
    .select("day")
    .eq("user_id", userId)
    .eq("path", primaryFocusCoin)
    .order("day", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (emailSendError) {
    return NextResponse.json(
      {
        error:
          emailSendError.message || "Unable to check your challenge progress.",
      },
      { status: 500 },
    );
  }

  const lastSentDay =
    typeof latestEmailSend?.day === "number" ? latestEmailSend.day : null;
  const unclampedNextDay = lastSentDay === null ? 0 : lastSentDay + 1;
  const templates = challengeEmailTemplates[primaryFocusCoin];
  const maxChallengeDay = templates.length > 0 ? templates.length - 1 : 0;
  const nextDay = Math.min(unclampedNextDay, maxChallengeDay);
  const token = encryptChallengeToken({
    userId,
    path: primaryFocusCoin,
    day: nextDay,
  });

  return NextResponse.json({
    progress: {
      token,
    },
  });
}
