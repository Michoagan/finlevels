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
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: "Missing token parameter." }, { status: 400 });
    }

    let payload;
    try {
      payload = decryptChallengeToken(decodeURIComponent(token));
    } catch (e) {
      return NextResponse.json({ error: "Session token is invalid or expired." }, { status: 401 });
    }

    const { userId } = payload;
    const sb = getSupabaseClient();

    // Fetch game data side quests & bosses bypassing client RLS
    const [questsRes, bossesRes, streaksRes] = await Promise.all([
      sb.from("quests").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      sb.from("bosses").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      sb.from("streaks").select("*").eq("user_id", userId),
    ]);

    return NextResponse.json({
      success: true,
      quests: questsRes.data || [],
      bosses: bossesRes.data || [],
      streaks: streaksRes.data || [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
