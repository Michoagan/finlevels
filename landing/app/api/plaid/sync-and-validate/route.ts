import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { plaidClient } from "../../../../lib/plaid";
import { decryptChallengeToken } from "../../../../lib/challenge-token";

const getSupabaseClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
};

export async function POST(request: Request) {
  try {
    const { accessToken: clientAccessToken, token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    let payload;
    try {
      payload = decryptChallengeToken(decodeURIComponent(token));
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { userId } = payload;
    const sb = getSupabaseClient();

    let accessToken = clientAccessToken;
    if (!accessToken) {
      // Load Plaid access token from waitlist table in DB
      const { data: userData } = await sb
        .from("waitlist")
        .select("plaid_access_token")
        .eq("id", userId)
        .maybeSingle();

      if (userData && userData.plaid_access_token) {
        accessToken = userData.plaid_access_token;
      }
    }

    if (!accessToken) {
      return NextResponse.json({ error: "Missing Plaid access token (bank not connected)." }, { status: 400 });
    }


    interface PlaidAccount {
      account_id: string;
      name: string;
      balances: {
        current?: number | null;
        available?: number | null;
      };
    }

    interface PlaidTx {
      account_id: string;
      date: string;
      name?: string | null;
      merchant_name?: string | null;
      amount: number;
      category?: string[] | null;
    }

    // 1. Fetch accounts and balances (always ready immediately)
    let plaidAccounts: PlaidAccount[] = [];
    try {
      const accountsResponse = await plaidClient.accountsGet({
        access_token: accessToken,
      });
      plaidAccounts = accountsResponse.data.accounts || [];
    } catch (err) {
      const error = err as Error;
      console.warn("Failed to fetch Plaid accounts:", error.message);
    }

    // 2. Fetch all historical transactions (may throw PRODUCT_NOT_READY initially)
    let plaidTransactions: PlaidTx[] = [];
    try {
      const endDate = new Date().toISOString().split("T")[0];
      const startDate = "2000-01-01";

      const plaidResponse = await plaidClient.transactionsGet({
        access_token: accessToken,
        start_date: startDate,
        end_date: endDate,
        options: { count: 500 },
      });
      plaidTransactions = plaidResponse.data.transactions || [];
      // If accounts weren't loaded, fallback to transaction response accounts
      if (plaidAccounts.length === 0) {
        plaidAccounts = plaidResponse.data.accounts || [];
      }
    } catch (err) {
      const error = err as Error;
      console.warn("Plaid transactions not ready or failed to fetch (non-blocking):", error.message);
    }





    // 2. Fetch active Quests
    const { data: activeQuests, error: qErr } = await sb
      .from("quests")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active");

    if (qErr) {
      console.error("Error fetching active quests:", qErr.message);
    }

    const updatedQuests = [];

    if (activeQuests && activeQuests.length > 0) {
      for (const quest of activeQuests) {
        // Guard: skip quests missing a start_date (data integrity)
        if (!quest.start_date) continue;

        const startTimestamp = new Date(quest.start_date).getTime();
        const durationMs = quest.duration_days * 24 * 60 * 60 * 1000;
        const endTimestamp = startTimestamp + durationMs;
        const now = Date.now();

        // Find transactions violating this quest
        const violations = plaidTransactions.filter((tx) => {
          const txDate = new Date(tx.date).getTime();
          const matchesMerchant = tx.name?.toLowerCase().includes(quest.target_merchant.toLowerCase()) || 
                                  tx.merchant_name?.toLowerCase().includes(quest.target_merchant.toLowerCase());
          return matchesMerchant && txDate >= startTimestamp;
        });

        const totalSpent = violations.reduce((acc, curr) => acc + Math.abs(curr.amount), 0);

        if (quest.target_amount && totalSpent > quest.target_amount) {
          // Spent more than allowed -> Fail quest
          const { error: failErr } = await sb
            .from("quests")
            .update({ status: "failed" })
            .eq("id", quest.id);

          if (!failErr) {
            updatedQuests.push({ id: quest.id, status: "failed", title: quest.title });
            // Reset streak
            await sb.from("streaks").upsert({
              user_id: userId,
              merchant_or_category: quest.target_merchant,
              current_streak: 0,
              last_active_date: new Date().toISOString().split("T")[0]
            }, { onConflict: "user_id, merchant_or_category" });
          }
        } else if (now >= endTimestamp) {
          // Time completed and stayed below budget limit -> Success quest
          const { error: winErr } = await sb
            .from("quests")
            .update({ status: "completed" })
            .eq("id", quest.id);

          if (!winErr) {
            updatedQuests.push({ id: quest.id, status: "completed", title: quest.title });

            // Award XP and Coin rewards — read from the quest row itself
            const xpGain = quest.xp_reward || 100;
            const coinGain = quest.coin_reward || 20;

            const { data: userProfile } = await sb
              .from("waitlist")
              .select("stability_level, saving_level, investing_level, total_xp, total_coins")
              .eq("id", userId)
              .maybeSingle();

            if (userProfile) {
              // Increment the relevant financial level based on quest category
              const levelUpdate: Record<string, number> = {};
              if (quest.category === "stability") {
                levelUpdate.stability_level = Math.min((userProfile.stability_level || 1) + 1, 5);
              } else if (quest.category === "saving") {
                levelUpdate.saving_level = Math.min((userProfile.saving_level || 1) + 1, 5);
              } else if (quest.category === "investing") {
                levelUpdate.investing_level = Math.min((userProfile.investing_level || 1) + 1, 5);
              }

              await sb.from("waitlist").update({
                ...levelUpdate,
                total_xp: (userProfile.total_xp || 0) + xpGain,
                total_coins: (userProfile.total_coins || 0) + coinGain,
              }).eq("id", userId);
            }

            // Increment streak
            const { data: existingStreak } = await sb.from("streaks").select("current_streak, longest_streak").eq("user_id", userId).eq("merchant_or_category", quest.target_merchant).maybeSingle();
            const newStreak = (existingStreak?.current_streak || 0) + 1;
            await sb.from("streaks").upsert({
              user_id: userId,
              merchant_or_category: quest.target_merchant,
              current_streak: newStreak,
              longest_streak: Math.max(newStreak, existingStreak?.longest_streak || 0),
              last_active_date: new Date().toISOString().split("T")[0]
            }, { onConflict: "user_id, merchant_or_category" });
          }
        }
      }
    }

    // 3. Fetch active Bosses
    const { data: activeBosses, error: bErr } = await sb
      .from("bosses")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active");

    if (bErr) {
      console.error("Error fetching active bosses:", bErr.message);
    }

    const updatedBosses = [];

    if (activeBosses && activeBosses.length > 0) {
      for (const boss of activeBosses) {
        const targets = Array.isArray(boss.target_subscriptions) ? boss.target_subscriptions : [];
        let canceledCount = 0;

        // Check if user has canceled any target subscriptions (no payment in the last 30 days of transactions)
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        for (const target of targets) {
          if (!target) continue;
          const targetStr = typeof target === "string" ? target : (target?.name || String(target));
          const hasPaid = plaidTransactions.some(tx => {
            const txTime = new Date(tx.date).getTime();
            const matches = tx.name?.toLowerCase().includes(targetStr.toLowerCase()) || 
                            tx.merchant_name?.toLowerCase().includes(targetStr.toLowerCase());
            return matches && txTime >= thirtyDaysAgo;
          });
          if (!hasPaid) {
            canceledCount++;
          }
        }

        // Apply damage equivalent to cancelled subscriptions
        const avgMonthlyCost = 12.99;
        const currentDamage = canceledCount * avgMonthlyCost;
        const newHp = Math.max(0, Number(boss.max_hp) - currentDamage);
        const newStatus = newHp <= 0 ? "defeated" : "active";

        const { error: bossUpErr } = await sb
          .from("bosses")
          .update({
            current_hp: newHp,
            status: newStatus
          })
          .eq("id", boss.id);

        if (!bossUpErr && (newHp !== boss.current_hp || newStatus !== boss.status)) {
          updatedBosses.push({ id: boss.id, name: boss.name, current_hp: newHp, status: newStatus });
        }
      }
    }

    return NextResponse.json({
      success: true,
      updatedQuests,
      updatedBosses,
      transactions: plaidTransactions,
      accounts: plaidAccounts,
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message || "Sync failed" }, { status: 500 });
  }
}

