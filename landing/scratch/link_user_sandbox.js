const fs = require("fs");
const path = require("path");
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");
const { createClient } = require("@supabase/supabase-js");

// Read env variables manually from .env.local
let plaidClientId = "";
let plaidSecret = "";
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
      if (key === "PLAID_CLIENT_ID") plaidClientId = val;
      if (key === "PLAID_SECRET") plaidSecret = val;
      if (key === "NEXT_PUBLIC_SUPABASE_URL") supabaseUrl = val;
      if (key === "SUPABASE_SERVICE_ROLE_KEY") supabaseServiceRoleKey = val;
    }
  }
} catch (err) {
  console.error("Could not read .env.local file:", err.message);
  process.exit(1);
}

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": plaidClientId,
      "PLAID-SECRET": plaidSecret,
    },
  },
});

const plaidClient = new PlaidApi(configuration);
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function main() {
  try {
    console.log("1. Generating Plaid Sandbox Public Token...");
    const sandboxTokenResponse = await plaidClient.sandboxPublicTokenCreate({
      institution_id: "ins_109559",
      initial_products: ["transactions"],
    });
    
    const publicToken = sandboxTokenResponse.data.public_token;
    console.log("   Public Token generated:", publicToken);

    console.log("2. Exchanging Public Token for Access Token...");
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });
    
    const accessToken = exchangeResponse.data.access_token;
    console.log("   Access Token generated:", accessToken);

    console.log("3. Linking Access Token to Supabase User ID 47 (boussariadnan317@gmail.com)...");
    const { data, error } = await supabase
      .from("waitlist")
      .update({
        plaid_access_token: accessToken,
        plaid_bank_name: "First Platypus Bank (Sandbox)"
      })
      .eq("id", 47);

    if (error) {
      throw new Error(`Supabase update error: ${error.message}`);
    }

    console.log("🎉 Success! User 47 (boussariadnan317) is now fully connected to Plaid Sandbox in Supabase.");
    console.log("Now when they open their dashboard, they will immediately see their transactions.");

  } catch (error) {
    const errMsg = error.response?.data?.error_message || error.message;
    console.error("Plaid linking failed:", errMsg);
  }
}

main();
