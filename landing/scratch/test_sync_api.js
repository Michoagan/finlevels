const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// Read env variables manually from .env.local
let supabaseUrl = "";
let supabaseServiceRoleKey = "";
let challengeTokenSecret = "";

try {
  const envContent = fs.readFileSync(path.join(__dirname, "../.env.local"), "utf8");
  const lines = envContent.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const parts = trimmed.split("=");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join("=").trim().replace(/^['"]|['"]$/g, "");
      if (key === "NEXT_PUBLIC_SUPABASE_URL") supabaseUrl = val;
      if (key === "SUPABASE_SERVICE_ROLE_KEY") supabaseServiceRoleKey = val;
      if (key === "CHALLENGE_TOKEN_SECRET") challengeTokenSecret = val;
    }
  }
} catch (err) {
  console.error("Could not read .env.local file:", err.message);
  process.exit(1);
}

// Generate encrypted challenge token for user 47
const crypto = require("crypto");
const algorithm = "aes-256-gcm";
const tokenVersion = "v1";

function getEncryptionKey() {
  return crypto.createHash("sha256").update(challengeTokenSecret).digest();
}

function toBase64Url(buffer) {
  return buffer.toString("base64url");
}

function encryptChallengeToken(payload) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, getEncryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(payload), "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return [
    tokenVersion,
    toBase64Url(iv),
    toBase64Url(encrypted),
    toBase64Url(authTag),
  ].join(".");
}

const token = encryptChallengeToken({
  userId: 47,
  path: "stability",
  day: 1
});

async function main() {
  console.log("Calling sync-and-validate API...");
  try {
    const response = await fetch("http://localhost:3000/api/plaid/sync-and-validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: token
      })
    });
    
    const text = await response.text();
    console.log("Status:", response.status);
    console.log("Response:", text);
  } catch (err) {
    console.error("Fetch failed:", err.message);
  }
}

main();
