const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

let supabaseUrl = "";
let supabaseServiceRoleKey = "";

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
    }
  }
} catch (err) {
  console.error("Could not read .env.local file:", err.message);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function main() {
  console.log("Checking User 47 in waitlist table...");
  const { data, error } = await supabase
    .from("waitlist")
    .select("*")
    .eq("id", 47)
    .maybeSingle();

  if (error) {
    console.error("Database error:", error.message);
    return;
  }

  if (!data) {
    console.error("User 47 not found.");
    return;
  }

  console.log("User 47 details:");
  console.log("Email:", data.email);
  console.log("Profile Name:", data.profile_name);
  console.log("Stability Level:", data.stability_level);
  console.log("Saving Level:", data.saving_level);
  console.log("Investing Level:", data.investing_level);
  console.log("Plaid Bank Name:", data.plaid_bank_name);
  console.log("Analysis Summary (stored):", data.analysis_summary);
  console.log("Has Access Token:", !!data.plaid_access_token);
}

main();
