import { NextResponse } from "next/server"
import * as z from "zod"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { isEditor } from "@/lib/permissions"

const schema = z.object({
  ids: z.array(z.string()).min(1),
  action: z.enum(["publish", "unpublish", "delete"]),
})

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return new Response(null, { status: 401 })
  if (!isEditor((user as any).role)) return new Response(null, { status: 403 })

  const body = await req.json()
  const { ids, action } = schema.parse(body)

  const isAdmin = (user as any).role === "ADMIN"
  const where = isAdmin ? { id: { in: ids } } : { id: { in: ids }, authorId: user.id }

  if (action === "delete") {
    await db.post.deleteMany({ where })
  } else {
    await db.post.updateMany({ where, data: { published: action === "publish" } })
  }

  return NextResponse.json({ ok: true })
}
