import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

const createSchema = z.object({
  name: z.string().min(1),
  order: z.number().optional(),
})

export async function GET() {
  const groups = await db.dishGroup.findMany({
    orderBy: { order: "asc" },
    include: {
      dishes: { orderBy: { order: "asc" } },
    },
  })
  return NextResponse.json(groups)
}

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 })

  const count = await db.dishGroup.count()
  const group = await db.dishGroup.create({
    data: { name: parsed.data.name, order: parsed.data.order ?? count },
  })
  return NextResponse.json(group)
}
