import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"

const schema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
})

export async function POST(req: Request) {
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
