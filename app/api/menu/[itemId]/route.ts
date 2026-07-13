import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

export async function PATCH(
  req: Request,
  { params }: { params: { itemId: string } }
) {
  const user = await getCurrentUser()
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { title, href, type, order, disabled, categoryId } = await req.json()
    const item = await db.menuItem.update({
      where: { id: params.itemId },
      data: { title, href, type, order, disabled, categoryId: categoryId ?? undefined },
      include: { category: { select: { id: true, name: true, slug: true } } },
    })
    return NextResponse.json(item)
  } catch {
    return new Response(null, { status: 500 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { itemId: string } }
) {
  const user = await getCurrentUser()
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await db.menuItem.delete({ where: { id: params.itemId } })
    return new Response(null, { status: 200 })
  } catch {
    return new Response(null, { status: 500 })
  }
}
