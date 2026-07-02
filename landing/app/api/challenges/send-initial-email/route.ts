import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { encryptChallengeToken } from "../../../../lib/challenge-token";
import { challengeEmailTemplates } from "../../../../lib/challenge-email-templates";
import type { ChallengeEmailTemplate } from "../../../../lib/challenge-email-templates";
import type { ChallengePath } from "../../../../lib/challenges";

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

function createChallengeUrl(
  userId: number,
  tokenTarget: { path: ChallengePath; day: number },
): string {
  const token = encryptChallengeToken({
    userId,
    path: tokenTarget.path,
    day: tokenTarget.day,
  });

  return `${getSiteUrl()}/challenges/${encodeURIComponent(token)}`;
}

function renderParagraphs(lines: readonly string[]): string {
  return lines
    .map(
      (line: string) =>
        `<p style="margin:0 0 16px;color:#464554;font-size:16px;line-height:1.7;font-weight:600;">${escapeHtml(
          line,
        )}</p>`,
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
    : template.intro.filter(
        (line: string) => line.trim().toLowerCase() !== "if not:",
      );

  const greeting = template.greeting.replace("{{first_name}}", firstName);

  return `<!doctype html>
<html>
  <body style="margin:0;background:#f5f2fe;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#1b1b23;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid rgba(70,72,212,0.15);border-radius:32px;padding:32px;box-shadow:0 24px 80px rgba(70,72,212,0.10);">
      <p style="margin:0 0 12px;color:#4648d4;font-size:12px;font-weight:900;letter-spacing:0.16em;text-transform:uppercase;">FinLevels Challenge</p>
      <h1 style="margin:0 0 24px;color:#1b1b23;font-size:32px;line-height:1.1;font-weight:900;letter-spacing:-0.04em;">${escapeHtml(
        template.title,
      )}</h1>
      <p style="margin:0 0 18px;color:#1b1b23;font-size:18px;line-height:1.6;font-weight:900;">${escapeHtml(
        greeting,
      )}</p>
      ${renderParagraphs(introLines)}
      ${previousChallengeUrl && template.previousChallengeCta ? renderCta(template.previousChallengeCta.label, previousChallengeUrl) : ""}
      ${renderParagraphs(template.lesson)}
      <div style="margin:24px 0;padding:20px;border-radius:24px;background:#f5f2fe;border:1px solid #e7e1f6;">
        ${renderListLikeParagraphs(template.challenge)}
      </div>
      ${renderCta(template.currentChallengeCta.label, currentChallengeUrl)}
      ${renderParagraphs(template.outro)}
      <p style="margin:24px 0 0;color:#464554;font-size:15px;line-height:1.7;font-weight:700;">${escapeHtml(
        template.signature,
      )}</p>
    </div>
  </body>
</html>`;
}

type RequestBody = {
  email?: unknown;
};

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey || !resendApiKey) {
    return NextResponse.json(
      {
        error:
          "Service temporarily unavailable. Please try again later.",
      },
      { status: 500 },
    );
  }

  let body: RequestBody;

  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const normalizedEmail =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!normalizedEmail || !emailRegex.test(normalizedEmail)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: waitlistEntry, error: waitlistError } = await supabase
    .from("waitlist")
    .select("id, email, profile_name, primary_focus_coin")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (waitlistError || !waitlistEntry) {
    return NextResponse.json(
      {
        error:
          waitlistError?.message || "No waitlist entry found for that email.",
      },
      { status: 404 },
    );
  }

  const {
    id: userId,
    email,
    profile_name: profileName,
    primary_focus_coin,
  } = waitlistEntry as {
    id: number;
    email: string | null;
    profile_name: string | null;
    primary_focus_coin: string | null;
  };

  if (!email || !profileName || !primary_focus_coin) {
    return NextResponse.json({
      skipped: true,
      reason: "User does not have a saved quiz profile or primary focus coin.",
    });
  }

  const path =
    typeof primary_focus_coin === "string"
      ? primary_focus_coin.trim().toLowerCase()
      : primary_focus_coin;

  if (!isChallengePath(path)) {
    return NextResponse.json({
      skipped: true,
      reason: "Invalid primary focus coin.",
    });
  }

  const templates = challengeEmailTemplates[path];
  const nextDay = 0;
  const template = templates.find((item) => item.day === nextDay);

  if (!template) {
    return NextResponse.json({
      skipped: true,
      reason: "No template configured for day 0.",
    });
  }

  // Check existing sends to avoid duplicates
  const { data: latestEmailSend, error: latestEmailSendError } = await supabase
    .from("email_sends")
    .select("day")
    .eq("user_id", userId)
    .eq("path", path)
    .order("day", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestEmailSendError) {
    return NextResponse.json(
      {
        error:
          latestEmailSendError.message || "Unable to fetch latest email send.",
      },
      { status: 500 },
    );
  }

  const lastSentDay =
    typeof (latestEmailSend as { day: number | null } | null)?.day === "number"
      ? (latestEmailSend as { day: number | null }).day
      : null;

  if (lastSentDay !== null) {
    return NextResponse.json({
      skipped: true,
      reason: "Initial email already sent.",
    });
  }

  // Determine previous challenge URL if needed (none for day 0)
  const previousChallengeUrl = null;
  const currentChallengeUrl = createChallengeUrl(userId, {
    path,
    day: nextDay,
  });
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
      from: process.env.RESEND_FROM_EMAIL || "FinLevels <hello@finlevels.app>",
      to: email,
      subject: template.subject,
      html,
    }),
  });

  if (!resendResponse.ok) {
    const resendError = await resendResponse.text();
    return NextResponse.json(
      { error: resendError || "Resend rejected the email." },
      { status: 500 },
    );
  }

  const { error: logError } = await supabase
    .from("email_sends")
    .insert({
      user_id: userId,
      path,
      day: nextDay,
      sent_at: new Date().toISOString(),
    });

  if (logError) {
    return NextResponse.json(
      { error: logError.message || "Email sent, but log failed." },
      { status: 500 },
    );
  }

  return NextResponse.json({ sent: true, day: nextDay });
}
