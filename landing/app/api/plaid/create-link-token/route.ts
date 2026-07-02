import { NextResponse } from "next/server";
import { plaidClient } from "../../../../lib/plaid";
import { Products, CountryCode } from "plaid";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json().catch(() => ({ userId: "anonymous" }));

    // Build redirect URI for OAuth bank flows (required by Safari, mobile, PWA)
    const siteUrl = (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
    const redirectUri = siteUrl.startsWith("https://") ? `${siteUrl}/quiz` : undefined;

    const linkTokenConfig: any = {
      user: {
        client_user_id: String(userId || "anonymous"),
      },
      client_name: "Finlevels",
      products: [Products.Transactions],
      country_codes: [CountryCode.Us, CountryCode.Fr, CountryCode.Gb, CountryCode.Es, CountryCode.De, CountryCode.Nl],
      language: "en",
    };

    // redirect_uri is required for OAuth flows but MUST be https
    // It must also be registered in the Plaid Dashboard under Allowed redirect URIs
    if (redirectUri) {
      linkTokenConfig.redirect_uri = redirectUri;
    }

    const response = await plaidClient.linkTokenCreate(linkTokenConfig);

    return NextResponse.json({ link_token: response.data.link_token });
  } catch (error: any) {
    const errMsg = error?.response?.data?.error_message || error.message || "Failed to create link token";
    console.error("[create-link-token] Error:", errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
