import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Dynamic allowed origins
const allowedOrigins = [
  "https://finlevels.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

if (process.env.SITE_URL) {
  allowedOrigins.push(process.env.SITE_URL.replace(/\/$/, ""));
}
if (process.env.NEXT_PUBLIC_SITE_URL) {
  allowedOrigins.push(process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, ""));
}

// Support local subdomains or development ports/addresses
function isAllowed(origin: string): boolean {
  if (!origin) return false;

  const uniqueOrigins = Array.from(new Set(allowedOrigins));
  if (uniqueOrigins.includes(origin)) {
    return true;
  }

  // Allow localhost dynamically for development (e.g. localhost:3001, etc.)
  if (/^http:\/\/localhost(:\d+)?$/.test(origin) || /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) {
    return true;
  }

  return false;
}

const corsOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey, x-cron-secret",
};

export function proxy(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "";
  const isAllowedOrigin = isAllowed(origin);

  // Handle preflighted requests (OPTIONS)
  const isPreflight = request.method === "OPTIONS";

  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Credentials": "true",
      }),
      ...corsOptions,
    };
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  // Handle simple requests
  const response = NextResponse.next();

  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
