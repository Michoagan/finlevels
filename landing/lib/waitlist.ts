type WaitlistSource = "waitlist" | "quiz";
type WaitlistCoin = "stability" | "saving" | "investing";

type WaitlistQuizDetails = {
  profileName: string;
  stabilityLevel: number;
  savingLevel: number;
  investingLevel: number;
  coinPriority: readonly WaitlistCoin[];
  primaryFocusCoin: WaitlistCoin;
};

export async function saveWaitlistEmail(
  email: string,
  source: WaitlistSource,
  quizDetails?: WaitlistQuizDetails,
  recaptchaToken?: string,
): Promise<{ email: string; token: string | null; userId: number }> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new Error("Please enter a valid email address.");
  }

  const body: Record<string, unknown> = {
    email: normalizedEmail,
    source,
    recaptchaToken,
  };


  if (quizDetails) {
    const timezone =
      typeof Intl !== "undefined"
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : undefined;

    body.quizDetails = {
      profileName: quizDetails.profileName,
      stabilityLevel: quizDetails.stabilityLevel,
      savingLevel: quizDetails.savingLevel,
      investingLevel: quizDetails.investingLevel,
      coinPriority: quizDetails.coinPriority,
      primaryFocusCoin: quizDetails.primaryFocusCoin,
      timezone,
    };
  }

  const res = await fetch("/api/waitlist/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Unable to save waitlist entry right now.");
  }

  return {
    email: normalizedEmail,
    token: result.token || null,
    userId: result.userId || 0,
  };
}
