import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

// Initialize VAPID details for server push
const VAPID_SUBJECT = process.env.SITE_URL || "mailto:support@finlevels.app";
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
} else {
  console.warn("[Server Push] VAPID keys are missing. Push notifications will fail to send.");
}

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type ServerPushPayload = {
  title: string;
  body: string;
  url?: string;
  icon?: string;
};

/**
 * Sends a web push notification to all registered devices of a user
 */
export async function sendPushToUser(userId: number, payload: ServerPushPayload) {
  const sb = getSupabaseClient();

  // Fetch all active subscriptions for the user
  const { data: subscriptions, error } = await sb
    .from("push_subscriptions")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error(`[Server Push] Failed to fetch subscriptions for user ${userId}:`, error.message);
    return { success: false, error: error.message };
  }

  if (!subscriptions || subscriptions.length === 0) {
    console.log(`[Server Push] No registered push subscriptions for user ${userId}`);
    return { success: true, sentCount: 0 };
  }

  console.log(`[Server Push] Sending push to ${subscriptions.length} devices for user ${userId}`);

  const results = await Promise.allSettled(
    subscriptions.map(async (sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      };

      try {
        await webpush.sendNotification(
          pushSubscription,
          JSON.stringify({
            title: payload.title,
            body: payload.body,
            icon: payload.icon || "/logo-purple.svg",
            url: payload.url || "/dashboard",
          })
        );
      } catch (err) {
        const error = err as { statusCode?: number };
        // If the push service returns 404 or 410, the subscription has expired or unsubscribed
        if (error.statusCode === 404 || error.statusCode === 410) {
          console.warn(`[Server Push] Subscription expired. Deleting endpoint: ${sub.endpoint}`);
          await sb.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
        } else {
          throw err;
        }
      }
    })
  );

  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;
  console.log(`[Server Push] Sent results: ${succeeded} succeeded, ${failed} failed.`);

  return { success: true, sentCount: succeeded };
}
