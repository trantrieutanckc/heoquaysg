import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
import { NextRequest, NextResponse, NextFetchEvent } from "next/server"

// ── Login rate limiter ────────────────────────────────────────────────────────
// In-memory store: resets on cold start, sufficient to deter brute-force on a
// single-instance deployment. For multi-region scale, swap for Redis/KV.
const loginAttempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 10       // attempts before lockout
const WINDOW_MS = 15 * 60 * 1000 // 15-minute window

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = loginAttempts.get(ip)

  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }

  if (entry.count >= MAX_ATTEMPTS) return false

  entry.count++
  return true
}

// Clean up stale entries periodically to prevent memory growth
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of loginAttempts) {
    if (now > entry.resetAt) loginAttempts.delete(ip)
  }
}, 5 * 60 * 1000)

// ── Auth middleware (NextAuth) ────────────────────────────────────────────────
const authMiddleware = withAuth(
  async function middleware(req) {
    const token = await getToken({ req })
    const isAuth = !!token
    const isAuthPage =
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/register")

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
      return null
    }

    if (!isAuth) {
      const from = req.nextUrl.pathname + req.nextUrl.search
      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      )
    }

    const role = (token as any)?.role as string | undefined
    if (req.nextUrl.pathname.startsWith("/editor")) {
      if (role !== "ADMIN" && role !== "EDITOR") {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }
  },
  {
    callbacks: {
      async authorized() {
        return true
      },
    },
  }
)

// ── Combined middleware ───────────────────────────────────────────────────────
export default function middleware(req: NextRequest, event: NextFetchEvent) {
  // Rate-limit credentials login endpoint
  if (
    req.method === "POST" &&
    req.nextUrl.pathname === "/api/auth/callback/credentials"
  ) {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown"

    if (!checkRateLimit(ip)) {
      return new NextResponse(
        JSON.stringify({
          error: "Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau 15 phút.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "900",
          },
        }
      )
    }
  }

  return (authMiddleware as any)(req, event)
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/editor/:path*",
    "/login",
    "/register",
    "/api/auth/callback/credentials",
  ],
}
