import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { encryptChallengeToken } from "../../../../lib/challenge-token";
import type { ChallengePath } from "../../../../lib/challenges";
import { challengeEmailTemplates } from "../../../../lib/challenge-email-templates";
import type { ChallengeEmailTemplate } from "../../../../lib/challenge-email-templates";

type QuizDetails = {
  profileName: string;
  stabilityLevel: number;
  savingLevel: number;
  investingLevel: number;
  coinPriority: string[];
  primaryFocusCoin: string;
};

type RequestBody = {
  email?: string;
  quizDetails?: QuizDetails;
};

const resendEndpoint = "https://api.resend.com/emails";

function isChallengePath(path: unknown): path is ChallengePath {
  return path === "stability" || path === "saving" || path === "investing";
}

// Helper: Normalize site URL to not end with a trailing slash
function getSiteUrl(): string {
  return (process.env.SITE_URL || "https://finlevels.app").replace(/\/$/, "");
}

// Helper: Extract user's first name from their email address
function getFirstName(email: string): string {
  const localPart = email.split("@")[0] || "there";
  const firstChunk = localPart.split(/[._+-]/)[0] || "there";
  return firstChunk.charAt(0).toUpperCase() + firstChunk.slice(1);
}

// Helper: HTML-escape dynamic content to protect email layout
function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Helper: Wrap lines in paragraph tags
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

// Helper: Wrap challenge steps in stylized lines (differentiating headings)
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

// Helper: Generate a styled CTA button block
function renderCta(label: string, href: string): string {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;margin:10px 0 24px;background:#4648d4;color:#ffffff;text-decoration:none;border-radius:999px;padding:14px 22px;font-size:14px;font-weight:900;">${escapeHtml(label)}</a>`;
}

// Helper: Render the HTML template for the email body
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

// Helper: Encrypt the challenge token to generate email links
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
      { error: "Service temporarily unavailable. Please try again later." },
      { status: 500 }
    );
  }

  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const rawEmail = body.email;
  if (typeof rawEmail !== "string" || !rawEmail.trim()) {
    return NextResponse.json(
      { error: "Email address is required." },
      { status: 400 }
    );
  }

  const email = rawEmail.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }
  const quizDetails = body.quizDetails;

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  try {
    // 1. Recherche du profil existant
    const { data: existingUser, error: findError } = await supabase
      .from("waitlist")
      .select("id, profile_name, primary_focus_coin")
      .eq("email", email)
      .maybeSingle();

    if (findError) {
      throw findError;
    }

    let userId: number;
    let primaryFocusCoin: ChallengePath = "stability";

    if (existingUser) {
      userId = existingUser.id;
      
      // Si l'utilisateur a des quizDetails frais à lier, on met à jour son profil
      if (quizDetails) {
        const focusCoin = isChallengePath(quizDetails.primaryFocusCoin)
          ? quizDetails.primaryFocusCoin
          : "stability";
        primaryFocusCoin = focusCoin;

        const { error: updateError } = await supabase
          .from("waitlist")
          .update({
            primary_focus_coin: focusCoin,
          })
          .eq("id", userId);

        if (updateError) {
          throw updateError;
        }
      } else {
        primaryFocusCoin = isChallengePath(existingUser.primary_focus_coin)
          ? existingUser.primary_focus_coin
          : "stability";
      }
    } else {
      // L'utilisateur n'existe pas en base.
      // S'il clique sur Login sans avoir de quiz en attente (donc pas de quizDetails),
      // il doit obligatoirement faire le quiz d'abord.
      if (!quizDetails) {
        return NextResponse.json({ redirectTo: "/quiz" });
      }

      // Création d'un nouveau profil avec les quizDetails
      const focusCoin = isChallengePath(quizDetails.primaryFocusCoin)
        ? quizDetails.primaryFocusCoin
        : "stability";
      primaryFocusCoin = focusCoin;

      const dataToInsert: Record<string, unknown> = {
        email,
        source: "google-oauth",
        primary_focus_coin: focusCoin,
      };

      const { data: newUser, error: insertError } = await supabase
        .from("waitlist")
        .insert(dataToInsert)
        .select("id")
        .single();

      if (insertError) {
        throw insertError;
      }

      userId = newUser.id;
    }

    // 2. Initial email sending has been moved to plaid transaction analysis completion.


    // 3. Génération du token chiffré
    const token = encryptChallengeToken({
      userId,
      path: primaryFocusCoin,
      day: 1,
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Profile resolution error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to resolve profile." },
      { status: 500 }
    );
  }
}
