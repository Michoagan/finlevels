/* eslint-disable @next/next/no-img-element */
import { createClient } from "@supabase/supabase-js";
import { decryptChallengeToken } from "../../../../../lib/challenge-token";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!sbUrl || !sbKey) {
  throw new Error("Missing Supabase credentials in server environment.");
}

const supabase = createClient(sbUrl, sbKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ token: string }> }
) {
  try {
    const { token: rawToken } = await props.params;
    const token = decodeURIComponent(rawToken);
    
    let payload;
    try {
      payload = decryptChallengeToken(token);
    } catch {
      return new Response("Invalid token signature", { status: 400 });
    }

    const userId = payload.userId;

    // Fetch user details from waitlist table
    const { data: userProfile, error: profileError } = await supabase
      .from("waitlist")
      .select("email, profile_name, stability_level, saving_level, investing_level, primary_focus_coin")
      .eq("id", userId)
      .maybeSingle();

    if (profileError || !userProfile) {
      return new Response("Profile not found", { status: 404 });
    }

    const email = userProfile.email || "";
    const localPart = email.split("@")[0] || "there";
    const firstChunk = localPart.split(/[._+-]/)[0] || "there";
    const firstName = firstChunk.charAt(0).toUpperCase() + firstChunk.slice(1);

    // Fetch challenge completions to calculate real level
    const { data: completions, error: completionsError } = await supabase
      .from("challenge_completions")
      .select("path")
      .eq("user_id", userId);

    const totalCompletions = completionsError || !completions ? 0 : completions.length;
    const playerLevel = Math.floor(totalCompletions / 3) + 1;

    const profileName = userProfile.profile_name || "The Survivor";
    const stabilityLevel = Math.min(Math.max(Math.round(userProfile.stability_level || 0), 0), 5);
    const savingLevel = Math.min(Math.max(Math.round(userProfile.saving_level || 0), 0), 5);
    const investingLevel = Math.min(Math.max(Math.round(userProfile.investing_level || 0), 0), 5);

    const origin = new URL(request.url).origin;
    
    const logoUrl = `${origin}/logo-purple.svg`;

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#0d0d1a",
            backgroundImage: "radial-gradient(circle at center, #1b1040 0%, #0d0d1a 100%)",
            padding: "50px 80px",
            fontFamily: "sans-serif",
            color: "#ffffff",
          }}
        >
          {/* Left Column: Archetype Detail */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "space-between",
              width: "50%",
            }}
          >
            {/* Header Brand */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src={logoUrl} alt="Logo" style={{ width: "32px", height: "32px" }} />
              <span style={{ fontSize: "24px", fontWeight: 900, color: "#4648d4", letterSpacing: "-0.03em" }}>
                Finlevels
              </span>
            </div>

            {/* Title Block */}
            <div style={{ display: "flex", flexDirection: "column", marginTop: "40px" }}>
              <span style={{ fontSize: "14px", fontWeight: 800, color: "#E4FF30", letterSpacing: "0.2em" }}>
                {firstName.toUpperCase()}&apos;S ARCHETYPE
              </span>
              <span style={{ fontSize: "44px", fontWeight: 900, color: "#ffffff", marginTop: "8px", lineHeight: "1.1" }}>
                {profileName}
              </span>
              <span style={{ fontSize: "18px", color: "rgba(255, 255, 255, 0.4)", fontWeight: 600, marginTop: "12px" }}>
                Unlocked Level {playerLevel} Master
              </span>
            </div>

            {/* Footer Tagline */}
            <div style={{ display: "flex", flexDirection: "column", marginTop: "40px" }}>
              <span style={{ fontSize: "16px", fontWeight: 800, color: "#E4FF30" }}>
                Money skills. Built for real life.
              </span>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "4px" }}>
                finlevels.app
              </span>
            </div>
          </div>

          {/* Right Column: Skill DNA */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: "45%",
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "28px",
              padding: "36px",
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: 900, color: "#E4FF30", letterSpacing: "0.15em", marginBottom: "20px" }}>
              SKILL DNA SCORE
            </span>

            {/* Stability */}
            <div style={{ display: "flex", flexDirection: "column", width: "100%", marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "16px", fontWeight: 800, color: "#7c7eff" }}>Stability</span>
                <span style={{ fontSize: "14px", fontWeight: 800, color: "#7c7eff" }}>{stabilityLevel}/5</span>
              </div>
              <div style={{ display: "flex", width: "100%", height: "10px", backgroundColor: "rgba(255, 255, 255, 0.08)", borderRadius: "5px" }}>
                <div style={{ display: "flex", width: `${(stabilityLevel / 5) * 100}%`, height: "100%", backgroundColor: "#7c7eff", borderRadius: "5px" }} />
              </div>
            </div>

            {/* Saving */}
            <div style={{ display: "flex", flexDirection: "column", width: "100%", marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "16px", fontWeight: 800, color: "#20c9b8" }}>Saving</span>
                <span style={{ fontSize: "14px", fontWeight: 800, color: "#20c9b8" }}>{savingLevel}/5</span>
              </div>
              <div style={{ display: "flex", width: "100%", height: "10px", backgroundColor: "rgba(255, 255, 255, 0.08)", borderRadius: "5px" }}>
                <div style={{ display: "flex", width: `${(savingLevel / 5) * 100}%`, height: "100%", backgroundColor: "#20c9b8", borderRadius: "5px" }} />
              </div>
            </div>

            {/* Investing */}
            <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "16px", fontWeight: 800, color: "#f5a623" }}>Investing</span>
                <span style={{ fontSize: "14px", fontWeight: 800, color: "#f5a623" }}>{investingLevel}/5</span>
              </div>
              <div style={{ display: "flex", width: "100%", height: "10px", backgroundColor: "rgba(255, 255, 255, 0.08)", borderRadius: "5px" }}>
                <div style={{ display: "flex", width: `${(investingLevel / 5) * 100}%`, height: "100%", backgroundColor: "#f5a623", borderRadius: "5px" }} />
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error("Error generating OG profile card:", error);
    return new Response("Error generating image", { status: 500 });
  }
}
