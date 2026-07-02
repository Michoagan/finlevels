import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { decryptChallengeToken, encryptChallengeToken } from "../../../lib/challenge-token";
import { calculateConsecutiveStreak } from "../../../lib/challenge-streak";
import type { ChallengePath } from "../../../lib/challenges";
import { challengeEmailTemplates } from "../../../lib/challenge-email-templates";
import ProfileTokenPageClient from "./ProfileTokenPageClient";

type ProfileName =
  | "The Survivor" | "The Explorer" | "The Stabilizer" | "The Saver"
  | "The Builder"  | "The Investor" | "The Strategist" | "The Wealth Architect"
  | "The Opportunist";

type ProfileDetails = {
  displayName: string; description: string; imageSrc: string;
  strengths: readonly string[]; growthAreas: readonly string[];
};

type ProfileTokenPageProps = { params: Promise<{ token: string }> };

type ProfileEntry = {
  email: string | null;
  profile_name: string | null; stability_level: number | null;
  saving_level: number | null; investing_level: number | null; primary_focus_coin: string | null;
  goals: unknown | null;
  plaid_access_token?: string | null;
  plaid_bank_name?: string | null;
  analysis_summary?: string | null;
  last_analysis_at?: string | null;
};

const profileGuidance: Record<ProfileName, ProfileDetails> = {
  "The Survivor": { displayName: "The Survivor", imageSrc: "/profile-survivor.png",
    description: "All three coins are still at the early stage. Money may feel overwhelming right now, so your first focus is stability and awareness.",
    strengths: ["You are aware that your money habits need attention", "You have a clear starting point for progress"],
    growthAreas: ["Build basic spending awareness", "Create simple stability routines", "Reduce month-to-month financial pressure"] },
  "The Explorer": { displayName: "The Explorer", imageSrc: "/profile-explorer.png",
    description: "Your coins are developing, but none are strong yet. You are past the starting line, and your next step is building consistent habits across stability, saving, and investing.",
    strengths: ["You have started building financial awareness", "You have room to grow across every coin", "Small improvements can create balanced progress quickly"],
    growthAreas: ["Build consistency across all three coins", "Strengthen your lowest coin first", "Turn early progress into repeatable money habits"] },
  "The Stabilizer": { displayName: "The Stabilizer", imageSrc: "/profile-stabilizer.png",
    description: "Your Stability coin is strong, but Saving and Investing are still low. You control spending well, and now it is time to add growth habits.",
    strengths: ["Controlled spending habits", "A stronger foundation than most beginners"],
    growthAreas: ["Introduce consistent saving", "Start learning investing basics", "Turn stability into long-term growth"] },
  "The Saver": { displayName: "The Saver", imageSrc: "/profile-saver.png",
    description: "Your Saving coin is strong, but Stability and Investing need more support. You know how to put money aside; now connect that habit to a stronger foundation and future growth.",
    strengths: ["Strong saving mindset", "Ability to delay spending and protect money"],
    growthAreas: ["Strengthen financial stability", "Improve spending and debt control", "Build investing education step by step"] },
  "The Builder": { displayName: "The Builder", imageSrc: "/profile-builder.png",
    description: "Your Stability and Saving coins are strong, while Investing is still low. You have a solid base and are ready to move from protection into wealth-building.",
    strengths: ["Stable money habits", "Consistent saving discipline", "A strong foundation for growth"],
    growthAreas: ["Learn investing fundamentals", "Start small wealth-building actions", "Move beyond conservative money habits"] },
  "The Investor": { displayName: "The Investor", imageSrc: "/profile-investor.png",
    description: "Your Investing coin is strong, but Stability and Saving are still low. You are interested in wealth-building, but your foundation needs more protection.",
    strengths: ["Long-term wealth mindset", "Comfort with investing and growth ideas"],
    growthAreas: ["Strengthen spending control", "Build a reliable saving foundation", "Reduce risk from weak stability habits"] },
  "The Wealth Architect": { displayName: "The Wealth Architect", imageSrc: "/profile-wealth-architect.png",
    description: "All three coins are strong. You have comprehensive financial mastery and are ready for more advanced optimization challenges.",
    strengths: ["Balanced financial habits", "Strong saving and investing discipline", "Consistent control across all coins"],
    growthAreas: ["Optimize returns and systems", "Keep habits consistent", "Protect and compound your momentum"] },
  "The Strategist": { displayName: "The Strategist", imageSrc: "/profile-strategist.png",
    description: "Your Stability and Investing coins are strong, but Saving is still developing. You have control and long-term ambition, but need a stronger cash buffer.",
    strengths: ["Strong spending control", "Long-term wealth mindset", "Ability to think strategically about money"],
    growthAreas: ["Build a consistent saving rhythm", "Create a stronger emergency buffer", "Balance investing ambition with short-term liquidity"] },
  "The Opportunist": { displayName: "The Opportunist", imageSrc: "/profile-opportunist.png",
    description: "Your Saving and Investing coins are strong, but Stability is low. You are growth-oriented and willing to take action, but your financial foundation needs more control.",
    strengths: ["Strong growth mindset", "Momentum in saving and investing"],
    growthAreas: ["Improve stability and spending control", "Reduce foundation risk", "Balance opportunity with consistency"] },
};

