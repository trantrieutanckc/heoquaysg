import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser()
  if (!user || (user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { status } = await req.json()
  const allowed = ["pending", "confirmed", "done", "cancelled"]
  if (!allowed.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 422 })
  }

  const booking = await db.booking.update({
    where: { id: params.id },
    data: { status },
  })
  return NextResponse.json(booking)
}
