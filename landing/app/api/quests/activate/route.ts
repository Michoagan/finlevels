import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { decryptChallengeToken } from "../../../../lib/challenge-token";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, questId } = body;

    if (!token || !questId) {
      return NextResponse.json({ error: "Missing token or questId parameters." }, { status: 400 });
    }

    // 1. Decrypt token safely
    let payload;
    try {
      payload = decryptChallengeToken(decodeURIComponent(token));
    } catch {
      return NextResponse.json({ error: "Session token is invalid or expired." }, { status: 401 });
    }

    const { userId } = payload;
    const sb = getSupabaseClient();

    // 2. Fetch the target quest to ensure it belongs to the user and is pending
    const { data: quest, error: fetchErr } = await sb
      .from("quests")
      .select("*")
      .eq("id", questId)
      .eq("user_id", userId)
      .eq("status", "pending")
      .maybeSingle();

    if (fetchErr || !quest) {
      return NextResponse.json({ error: "Quest not found or already activated." }, { status: 404 });
    }

    // 3. Activate the chosen quest
    const { error: updateErr } = await sb
      .from("quests")
      .update({
        status: "active",
        start_date: new Date().toISOString()
      })
      .eq("id", questId);

    if (updateErr) {
      throw new Error(`Failed to activate quest: ${updateErr.message}`);
    }

    // 4. Delete all other pending quests for this user
    const { error: purgeErr } = await sb
      .from("quests")
      .delete()
      .eq("user_id", userId)
      .eq("status", "pending")
      .neq("id", questId);

    if (purgeErr) {
      console.warn("Non-blocking warning: failed to purge other pending quests:", purgeErr.message);
    }

    return NextResponse.json({
      success: true,
      message: "Quest activated successfully, other options purged.",
      questId,
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
