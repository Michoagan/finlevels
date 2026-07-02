const fs = require("fs");
const path = require("path");
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");

// Read env variables manually from .env.local
let plaidClientId = "";
let plaidSecret = "";

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
    }
  }
} catch (err) {
  console.error("Could not read .env.local file:", err.message);
  process.exit(1);
}

if (!plaidClientId || !plaidSecret) {
  console.error("Missing Plaid credentials in .env.local");
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

async function main() {
  try {
    console.log("1. Creating Plaid Sandbox Public Token...");
    // ins_109559 is the default sandbox institution for Plaid
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

    console.log("3. Waiting 5 seconds for Plaid Sandbox to generate initial transactions...");
    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log("4. Fetching Transactions (all historical data starting 2000-01-01)...");
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = "2000-01-01";
    
    const transactionsResponse = await plaidClient.transactionsGet({
      access_token: accessToken,
      start_date: startDate,
      end_date: endDate,
      options: { count: 5 },
    });

    const transactions = transactionsResponse.data.transactions || [];
    console.log(`\n🎉 Success! Fetched ${transactions.length} transactions from Plaid Sandbox:\n`);
    
    transactions.forEach((tx, idx) => {
      console.log(`[Transaction #${idx + 1}]`);
      console.log(` - Date: ${tx.date}`);
      console.log(` - Name: ${tx.name}`);
      console.log(` - Amount: ${tx.amount} USD`);
      console.log(` - Category: ${tx.category ? tx.category.join(" > ") : "N/A"}`);
      console.log(` - Transaction ID: ${tx.transaction_id}`);
      console.log("-----------------------------------------");
    });

  } catch (error) {
    const errMsg = error.response?.data?.error_message || error.message;
    console.error("Plaid Sandbox fetch failed:", errMsg);
  }
}

main();
