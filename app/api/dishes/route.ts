import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

const createSchema = z.object({
  groupId: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  unit: z.string().default("phần"),
  image: z.string().optional(),
  postId: z.string().nullable().optional(),
  available: z.boolean().default(true),
})

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 })

  const count = await db.dish.count({ where: { groupId: parsed.data.groupId } })
  const dish = await db.dish.create({ data: { ...parsed.data, order: count } })
  return NextResponse.json(dish)
}
