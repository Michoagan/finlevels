import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

interface PushSubscriptionRequestBody {
  endpoint?: string;
  keys?: {
    p256dh?: string;
    auth?: string;
  };
  userId?: string | number;
}

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return NextResponse.json(
      { error: "Service temporarily unavailable." },
      { status: 500 },
    );
  }

  let body: PushSubscriptionRequestBody;
  try {
    body = (await request.json()) as PushSubscriptionRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const { endpoint, keys, userId } = body;
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return NextResponse.json(
      { error: "Missing subscription fields (endpoint, keys.p256dh, keys.auth)." },
      { status: 400 },
    );
  }

  const sb = createClient(supabaseUrl, supabaseServiceRoleKey);

  // Upsert by endpoint — one endpoint = one device/browser
  const { error } = await sb
    .from("push_subscriptions")
    .upsert(
      {
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        user_id: userId ? Number(userId) : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "endpoint" },
    );

  if (error) {
    console.error("[push-subscription POST] Supabase error:", error);
    return NextResponse.json(
      { error: "Failed to save subscription." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}

interface PushDeleteRequestBody {
  endpoint?: string;
}

export async function DELETE(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return NextResponse.json(
      { error: "Service temporarily unavailable." },
      { status: 500 },
    );
  }

  let body: PushDeleteRequestBody;
  try {
    body = (await request.json()) as PushDeleteRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const { endpoint } = body;
  if (!endpoint) {
    return NextResponse.json(
      { error: "Missing endpoint field." },
      { status: 400 },
    );
  }

  const sb = createClient(supabaseUrl, supabaseServiceRoleKey);

  const { error } = await sb
    .from("push_subscriptions")
    .delete()
    .eq("endpoint", endpoint);

  if (error) {
    console.error("[push-subscription DELETE] Supabase error:", error);
    return NextResponse.json(
      { error: "Failed to remove subscription." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
