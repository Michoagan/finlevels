import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
let supabaseHost = "";
try {
  if (supabaseUrl) {
    supabaseHost = new URL(supabaseUrl).host;
  }
} catch {
  // Ignored
}

const connectSrc = [
  "'self'",
  supabaseUrl,
  supabaseHost ? `wss://${supabaseHost}` : "",
  isDev ? "ws://localhost:* ws://127.0.0.1:* ws://[::1]:*" : ""
].filter(Boolean).join(" ");

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://cdn.plaid.com https://www.google.com https://www.gstatic.com https://www.recaptcha.net;
  script-src-elem 'self' 'unsafe-inline' https://cdn.plaid.com https://www.google.com https://www.gstatic.com https://www.recaptcha.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' blob: data: https://images.unsplash.com https://cdn.plaid.com https://www.gstatic.com;
  font-src 'self' https://fonts.gstatic.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self' ${supabaseUrl};
  frame-ancestors 'none';
  frame-src https://cdn.plaid.com https://plaid.com https://www.google.com https://recaptcha.google.com https://www.recaptcha.net;
  connect-src ${connectSrc} https://cdn.plaid.com https://*.plaid.com https://production.plaid.com https://sandbox.plaid.com https://development.plaid.com https://www.google.com https://www.recaptcha.net https://us.i.posthog.com;
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, " ").trim();

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader,
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        source: "/manifest.webmanifest",
        headers: [
          { key: "Content-Type", value: "application/manifest+json" },
        ],
      },
      {
        source: "/manifest.json",
        headers: [
          { key: "Content-Type", value: "application/manifest+json" },
        ],
      },
    ];
  },
};

export default nextConfig;
