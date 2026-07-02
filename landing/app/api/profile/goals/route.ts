import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { decryptChallengeToken } from "../../../../lib/challenge-token";

type GoalsRequestBody = {
  token?: unknown;
  goals?: unknown;
};

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return NextResponse.json(
      { error: "Service temporarily unavailable. Please try again later." },
      { status: 500 },
    );
  }

  let body: GoalsRequestBody;
  try {
    body = (await request.json()) as GoalsRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const token = typeof body.token === "string" ? body.token.trim() : "";
  const goals = Array.isArray(body.goals) ? body.goals : null;

  if (!token) {
    return NextResponse.json(
      { error: "Missing challenge token." },
      { status: 400 },
    );
  }

  if (!goals) {
    return NextResponse.json(
      { error: "Missing or invalid goals list." },
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

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { error } = await supabase
    .from("waitlist")
    .update({ goals })
    .eq("id", tokenPayload.userId);

  if (error) {
    return NextResponse.json(
      { error: error.message || "Unable to save goals." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, goals });
}