function isProfileName(p: unknown): p is ProfileName { return typeof p === "string" && p in profileGuidance; }
function isChallengePath(p: unknown): p is ChallengePath { return p === "stability" || p === "saving" || p === "investing"; }
function normalizeLevel(l: number | null): number {
  if (typeof l !== "number" || !Number.isFinite(l)) return 0;
  return Math.min(Math.max(Math.round(l), 0), 5);
}

function InvalidProfilePage() {
  return (
    <main className="min-h-screen bg-[#f5f2fe] px-4 py-10 text-[#1b1b23] sm:px-6 sm:py-14 lg:px-10">
      <section className="mx-auto max-w-xl rounded-4xl border border-red-200 bg-white p-6 shadow-[0px_24px_80px_rgba(70,72,212,0.10)] sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-red-600">Profile unavailable</p>
        <h1 className="mt-4 text-3xl font-black tracking-[-0.04em] sm:text-4xl">We could not open this profile path.</h1>
        <p className="mt-3 text-base font-medium leading-7 text-[#464554]">The link may be incomplete, expired, or missing a saved quiz profile.</p>
        <Link href="/quiz" className="mt-6 inline-flex rounded-full bg-[#4648d4] px-6 py-3 text-sm font-black text-white transition hover:scale-[1.02] hover:bg-[#3d3fbe]">Take the quiz</Link>
      </section>
    </main>
  );
}

async function makeClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function getProfileEntry(userId: number): Promise<ProfileEntry | null> {
  const sb = await makeClient(); if (!sb) return null;
  const { data, error } = await sb.from("waitlist")
    .select("email, profile_name, stability_level, saving_level, investing_level, primary_focus_coin, goals, plaid_access_token, plaid_bank_name, analysis_summary")
    .eq("id", userId).maybeSingle();
  if (error || !data) return null;
  return data as ProfileEntry;
}

