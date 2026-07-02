const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// Manually parse .env.local to avoid dependency issues
function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error("Could not find .env.local at", envPath);
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, "utf8");
  const env = {};
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const parts = trimmed.split("=");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join("=").trim().replace(/^['"]|['"]$/g, ""); // strip quotes
      env[key] = val;
    }
  });
  return env;
}

async function run() {
  const env = loadEnv();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;
  const resendApiKey = env.RESEND_API_KEY;
  const resendFrom = env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  // Check for --test=email command line argument
  const args = process.argv.slice(2);
  const testArg = args.find(a => a.startsWith("--test="));
  const testEmail = testArg ? testArg.split("=")[1] : null;

  console.log("--- Finlevels Plaid Sandbox Email Sender ---");
  console.log("Supabase URL:", supabaseUrl);
  console.log("Sender Email:", resendFrom);

  if (!resendApiKey) {
    console.error("❌ Error: RESEND_API_KEY is not defined in .env.local");
    console.log("Please define RESEND_API_KEY in your .env.local or set it in the environment.");
    process.exit(1);
  }

  let users = [];

  if (testEmail) {
    console.log(`\n🧪 Test Mode Active: Sending only to ${testEmail}`);
    users = [{ id: 0, email: testEmail }];
  } else {
    if (!supabaseUrl || !supabaseKey) {
      console.error("❌ Error: Missing Supabase credentials in .env.local");
      process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Fetch all waitlist users
    console.log("\nFetching waitlisted users from Supabase...");
    const { data, error } = await supabase
      .from("waitlist")
      .select("id, email");

    if (error) {
      console.error("❌ Error fetching waitlist users:", error.message);
      process.exit(1);
    }
    users = data || [];
  }

  if (!users || users.length === 0) {
    console.log("ℹ️ No users found in the waitlist table.");
    return;
  }

  console.log(`Found ${users.length} user(s) in the waitlist.`);

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Finlevels Keys</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #f5f2fe;
      color: #1b1b23;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 24px;
      border: 1px solid #e1e0ff;
      overflow: hidden;
      box-shadow: 0 16px 40px rgba(70, 72, 212, 0.08);
    }
    .header {
      background: linear-gradient(135deg, #4648d4 0%, #393bbb 100%);
      padding: 32px;
      text-align: center;
      color: #ffffff;
    }
    .logo {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 32px;
      line-height: 1.6;
    }
    h1 {
      font-size: 22px;
      font-weight: 900;
      color: #1b1b23;
      margin-top: 0;
    }
    p {
      font-size: 15px;
      color: #464554;
      margin-bottom: 20px;
    }
    .credentials-box {
      background-color: #f5f2fe;
      border: 2px dashed #4648d4;
      border-radius: 16px;
      padding: 20px;
      margin: 24px 0;
    }
    .credentials-title {
      font-weight: 900;
      font-size: 13px;
      color: #4648d4;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
    }
    .cred-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 14px;
    }
    .cred-label {
      font-weight: 700;
      color: #1b1b23;
    }
    .cred-val {
      font-family: monospace;
      font-weight: 700;
      background-color: #e1e0ff;
      padding: 2px 8px;
      border-radius: 6px;
      color: #4648d4;
    }
    .btn {
      display: block;
      text-align: center;
      background-color: #4648d4;
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 900;
      padding: 16px 24px;
      border-radius: 9999px;
      margin: 32px 0 16px 0;
      box-shadow: 0 12px 30px rgba(70, 72, 212, 0.2);
    }
    .footer {
      text-align: center;
      padding: 24px;
      font-size: 12px;
      color: #9d9aac;
      border-top: 1px solid #f3f2f7;
      background-color: #faf9fe;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">👾 FINLEVELS 👾</div>
    </div>
    <div class="content">
      <h1>Yo, it's Coach Penny! 👋✨</h1>
      <p>
        Your slot on the waitlist has been unlocked. It's time to stop studying finance and start playing it. 
        We are launching in <strong>Sandbox Mode</strong>, which means you can connect a simulated bank account with zero risk.
      </p>
      
      <p>When prompted to connect your bank via Plaid, select any bank and use these exact test credentials:</p>
      
      <div class="credentials-box">
        <div class="credentials-title">🔑 Sandbox Credentials</div>
        <div class="cred-row">
          <span class="cred-label">Username / Identifiant:</span>
          <span class="cred-val">user_good</span>
        </div>
        <div class="cred-row">
          <span class="cred-label">Password / Mot de passe:</span>
          <span class="cred-val">pass_good</span>
        </div>
        <div class="cred-row">
          <span class="cred-label">MFA / SMS code:</span>
          <span class="cred-val">1234</span>
        </div>
      </div>
      
      <p><em>Note: If you want to simulate a high-debt or low-savings account to test other archetypes, you can also use <code>user_custom</code> as the username.</em></p>

      <a href="https://finlevels.app/quiz" class="btn">Start Your Adventure ⚔️</a>
    </div>
    <div class="footer">
      © 2026 Finlevels. Turn money knowledge into money habits.<br>
      You received this because you signed up on our waitlist.
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `
Yo, it's Coach Penny! 👋✨

Your slot on the waitlist has been unlocked. It's time to stop studying finance and start playing it.
We are launching in Sandbox Mode, which means you can connect a simulated bank account with zero risk.

When prompted to connect your bank via Plaid, select any bank and use these exact test credentials:

🔑 Sandbox Credentials:
- Username: user_good
- Password: pass_good
- MFA/SMS Code: 1234

Start Your Adventure here: https://finlevels.app/quiz

Best,
Coach Penny
`;

  console.log("\nStarting email dispatch via Resend API...");

  for (const user of users) {
    console.log(`Sending to ${user.email}...`);

    try {
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: resendFrom,
          to: user.email,
          subject: "⚔️ Your keys to the Money Game (Plaid Sandbox inside!)",
          html: htmlContent,
          text: textContent,
        }),
      });

      if (resendResponse.ok) {
        console.log(`✅ Success for ${user.email}`);
      } else {
        const errorText = await resendResponse.text();
        console.error(`❌ Failed for ${user.email}:`, errorText);
      }
    } catch (err) {
      console.error(`❌ Error dispatching to ${user.email}:`, err.message);
    }
  }

  console.log("\n🎉 Finished dispatch run.");
}

run().catch((err) => {
  console.error("Unhandled execution error:", err);
});
