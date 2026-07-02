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

    const { userId, path, day } = payload;

    // Fetch user details from waitlist table to get profile name
    const { data: userProfile } = await supabase
      .from("waitlist")
      .select("email, profile_name")
      .eq("id", userId)
      .maybeSingle();

    const email = (userProfile && userProfile.email) || "";
    const localPart = email.split("@")[0] || "there";
    const firstChunk = localPart.split(/[._+-]/)[0] || "there";
    const firstName = firstChunk.charAt(0).toUpperCase() + firstChunk.slice(1);

    // Fetch challenge completions to calculate streak/level
    const { data: completions, error: completionsError } = await supabase
      .from("challenge_completions")
      .select("path")
      .eq("user_id", userId);

    const totalCompletions = completionsError || !completions ? 0 : completions.length;
    const playerLevel = Math.floor(totalCompletions / 3) + 1;

    const origin = new URL(request.url).origin;
    
    const coinLabels: Record<string, string> = {
      stability: "Stability",
      saving: "Saving",
      investing: "Investing",
    };

    const coinImages: Record<string, string> = {
      stability: "coin-stability.png",
      saving: "coin-saving.png",
      investing: "coin-investing.png",
    };

    const coinColors: Record<string, string> = {
      stability: "#7c7eff",
      saving: "#20c9b8",
      investing: "#f5a623",
    };

    const coinAccentColor = coinColors[path] || "#4648d4";
    const coinLabel = coinLabels[path] || "Stability";
    const coinImgUrl = `${origin}/${coinImages[path] || "coin-stability.png"}`;
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
          {/* Left Column */}
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
            <div style={{ display: "flex", flexDirection: "column", marginTop: "30px" }}>
              <span style={{ fontSize: "14px", fontWeight: 900, color: coinAccentColor, letterSpacing: "0.22em" }}>
                {firstName.toUpperCase()}&apos;S QUEST COMPLETE
              </span>
              <span style={{ fontSize: "44px", fontWeight: 900, color: "#ffffff", marginTop: "8px", lineHeight: "1.1" }}>
                Day {day} Completed!
              </span>
              <span style={{ fontSize: "18px", color: "rgba(255, 255, 255, 0.4)", fontWeight: 600, marginTop: "12px" }}>
                Active Path: {coinLabel}
              </span>
            </div>

            {/* Footer Tagline */}
            <div style={{ display: "flex", flexDirection: "column", marginTop: "30px" }}>
              <span style={{ fontSize: "16px", fontWeight: 800, color: "#E4FF30" }}>
                Money skills. Built for real life.
              </span>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "4px" }}>
                finlevels.app
              </span>
            </div>
          </div>

          {/* Right Column: Quest Badge Graphic */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "40%",
              height: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "220px",
                height: "220px",
                backgroundColor: `${coinAccentColor}15`,
                borderRadius: "110px",
                border: `3px dashed ${coinAccentColor}45`,
                boxShadow: `0 0 40px ${coinAccentColor}20`,
                position: "relative",
              }}
            >
              <img
                src={coinImgUrl}
                alt={coinLabel}
                style={{
                  width: "130px",
                  height: "130px",
                  objectFit: "contain",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: "28px", fontWeight: 900, color: "#ffffff" }}>{totalCompletions}</span>
                <span style={{ fontSize: "10px", fontWeight: 800, color: "rgba(255, 255, 255, 0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Quests Done</span>
              </div>
              <div style={{ width: "1px", height: "30px", backgroundColor: "rgba(255, 255, 255, 0.15)", marginTop: "8px" }} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ fontSize: "28px", fontWeight: 900, color: coinAccentColor }}>Lv.{playerLevel}</span>
                <span style={{ fontSize: "10px", fontWeight: 800, color: "rgba(255, 255, 255, 0.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Player Level</span>
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
    console.error("Error generating OG challenge card:", error);
    return new Response("Error generating image", { status: 500 });
  }
}
