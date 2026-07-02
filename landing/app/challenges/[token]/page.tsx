import { createClient } from "@supabase/supabase-js";
import { Metadata } from "next";
import { decryptChallengeToken } from "../../../lib/challenge-token";
import { calculateConsecutiveStreak } from "../../../lib/challenge-streak";
import { challengeEmailTemplates } from "../../../lib/challenge-email-templates";
import { type UserGoal } from "../../../lib/challenges";
import ChallengeTokenPageClient from "./ChallengeTokenPageClient";

type ChallengeTokenPageProps = {
  params: Promise<{
    token: string;
  }>;
};

type ChallengeCompletionState = {
  streak: number;
  isCurrentDayCompleted: boolean;
};

async function getChallengeCompletionState(
  userId: number,
  path: string,
  currentDay: number,
): Promise<ChallengeCompletionState> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return { streak: 0, isCurrentDayCompleted: false };
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data: completions, error } = await supabase
    .from("challenge_completions")
    .select("day")
    .eq("user_id", userId)
    .eq("path", path)
    .order("day", { ascending: true });

  if (error) {
    return { streak: 0, isCurrentDayCompleted: false };
  }

  const completedDays =
    completions
      ?.map((completion) => completion.day)
      .filter((day) => typeof day === "number") ?? [];

  return {
    streak: calculateConsecutiveStreak(completedDays),
    isCurrentDayCompleted: completedDays.includes(currentDay),
  };
}

function InvalidChallengeTokenPage() {
  return (
    <main className="min-h-screen bg-[#0A0915] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1d1b3c] via-[#0A0915] to-[#030209] px-4 py-10 text-slate-200 sm:px-6 sm:py-14 lg:px-10 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <section className="mx-auto max-w-xl rounded-3xl border border-red-500/20 bg-[#121124]/80 backdrop-blur-md p-6 shadow-2xl relative z-10 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-red-400">
          Invalid challenge link
        </p>
        <h1 className="mt-4 text-2xl font-black tracking-[-0.04em] sm:text-3xl text-white">
          This mission link could not be opened.
        </h1>
        <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-300">
          The link may be incomplete, expired, or from a different environment.
          Go back to Challenges and enter your email to get a fresh mission
          link.
        </p>
      </section>
    </main>
  );
}

export async function generateMetadata({
  params,
}: ChallengeTokenPageProps): Promise<Metadata> {
  const { token: rawToken } = await params;
  const token = decodeURIComponent(rawToken);
  let payload;
  try {
    payload = decryptChallengeToken(token);
  } catch {
    return {};
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  let email = "";
  if (supabaseUrl && supabaseServiceRoleKey) {
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data } = await supabase
      .from("waitlist")
      .select("email")
      .eq("id", payload.userId)
      .maybeSingle();
    if (data && data.email) {
      email = data.email;
    }
  }

  const localPart = email.split("@")[0] || "there";
  const firstChunk = localPart.split(/[._+-]/)[0] || "there";
  const firstName = firstChunk.charAt(0).toUpperCase() + firstChunk.slice(1);

  const coinLabels: Record<string, string> = {
    stability: "Stability",
    saving: "Saving",
    investing: "Investing",
  };
  const pathLabel = coinLabels[payload.path] || "Stability";

  const templates = challengeEmailTemplates[payload.path];
  const maxDay = templates.length > 0 ? templates.length - 1 : 0;
  const day =
    Number.isInteger(payload.day) && payload.day >= 0
      ? Math.min(payload.day, maxDay)
      : 0;

  const title = `${firstName}'s Day ${day} Challenge Completed! | Finlevels`;
  const description = `I just unlocked and completed Day ${day} of the Finlevels ${pathLabel} Path challenge! 🚀 Join me to build money habits and discover your money type.`;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://finlevels.app";
  const ogImageUrl = `${siteUrl}/api/og/challenge/${encodeURIComponent(token)}`;

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
          alt: `${firstName}'s Challenge Completion Card`,
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

export default async function ChallengeTokenPage({
  params,
}: ChallengeTokenPageProps) {
  const { token: rawToken } = await params;
  const token = decodeURIComponent(rawToken);
  let payload: ReturnType<typeof decryptChallengeToken>;

  try {
    payload = decryptChallengeToken(token);
  } catch {
    return <InvalidChallengeTokenPage />;
  }

  const templates = challengeEmailTemplates[payload.path];
  const maxDay = templates.length > 0 ? templates.length - 1 : 0;
  const day =
    Number.isInteger(payload.day) && payload.day >= 0
      ? Math.min(payload.day, maxDay)
      : 0;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  let email = "";
  let stabilityLevel = 3;
  let savingLevel = 3;
  let investingLevel = 3;

  let initialGoals: UserGoal[] = [];

  let plaidAccessToken = "";
  let plaidBankName = "";

  if (supabaseUrl && supabaseServiceRoleKey) {
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data } = await supabase
      .from("waitlist")
      .select("email, stability_level, saving_level, investing_level, goals, plaid_access_token, plaid_bank_name")
      .eq("id", payload.userId)
      .maybeSingle();
    if (data) {
      if (data.email) email = data.email;
      if (typeof data.stability_level === "number") stabilityLevel = data.stability_level;
      if (typeof data.saving_level === "number") savingLevel = data.saving_level;
      if (typeof data.investing_level === "number") investingLevel = data.investing_level;
      if (Array.isArray(data.goals)) initialGoals = data.goals;
      if (data.plaid_access_token) plaidAccessToken = data.plaid_access_token;
      if (data.plaid_bank_name) plaidBankName = data.plaid_bank_name;
    }
  }

  const localPart = email.split("@")[0] || "there";
  const firstChunk = localPart.split(/[._+-]/)[0] || "there";
  const firstName = firstChunk.charAt(0).toUpperCase() + firstChunk.slice(1);

  const completionState = await getChallengeCompletionState(
    payload.userId,
    payload.path,
    day,
  );

  return (
    <ChallengeTokenPageClient
      token={token}
      challengePath={payload.path}
      challengeDay={day}
      initialStreak={completionState.streak}
      initialIsCompleted={completionState.isCurrentDayCompleted}
      userName={firstName}
      userId={payload.userId}
      stabilityLevel={stabilityLevel}
      savingLevel={savingLevel}
      investingLevel={investingLevel}
      initialGoals={initialGoals}
      plaidAccessToken={plaidAccessToken}
      plaidBankName={plaidBankName}
    />
  );
}
