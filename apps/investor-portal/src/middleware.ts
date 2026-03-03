import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory rate limiter (per Vercel serverless invocation)
// For production: use Vercel Edge Config or Upstash Redis
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

function getClientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIp(request);

  // Rate limit auth endpoints: 5 req/min
  if (pathname.startsWith("/api/auth") || pathname === "/login" || pathname === "/register") {
    if (!rateLimit(`auth:${ip}`, 5, 60_000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
  }

  // Rate limit API routes: 30 req/min
  if (pathname.startsWith("/api/")) {
    if (!rateLimit(`api:${ip}`, 30, 60_000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
  }

  // Rate limit webhook endpoints: 100 req/min
  if (pathname.startsWith("/api/kyc/webhook")) {
    if (!rateLimit(`webhook:${ip}`, 100, 60_000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
  }

  // Security headers
  const response = NextResponse.next();
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co https://*.alchemy.com wss://*.walletconnect.com https://*.walletconnect.com https://verify.walletconnect.com; frame-src 'self' https://verify.walletconnect.com;"
  );
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
