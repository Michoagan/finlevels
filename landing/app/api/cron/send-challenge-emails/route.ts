import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { encryptChallengeToken } from "../../../../lib/challenge-token";
import {
  challengeEmailTemplates,
  type ChallengeEmailCta,
  type ChallengeEmailTemplate,
} from "../../../../lib/challenge-email-templates";
import type { ChallengePath } from "../../../../lib/challenges";
import {
  waitlistEmailTemplates,
  type WaitlistEmailTemplate,
} from "../../../../lib/waitlist-email-templates";

type WaitlistChallengeUser = {
  id: number;
  email: string | null;
  profile_name: string | null;
  primary_focus_coin: string | null;
  created_at: string | null;
};

type LatestEmailSend = {
  day: number | null;
};

type SentChallengeDay = {
  day: number | null;
};

type CompletedChallengeDay = {
  day: number | null;
};

type SendResult = {
  userId: number;
  email: string;
  path: ChallengePath;
  day?: number;
  status: "sent" | "skipped" | "failed";
  reason?: string;
};

const resendEndpoint = "https://api.resend.com/emails";

function isChallengePath(path: unknown): path is ChallengePath {
  return path === "stability" || path === "saving" || path === "investing";
}

function getSiteUrl(): string {
  return (process.env.SITE_URL || "https://finlevels.app").replace(/\/$/, "");
}

function getFirstName(email: string): string {
  const localPart = email.split("@")[0] || "there";
  const firstChunk = localPart.split(/[._+-]/)[0] || "there";

  return firstChunk.charAt(0).toUpperCase() + firstChunk.slice(1);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createChallengeUrl(userId: number, cta: ChallengeEmailCta): string {
  const token = encryptChallengeToken({
    userId,
    path: cta.tokenTarget.path,
    day: cta.tokenTarget.day,
  });

  return `${getSiteUrl()}/challenges/${encodeURIComponent(token)}`;
}

function renderParagraphs(lines: readonly string[]): string {
  return lines
    .map(
      (line: string) =>
        `<p style="margin:0 0 16px;color:#464554;font-size:16px;line-height:1.7;font-weight:600;">${escapeHtml(line)}</p>`,
    )
    .join("");
}

function renderListLikeParagraphs(lines: readonly string[]): string {
  return lines
    .map((line: string) => {
      const isHeading = line.endsWith(":");
      const style = isHeading
        ? "margin:18px 0 8px;color:#1b1b23;font-size:16px;line-height:1.6;font-weight:900;"
        : "margin:0 0 10px;color:#464554;font-size:16px;line-height:1.7;font-weight:600;";

      return `<p style="${style}">${escapeHtml(line)}</p>`;
    })
    .join("");
}

function renderCta(label: string, href: string): string {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;margin:10px 0 24px;background:#4648d4;color:#ffffff;text-decoration:none;border-radius:999px;padding:14px 22px;font-size:14px;font-weight:900;">${escapeHtml(label)}</a>`;
}

function renderEmailHtml({
  template,
  firstName,
  currentChallengeUrl,
  previousChallengeUrl,
}: {
  template: ChallengeEmailTemplate;
  firstName: string;
  currentChallengeUrl: string;
  previousChallengeUrl: string | null;
}): string {
  const introLines = previousChallengeUrl
    ? template.intro
    : template.intro.filter((line) => line.trim().toLowerCase() !== "if not:");

  const greeting = template.greeting.replace("{{first_name}}", firstName);

  return `<!doctype html>
<html>
  <body style="margin:0;background:#f5f2fe;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#1b1b23;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid rgba(70,72,212,0.15);border-radius:32px;padding:32px;box-shadow:0 24px 80px rgba(70,72,212,0.10);">
      <p style="margin:0 0 12px;color:#4648d4;font-size:12px;font-weight:900;letter-spacing:0.16em;text-transform:uppercase;">FinLevels Challenge</p>
      <h1 style="margin:0 0 24px;color:#1b1b23;font-size:32px;line-height:1.1;font-weight:900;letter-spacing:-0.04em;">${escapeHtml(template.title)}</h1>
      <p style="margin:0 0 18px;color:#1b1b23;font-size:18px;line-height:1.6;font-weight:900;">${escapeHtml(greeting)}</p>
      ${renderParagraphs(introLines)}
      ${previousChallengeUrl && template.previousChallengeCta ? renderCta(template.previousChallengeCta.label, previousChallengeUrl) : ""}
      ${renderParagraphs(template.lesson)}
      <div style="margin:24px 0;padding:20px;border-radius:24px;background:#f5f2fe;border:1px solid #e7e1f6;">
        ${renderListLikeParagraphs(template.challenge)}
      </div>
      ${renderCta(template.currentChallengeCta.label, currentChallengeUrl)}
      ${renderParagraphs(template.outro)}
      <p style="margin:24px 0 0;color:#464554;font-size:15px;line-height:1.7;font-weight:700;">${escapeHtml(template.signature)}</p>
    </div>
  </body>
</html>`;
}

function renderWaitlistEmailHtml({
  template,
  firstName,
  quizUrl,
}: {
  template: WaitlistEmailTemplate;
  firstName: string;
  quizUrl: string;
}): string {
  const greeting = template.greeting.replace("{{first_name}}", firstName);

  return `<!doctype html>
<html>
  <body style="margin:0;background:#f5f2fe;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#1b1b23;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid rgba(70,72,212,0.15);border-radius:32px;padding:32px;box-shadow:0 24px 80px rgba(70,72,212,0.10);">
      <p style="margin:0 0 12px;color:#4648d4;font-size:12px;font-weight:900;letter-spacing:0.16em;text-transform:uppercase;">FinLevels</p>
      <h1 style="margin:0 0 24px;color:#1b1b23;font-size:32px;line-height:1.1;font-weight:900;letter-spacing:-0.04em;">${escapeHtml(template.title)}</h1>
      <p style="margin:0 0 18px;color:#1b1b23;font-size:18px;line-height:1.6;font-weight:900;">${escapeHtml(greeting)}</p>
      ${renderParagraphs(template.intro)}
      ${template.lesson.length > 0 ? renderParagraphs(template.lesson) : ""}
      ${
        template.challenge.length > 0
          ? `<div style="margin:24px 0;padding:20px;border-radius:24px;background:#f5f2fe;border:1px solid #e7e1f6;">${renderListLikeParagraphs(template.challenge)}</div>`
          : ""
      }
      ${renderCta(template.currentCtaLabel, quizUrl)}
      ${template.outro.length > 0 ? renderParagraphs(template.outro) : ""}
      <p style="margin:24px 0 0;color:#464554;font-size:15px;line-height:1.7;font-weight:700;">${escapeHtml(template.signature)}</p>
    </div>
  </body>
</html>`;
}

function isAuthorized(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return true;
  }

  const authorization = request.headers.get("authorization");
  const cronSecretHeader = request.headers.get("x-cron-secret");

  return (
    authorization === `Bearer ${cronSecret}` || cronSecretHeader === cronSecret
  );
}

