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
  console.log("Checking push_subscriptions structure...");
  
  // Test query to see columns by reading a single row or trying to select user_id
  const { data, error } = await supabase
    .from("push_subscriptions")
    .select("*")
    .limit(1);

  if (error) {
    console.error("Error reading push_subscriptions:", error.message);
  } else {
    console.log("Columns list or first record:", data);
  }
}

main();
