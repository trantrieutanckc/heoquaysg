import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await db.subscriber.update({
    where: { id: params.id },
    data: { active: false, unsubscribedAt: new Date() },
  })
  return NextResponse.json({ ok: true })
}

export async function DELETE_HARD(_req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  await db.subscriber.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