async function sendChallengeEmail(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (process.env.CHALLENGE_EMAIL_CRON_ENABLED !== "true") {
    return NextResponse.json({
      skipped: true,
      reason:
        "Challenge email cron is disabled. Set CHALLENGE_EMAIL_CRON_ENABLED=true to enable sending.",
    });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFrom =
    process.env.RESEND_FROM_EMAIL || "FinLevels <hello@finlevels.app>";

  if (!supabaseUrl || !supabaseServiceRoleKey || !resendApiKey) {
    return NextResponse.json(
      {
        error:
          "Service temporarily unavailable. Please try again later.",
      },
      { status: 500 },
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data: users, error: usersError } = await supabase
    .from("waitlist")
    .select("id, email, profile_name, primary_focus_coin, created_at")
    .not("profile_name", "is", null)
    .not("primary_focus_coin", "is", null);

  if (usersError) {
    return NextResponse.json(
      { error: usersError.message || "Unable to fetch quiz users." },
      { status: 500 },
    );
  }

  const results: SendResult[] = [];

  for (const user of (users ?? []) as WaitlistChallengeUser[]) {
    if (!Number.isInteger(user.id) || !user.email) {
      continue;
    }

    const email = user.email.trim().toLowerCase();
    const path =
      typeof user.primary_focus_coin === "string"
        ? user.primary_focus_coin.trim().toLowerCase()
        : user.primary_focus_coin;

    if (!email || !isChallengePath(path)) {
      results.push({
        userId: user.id,
        email: email || "unknown",
        path: "stability",
        status: "skipped",
        reason: "Missing email or valid primary focus coin.",
      });
      continue;
    }

    const templates: readonly ChallengeEmailTemplate[] =
      challengeEmailTemplates[path];

    if (templates.length === 0) {
      results.push({
        userId: user.id,
        email,
        path,
        status: "skipped",
        reason: "No templates configured for this path.",
      });
      continue;
    }

    const { data: latestEmailSend, error: latestEmailSendError } =
      await supabase
        .from("email_sends")
        .select("day")
        .eq("user_id", user.id)
        .eq("path", path)
        .order("day", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (latestEmailSendError) {
      results.push({
        userId: user.id,
        email,
        path,
        status: "failed",
        reason:
          latestEmailSendError.message || "Unable to fetch latest email send.",
      });
      continue;
    }

    const lastSentDay =
      typeof (latestEmailSend as LatestEmailSend | null)?.day === "number"
        ? (latestEmailSend as LatestEmailSend).day
        : null;
    const nextDay = lastSentDay === null ? 0 : lastSentDay + 1;

    // Email is due at created_at + nextDay * 2 days
    const createdAt = user.created_at ? new Date(user.created_at) : null;
    if (createdAt) {
      const dueAt = createdAt.getTime() + nextDay * 2 * 24 * 60 * 60 * 1000;
      if (dueAt > Date.now()) {
        results.push({
          userId: user.id,
          email,
          path,
          day: nextDay,
          status: "skipped",
          reason: "Email not due yet.",
        });
        continue;
      }
    }

    const template = templates.find((item) => item.day === nextDay);

    if (!template) {
      results.push({
        userId: user.id,
        email,
        path,
        day: nextDay,
        status: "skipped",
        reason: "Track completed or missing template for next day.",
      });
      continue;
    }

    const { data: sentDays, error: sentDaysError } = await supabase
      .from("email_sends")
      .select("day")
      .eq("user_id", user.id)
      .eq("path", path)
      .lt("day", nextDay)
      .order("day", { ascending: false });

    const { data: completedDays, error: completedDaysError } = await supabase
      .from("challenge_completions")
      .select("day")
      .eq("user_id", user.id)
      .eq("path", path);

    if (sentDaysError || completedDaysError) {
      results.push({
        userId: user.id,
        email,
        path,
        day: nextDay,
        status: "failed",
        reason:
          sentDaysError?.message ||
          completedDaysError?.message ||
          "Unable to check missed challenges.",
      });
      continue;
    }

    const completedDaySet = new Set(
      ((completedDays ?? []) as CompletedChallengeDay[])
        .map((item) => item.day)
        .filter((day): day is number => typeof day === "number"),
    );
    const missedPreviousDay = ((sentDays ?? []) as SentChallengeDay[])
      .map((item) => item.day)
      .find(
        (day): day is number =>
          typeof day === "number" && !completedDaySet.has(day),
      );
    const previousChallengeUrl =
      typeof missedPreviousDay === "number" && template.previousChallengeCta
        ? createChallengeUrl(user.id, {
            ...template.previousChallengeCta,
            tokenTarget: {
              path,
              day: missedPreviousDay,
            },
          })
        : null;
    const currentChallengeUrl = createChallengeUrl(
      user.id,
      template.currentChallengeCta,
    );
    const firstName = getFirstName(email);
    const html = renderEmailHtml({
      template,
      firstName,
      currentChallengeUrl,
      previousChallengeUrl,
    });

    const resendResponse = await fetch(resendEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: resendFrom,
        to: email,
        subject: template.subject,
        html,
      }),
    });

    if (!resendResponse.ok) {
      const resendError = await resendResponse.text();
      results.push({
        userId: user.id,
        email,
        path,
        day: nextDay,
        status: "failed",
        reason: resendError || "Resend rejected the email.",
      });
      continue;
    }

    const { error: logError } = await supabase
      .from("email_sends")
      .insert({
        user_id: user.id,
        path,
        day: nextDay,
        sent_at: new Date().toISOString(),
      });

    if (logError) {
      results.push({
        userId: user.id,
        email,
        path,
        day: nextDay,
        status: "failed",
        reason: `Email sent, but send log failed: ${
          logError.message || "Unknown Supabase error."
        }`,
      });
      continue;
    }

    results.push({
      userId: user.id,
      email,
      path,
      day: nextDay,
      status: "sent",
    });
  }

  // Process waitlist-only email sequence — mirrors quiz logic using email_sends with path='waitlist'
  type WaitlistOnlyUser = {
    id: number;
    email: string | null;
    created_at: string | null;
  };

  type WaitlistSendResult = {
    userId: number;
    email: string;
    day: number;
    status: "sent" | "skipped" | "failed";
    reason?: string;
  };

  const waitlistResults: WaitlistSendResult[] = [];
  const quizUrl = `${getSiteUrl()}/quiz`;

  const { data: waitlistOnlyUsers, error: waitlistOnlyError } = await supabase
    .from("waitlist")
    .select("id, email, created_at")
    .is("profile_name", null)
    .not("email", "is", null);

  if (!waitlistOnlyError) {
    for (const user of (waitlistOnlyUsers ?? []) as WaitlistOnlyUser[]) {
      if (!Number.isInteger(user.id) || !user.email) continue;

      const { data: latestWlSend, error: latestWlSendError } = await supabase
        .from("email_sends")
        .select("day")
        .eq("user_id", user.id)
        .eq("path", "waitlist")
        .order("day", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latestWlSendError) {
        waitlistResults.push({
          userId: user.id,
          email: user.email,
          day: 0,
          status: "failed",
          reason: latestWlSendError.message || "Unable to fetch latest email send.",
        });
        continue;
      }

      const lastWlSentDay =
        typeof (latestWlSend as LatestEmailSend | null)?.day === "number"
          ? (latestWlSend as LatestEmailSend).day
          : null;

      if (lastWlSentDay === null) continue;

      const nextDay = lastWlSentDay + 1;
      const template = waitlistEmailTemplates.find((t) => t.day === nextDay);

      if (!template) {
        waitlistResults.push({
          userId: user.id,
          email: user.email,
          day: nextDay,
          status: "skipped",
          reason: "Sequence completed or no template for this day.",
        });
        continue;
      }

      const createdAt = user.created_at ? new Date(user.created_at) : null;
      if (createdAt) {
        const dueAt = createdAt.getTime() + nextDay * 2 * 24 * 60 * 60 * 1000;
        if (dueAt > Date.now()) {
          waitlistResults.push({
            userId: user.id,
            email: user.email,
            day: nextDay,
            status: "skipped",
            reason: "Email not due yet.",
          });
          continue;
        }
      }

      const wlEmail = user.email.trim().toLowerCase();
      const wlHtml = renderWaitlistEmailHtml({
        template,
        firstName: getFirstName(wlEmail),
        quizUrl,
      });

      const wlResendResponse = await fetch(resendEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: resendFrom,
          to: wlEmail,
          subject: template.subject,
          html: wlHtml,
        }),
      });

      if (!wlResendResponse.ok) {
        const wlResendError = await wlResendResponse.text();
        waitlistResults.push({
          userId: user.id,
          email: wlEmail,
          day: nextDay,
          status: "failed",
          reason: wlResendError || "Resend rejected the email.",
        });
        continue;
      }

      const { error: logError } = await supabase.from("email_sends").insert({
        user_id: user.id,
        path: "waitlist",
        day: nextDay,
        sent_at: new Date().toISOString(),
      });

      if (logError) {
        waitlistResults.push({
          userId: user.id,
          email: wlEmail,
          day: nextDay,
          status: "failed",
          reason: `Email sent but log failed: ${logError.message}`,
        });
        continue;
      }

      waitlistResults.push({
        userId: user.id,
        email: wlEmail,
        day: nextDay,
        status: "sent",
      });
    }
  }

  return NextResponse.json({
    sent: results.filter((result) => result.status === "sent").length,
    skipped: results.filter((result) => result.status === "skipped").length,
    failed: results.filter((result) => result.status === "failed").length,
    results,
    waitlist: {
      sent: waitlistResults.filter((r) => r.status === "sent").length,
      skipped: waitlistResults.filter((r) => r.status === "skipped").length,
      failed: waitlistResults.filter((r) => r.status === "failed").length,
      results: waitlistResults,
    },
  });
}

export async function GET(request: Request) {
  return sendChallengeEmail(request);
}

export async function POST(request: Request) {
  return sendChallengeEmail(request);
}
