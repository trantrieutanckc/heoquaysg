import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  price: z.number().min(0).optional(),
  unit: z.string().optional(),
  image: z.string().nullable().optional(),
  postId: z.string().nullable().optional(),
  available: z.boolean().optional(),
  order: z.number().optional(),
})

export async function PATCH(req: Request, { params }: { params: { dishId: string } }) {
  const user = await getCurrentUser()
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = await req.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 })

  const dish = await db.dish.update({ where: { id: params.dishId }, data: parsed.data })
  return NextResponse.json(dish)
}

export async function DELETE(_: Request, { params }: { params: { dishId: string } }) {
  const user = await getCurrentUser()
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  await db.dish.delete({ where: { id: params.dishId } })
  return NextResponse.json({ ok: true })
}
