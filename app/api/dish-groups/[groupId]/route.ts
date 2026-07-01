import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  order: z.number().optional(),
})

export async function PATCH(req: Request, { params }: { params: { groupId: string } }) {
  const user = await getCurrentUser()
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = await req.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 })

  const group = await db.dishGroup.update({ where: { id: params.groupId }, data: parsed.data })
  return NextResponse.json(group)
}

export async function DELETE(_: Request, { params }: { params: { groupId: string } }) {
  const user = await getCurrentUser()
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  await db.dishGroup.delete({ where: { id: params.groupId } })
  return NextResponse.json({ ok: true })
}
