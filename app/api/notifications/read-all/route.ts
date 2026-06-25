import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// PATCH — mark all as read
export async function PATCH() {
  const session = await getServerSession(authOptions)
  if (!session) return new Response("Unauthorized", { status: 403 })

  await db.notification.updateMany({
    where: { userId: session.user.id, read: false },
    data: { read: true },
  })

  return Response.json({ ok: true })
}

// DELETE — clear all notifications
export async function DELETE() {
  const session = await getServerSession(authOptions)
  if (!session) return new Response("Unauthorized", { status: 403 })

  await db.notification.deleteMany({ where: { userId: session.user.id } })

  return Response.json({ ok: true })
}
