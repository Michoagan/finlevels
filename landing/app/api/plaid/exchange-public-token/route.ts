import { NextResponse } from "next/server";
import { plaidClient } from "../../../../lib/plaid";
import { createClient } from "@supabase/supabase-js";

const getSupabaseClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
};

export async function POST(request: Request) {
  try {
    const { public_token, userId, bankName } = await request.json();

    if (!public_token) {
      return NextResponse.json({ error: "Missing public_token" }, { status: 400 });
    }

    const response = await plaidClient.itemPublicTokenExchange({
      public_token,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Persist to Supabase if userId is provided
    if (userId) {
      const sb = getSupabaseClient();
      const { error: dbErr } = await sb
        .from("waitlist")
        .update({
          plaid_access_token: accessToken,
          plaid_bank_name: bankName || "Banque Plaid"
        })
        .eq("id", userId);

      if (dbErr) {
        console.warn("Failed to persist Plaid credentials to Supabase:", dbErr.message);
      }
    }

    return NextResponse.json({
      access_token: accessToken,
      item_id: itemId,
      success: true,
    });
  } catch (error: any) {
    const errMsg = error?.response?.data?.error_message || error.message || "Failed to exchange public token";
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}

