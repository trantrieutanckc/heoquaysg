import { NextResponse } from "next/server"
import * as z from "zod"
import { db } from "@/lib/db"
import { generateToken, hashToken, tokenExpiresAt } from "@/lib/tokens"
import { sendPasswordResetEmail } from "@/lib/mailer"

const schema = z.object({
  email: z.string().email("Email không hợp lệ"),
})

// Simple in-memory rate limit: 3 requests per email per hour
const forgotRateMap = new Map<string, { count: number; resetAt: number }>()

function checkForgotRate(email: string): boolean {
  const now = Date.now()
  const entry = forgotRateMap.get(email)
  if (!entry || now > entry.resetAt) {
    forgotRateMap.set(email, { count: 1, resetAt: now + 60 * 60 * 1000 })
    return true
  }
  if (entry.count >= 3) return false
  entry.count++
  return true
}

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const { email } = schema.parse(json)

    if (!checkForgotRate(email.toLowerCase())) {
      // Always return 200 to prevent user enumeration
      return NextResponse.json({ success: true })
    }

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, name: true, email: true },
    })

    if (user) {
      // Delete existing unused tokens for this email
      await db.emailToken.deleteMany({
        where: { email: email.toLowerCase(), type: "RESET_PASSWORD", usedAt: null },
      })

      const rawToken = generateToken()
      await db.emailToken.create({
        data: {
          email: email.toLowerCase(),
          tokenHash: hashToken(rawToken),
          type: "RESET_PASSWORD",
          expiresAt: tokenExpiresAt(1),
        },
      })

      const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? ""
      const resetUrl = `${siteUrl}/reset-password/${rawToken}`

      sendPasswordResetEmail({ email: user.email!, resetUrl, name: user.name })
    }

    // Always 200 — don't reveal whether email exists
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Dữ liệu không hợp lệ" },
        { status: 422 }
      )
    }
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 })
  }
}
