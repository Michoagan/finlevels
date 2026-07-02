const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// Read env variables manually from .env.local
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

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function main() {
  const { data, error } = await supabase
    .from("waitlist")
    .select("id, email, profile_name, stability_level, saving_level, investing_level")
    .limit(10);
  
  if (error) {
    console.error("Error fetching waitlist:", error);
    return;
  }
  console.log("Waitlist Users:", JSON.stringify(data, null, 2));
}

main();
