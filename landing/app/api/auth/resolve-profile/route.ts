import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { encryptChallengeToken } from "../../../../lib/challenge-token";
import type { ChallengePath } from "../../../../lib/challenges";


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



function isChallengePath(path: unknown): path is ChallengePath {
  return path === "stability" || path === "saving" || path === "investing";
}





export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;


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
