import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { checkRateLimit } from "@/lib/rate-limit"

const schema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
})

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown"
  if (!checkRateLimit(`newsletter:${ip}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Quá nhiều yêu cầu. Vui lòng thử lại sau." }, { status: 429 })
  }

  const body = await req.json().catch(() => ({}))
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Email không hợp lệ" }, { status: 400 })
  }

  const { email, name } = parsed.data

  const existing = await db.subscriber.findUnique({ where: { email } })
  if (existing) {
    if (existing.active) {
      return NextResponse.json({ error: "Email này đã đăng ký rồi" }, { status: 409 })
    }
    // Reactivate
    await db.subscriber.update({
      where: { email },
      data: { active: true, unsubscribedAt: null, subscribedAt: new Date() },
    })
    return NextResponse.json({ ok: true })
  }

  await db.subscriber.create({ data: { email, name } })
  return NextResponse.json({ ok: true })
}
