import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { encryptChallengeToken } from "../../../../lib/challenge-token";
import { challengeEmailTemplates } from "../../../../lib/challenge-email-templates";
import type { ChallengeEmailTemplate } from "../../../../lib/challenge-email-templates";
import type { ChallengePath } from "../../../../lib/challenges";
import {
  waitlistEmailTemplates,
  type WaitlistEmailTemplate,
} from "../../../../lib/waitlist-email-templates";

type QuizDetailsPayload = {
  profileName?: string;
  stabilityLevel?: number;
  savingLevel?: number;
  investingLevel?: number;
  coinPriority?: string[];
  primaryFocusCoin?: string;
  timezone?: string;
};

type RequestBody = {
  email?: string;
  source?: "waitlist" | "quiz";
  quizDetails?: QuizDetailsPayload;
  recaptchaToken?: string;
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

function renderParagraphs(lines: readonly string[]): string {
  return lines
    .map(
      (line) =>
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

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
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

  // Google reCAPTCHA v3 Verification
  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
  if (recaptchaSecret) {
    const recaptchaToken = body.recaptchaToken;
    if (!recaptchaToken) {
      return NextResponse.json(
        { error: "Security check failed. Please refresh the page and try again." },
        { status: 400 },
      );
    }

    try {
      const verifyResponse = await fetch(
        "https://www.google.com/recaptcha/api/siteverify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `secret=${encodeURIComponent(recaptchaSecret)}&response=${encodeURIComponent(recaptchaToken)}`,
        }
      );

      const verifyData = await verifyResponse.json();

      if (!verifyData.success || (verifyData.score !== undefined && verifyData.score < 0.5)) {
        console.warn("reCAPTCHA validation failed:", verifyData);
        return NextResponse.json(
          { error: "Security check failed (Bot activity detected). Please try again." },
          { status: 400 },
        );
      }
    } catch (error) {
      console.error("reCAPTCHA verification error:", error);
      return NextResponse.json(
        { error: "Security check service temporarily unavailable. Please try again later." },
        { status: 400 },
      );
    }
  } else {
    console.warn("RECAPTCHA_SECRET_KEY is not configured. Skipping CAPTCHA validation.");
  }

  const normalizedEmail =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const source =
    typeof body.source === "string"
      ? (body.source as "waitlist" | "quiz")
      : "waitlist";
  const quizDetails =
    typeof body.quizDetails === "object" && body.quizDetails !== null
      ? (body.quizDetails as QuizDetailsPayload)
      : undefined;

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

  const payload: Record<string, unknown> = {
    email: normalizedEmail,
    source,
  };

  if (quizDetails) {
    payload.profile_name =
      typeof quizDetails.profileName === "string"
        ? quizDetails.profileName
        : undefined;
    payload.stability_level =
      typeof quizDetails.stabilityLevel === "number"
        ? quizDetails.stabilityLevel
        : undefined;
    payload.saving_level =
      typeof quizDetails.savingLevel === "number"
        ? quizDetails.savingLevel
        : undefined;
    payload.investing_level =
      typeof quizDetails.investingLevel === "number"
        ? quizDetails.investingLevel
        : undefined;
    payload.coin_priority = Array.isArray(quizDetails.coinPriority)
      ? quizDetails.coinPriority
      : undefined;
    payload.primary_focus_coin =
      typeof quizDetails.primaryFocusCoin === "string"
        ? quizDetails.primaryFocusCoin
        : undefined;
    // allow client to optionally provide timezone (IANA) to preserve local scheduling
    if (typeof quizDetails.timezone === "string") {
      payload.timezone = quizDetails.timezone;
    }
  }

  // Upsert the waitlist row server-side using service role
  const { data: waitlistRow, error: upsertError } = await supabase
    .from("waitlist")
    .upsert(payload, { onConflict: "email" })
    .select("id, email, profile_name, primary_focus_coin, timezone")
    .maybeSingle();

  if (upsertError) {
    return NextResponse.json(
      { error: upsertError.message || "Unable to save waitlist entry." },
      { status: 500 },
    );
  }

  if (!waitlistRow || !waitlistRow.id || !waitlistRow.email) {
    return NextResponse.json(
      { error: "Upsert returned unexpected result." },
      { status: 500 },
    );
  }

  const userId = waitlistRow.id as number;
  const email = waitlistRow.email as string;
  const profileName = waitlistRow.profile_name as string | null;
  const primaryFocusCoin = waitlistRow.primary_focus_coin as string | null;

  // Quiz users: send day 0 immediately with email_sends dedup
  if (profileName && primaryFocusCoin && isChallengePath(primaryFocusCoin)) {
    const path = primaryFocusCoin as ChallengePath;
    if (resendApiKey) {
      const templates = challengeEmailTemplates[path];
      const day0Template = templates.find((t) => t.day === 0);
      if (day0Template) {
        const { data: alreadySent } = await supabase
          .from("email_sends")
          .select("day")
          .eq("user_id", userId)
          .eq("path", path)
          .eq("day", 0)
          .maybeSingle();
        if (!alreadySent) {
          const currentChallengeUrl = createChallengeUrl(
            userId,
            day0Template.currentChallengeCta.tokenTarget,
          );
          const firstName = getFirstName(email);
          const html = renderEmailHtml({
            template: day0Template,
            firstName,
            currentChallengeUrl,
            previousChallengeUrl: null,
          });
          const resendFrom =
            process.env.RESEND_FROM_EMAIL || "FinLevels <hello@finlevels.app>";
          const sendResponse = await fetch(resendEndpoint, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: resendFrom,
              to: email,
              subject: day0Template.subject,
              html,
            }),
          });
          if (sendResponse.ok) {
            await supabase.from("email_sends").insert({
              user_id: userId,
              path,
              day: 0,
              sent_at: new Date().toISOString(),
            });
          }
        }
      }
    }
    const token = encryptChallengeToken({ userId, path, day: 0 });
    return NextResponse.json({ email: normalizedEmail, scheduled: true, token, userId });
  }

  // Waitlist-only users: send day 0 immediately with email_sends dedup
  if (!quizDetails) {
    if (resendApiKey) {
      const day0Template = waitlistEmailTemplates.find((t) => t.day === 0);
      if (day0Template) {
        const { data: alreadySent } = await supabase
          .from("email_sends")
          .select("day")
          .eq("user_id", userId)
          .eq("path", "waitlist")
          .eq("day", 0)
          .maybeSingle();
        if (!alreadySent) {
          const quizUrl = `${getSiteUrl()}/quiz`;
          const firstName = getFirstName(email);
          const html = renderWaitlistEmailHtml({
            template: day0Template,
            firstName,
            quizUrl,
          });
          const resendFrom =
            process.env.RESEND_FROM_EMAIL || "FinLevels <hello@finlevels.app>";
          const sendResponse = await fetch(resendEndpoint, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: resendFrom,
              to: email,
              subject: day0Template.subject,
              html,
            }),
          });
          if (sendResponse.ok) {
            await supabase.from("email_sends").insert({
              user_id: userId,
              path: "waitlist",
              day: 0,
              sent_at: new Date().toISOString(),
            });
          }
        }
      }
    }
    return NextResponse.json({ email: normalizedEmail, scheduled: true, token: null, userId });
  }

  return NextResponse.json({ email: normalizedEmail, scheduled: false, token: null, userId });
}
