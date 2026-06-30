import { NextResponse } from "next/server"
import * as z from "zod"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { isEditor } from "@/lib/permissions"
import { recalculateRating } from "@/lib/rating"

const schema = z.object({
  ids: z.array(z.string()).min(1),
  action: z.enum(["approve", "reject", "delete"]),
})

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return new Response(null, { status: 401 })
  if (!isEditor(user.role)) return new Response(null, { status: 403 })

  const body = await req.json()
  const { ids, action } = schema.parse(body)

  const where = { id: { in: ids } }

  // Fetch affected postIds for comments that have ratings (need recalculation)
  const affected = await db.comment.findMany({
    where: { ...where, rating: { not: null } },
    select: { postId: true },
  })
  const affectedPostIds = [...new Set(affected.map((c) => c.postId))]

  if (action === "delete") {
    await db.comment.deleteMany({ where })
  } else {
    await db.comment.updateMany({ where, data: { approved: action === "approve" } })
  }

  await Promise.all(affectedPostIds.map(recalculateRating))

  return NextResponse.json({ ok: true })
}