async function getChallengeCompletions(userId: number): Promise<Record<string, number>> {
  const sb = await makeClient(); if (!sb) return {};
  const { data, error } = await sb.from("challenge_completions").select("path").eq("user_id", userId);
  if (error || !data) return {};
  const counts: Record<string, number> = {};
  for (const row of data) {
    if (typeof row.path === "string") counts[row.path] = (counts[row.path] ?? 0) + 1;
  }
  return counts;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getQuests(userId: number): Promise<any[]> {
  const sb = await makeClient(); if (!sb) return [];
  const { data, error } = await sb
    .from("quests")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getBosses(userId: number): Promise<any[]> {
  const sb = await makeClient(); if (!sb) return [];
  const { data, error } = await sb
    .from("bosses")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getStreaks(userId: number): Promise<any[]> {
  const sb = await makeClient(); if (!sb) return [];
  const { data, error } = await sb
    .from("streaks")
    .select("*")
    .eq("user_id", userId);
  if (error || !data) return [];
  return data;
}

async function getLastSentDay(userId: number, path: ChallengePath): Promise<number | null> {
  const sb = await makeClient(); if (!sb) return null;
  const { data, error } = await sb
    .from("email_sends")
    .select("day")
    .eq("user_id", userId)
    .eq("path", path)
    .order("day", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return typeof data.day === "number" ? data.day : null;
}

export async function generateMetadata({ params }: ProfileTokenPageProps): Promise<Metadata> {
  const { token: rawToken } = await params;
  const token = decodeURIComponent(rawToken);
  let payload;
  try {
    payload = decryptChallengeToken(token);
  } catch {
    return {};
  }

  const profileEntry = await getProfileEntry(payload.userId);
  if (!profileEntry || !isProfileName(profileEntry.profile_name)) return {};

  const profile = profileGuidance[profileEntry.profile_name];
  const email = profileEntry.email || "";
  const localPart = email.split("@")[0] || "there";
  const firstChunk = localPart.split(/[._+-]/)[0] || "there";
  const firstName = firstChunk.charAt(0).toUpperCase() + firstChunk.slice(1);

  const title = `${firstName}'s Archetype: ${profile.displayName} | Finlevels`;
  const description = `I discovered my archetype is ${profile.displayName} on Finlevels! Stability Lv.${normalizeLevel(profileEntry.stability_level)}, Saving Lv.${normalizeLevel(profileEntry.saving_level)}, Investing Lv.${normalizeLevel(profileEntry.investing_level)}. Take the 2-minute quiz!`;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://finlevels.app";
  const ogImageUrl = `${siteUrl}/api/og/profile/${encodeURIComponent(token)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${firstName}'s Archetype Profile Card`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

async function getProfileStreak(userId: number, path: ChallengePath): Promise<number> {
  const sb = await makeClient(); if (!sb) return 0;
  const { data, error } = await sb
    .from("challenge_completions")
    .select("day")
    .eq("user_id", userId)
    .eq("path", path)
    .order("day", { ascending: true });
  if (error || !data) return 0;
  const completedDays = data.map((c) => c.day).filter((day) => typeof day === "number");
  return calculateConsecutiveStreak(completedDays);
}

export default async function ProfileTokenPage({ params }: ProfileTokenPageProps) {
  const { token: rawToken } = await params;
  const token = decodeURIComponent(rawToken);
  let payload: ReturnType<typeof decryptChallengeToken>;
  try { payload = decryptChallengeToken(token); } catch { return <InvalidProfilePage />; }

  const profileEntry = await getProfileEntry(payload.userId);
  if (!profileEntry) {
    return <InvalidProfilePage />;
  }

  if (!isProfileName(profileEntry.profile_name)) {
    redirect("/quiz");
  }

  const primaryFocusCoin = isChallengePath(profileEntry.primary_focus_coin) ? profileEntry.primary_focus_coin : payload.path;

  const [challengeCompletions, lastSentDay, userStreak, serverQuests, serverBosses, serverStreaks] = await Promise.all([
    getChallengeCompletions(payload.userId),
    getLastSentDay(payload.userId, primaryFocusCoin as ChallengePath),
    getProfileStreak(payload.userId, primaryFocusCoin as ChallengePath),
    getQuests(payload.userId),
    getBosses(payload.userId),
    getStreaks(payload.userId),
  ]);

  const email = profileEntry.email || "";
  const localPart = email.split("@")[0] || "there";
  const firstChunk = localPart.split(/[._+-]/)[0] || "there";
  const firstName = firstChunk.charAt(0).toUpperCase() + firstChunk.slice(1);

  const completedOnPath = challengeCompletions[primaryFocusCoin] ?? 0;
  const totalCompletions = Object.values(challengeCompletions).reduce((a, b) => a + b, 0);
  const playerLevel = Math.floor(totalCompletions / 3) + 1;

  const templates = challengeEmailTemplates[primaryFocusCoin];
  const maxDay = templates.length > 0 ? templates.length - 1 : 0;
  const allDone = completedOnPath > maxDay;
  const nextNeededDay = Math.min(completedOnPath, maxDay);
  const nextEmailSent = !allDone && lastSentDay !== null && lastSentDay >= nextNeededDay;
  
  const nextChallengeToken = encryptChallengeToken({
    userId: payload.userId, path: primaryFocusCoin, day: nextNeededDay,
  });
  const activeChallengeToken = encryptChallengeToken({
    userId: payload.userId,
    path: primaryFocusCoin,
    day: (!allDone && nextEmailSent) ? nextNeededDay : (lastSentDay !== null ? lastSentDay : 0),
  });

  return (
    <ProfileTokenPageClient
      token={token}
      userId={payload.userId}
      email={email}
      initialProfileName={profileEntry.profile_name as ProfileName}
      stabilityLevel={normalizeLevel(profileEntry.stability_level)}
      savingLevel={normalizeLevel(profileEntry.saving_level)}
      investingLevel={normalizeLevel(profileEntry.investing_level)}
      primaryFocusCoin={primaryFocusCoin}
      challengeCompletions={challengeCompletions}
      totalCompletions={totalCompletions}
      playerLevel={playerLevel}
      activeChallengeToken={activeChallengeToken}
      allDone={allDone}
      nextEmailSent={nextEmailSent}
      nextNeededDay={nextNeededDay}
      nextChallengeToken={nextChallengeToken}
      firstName={firstName}
      initialGoals={Array.isArray(profileEntry.goals) ? profileEntry.goals : []}
      userStreak={userStreak}
      plaidAccessToken={profileEntry.plaid_access_token || undefined}
      plaidBankName={profileEntry.plaid_bank_name || undefined}
      analysisSummary={profileEntry.analysis_summary || undefined}
      lastAnalysisAt={profileEntry.last_analysis_at || undefined}
      initialQuests={serverQuests}
      initialBosses={serverBosses}
      initialStreaks={serverStreaks}
    />
  );
}
