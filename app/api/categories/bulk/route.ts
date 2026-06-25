import { NextResponse } from "next/server"
import * as z from "zod"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { isEditor } from "@/lib/permissions"

const schema = z.object({
  ids: z.array(z.string()).min(1),
  action: z.enum(["delete", "publish", "unpublish"]),
})

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return new Response(null, { status: 401 })
  if (!isEditor((user as any).role)) return new Response(null, { status: 403 })

  const body = await req.json()
  const { ids, action } = schema.parse(body)

  const where = { id: { in: ids } }

  if (action === "delete") {
    await db.category.deleteMany({ where })
  } else {
    await db.category.updateMany({ where, data: { published: action === "publish" } })
  }

  return NextResponse.json({ ok: true })
}
