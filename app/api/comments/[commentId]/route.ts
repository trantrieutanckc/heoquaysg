import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/session"
import { db } from "@/lib/db"

function isAdminOrEditor(user: any) {
  return user?.role === "ADMIN" || user?.role === "EDITOR"
}

export async function DELETE(
  _req: Request,
  { params }: { params: { commentId: string } }
) {
  const user = await getCurrentUser()
  if (!user) return new Response(null, { status: 401 })
  if (!isAdminOrEditor(user)) return new Response(null, { status: 403 })

  try {
    await db.comment.delete({ where: { id: params.commentId } })
    return new Response(null, { status: 200 })
  } catch {
    return new Response(null, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { commentId: string } }
) {
  const user = await getCurrentUser()
  if (!user) return new Response(null, { status: 401 })
  if (!isAdminOrEditor(user)) return new Response(null, { status: 403 })

  try {
    const { approved } = await req.json()
    const comment = await db.comment.update({
      where: { id: params.commentId },
      data: { approved: Boolean(approved) },
      select: { id: true, approved: true },
    })
    return NextResponse.json(comment)
  } catch {
    return new Response(null, { status: 500 })
  }
}
