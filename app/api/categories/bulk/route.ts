import { NextResponse } from "next/server"
import * as z from "zod"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { isEditor } from "@/lib/permissions"

const schema = z.object({
  ids: z.array(z.string()).min(1),
  action: z.enum(["delete"]),
})

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return new Response(null, { status: 401 })
  if (!isEditor((user as any).role)) return new Response(null, { status: 403 })

  const body = await req.json()
  const { ids } = schema.parse(body)

  await db.category.deleteMany({ where: { id: { in: ids } } })

  return NextResponse.json({ ok: true })
}
