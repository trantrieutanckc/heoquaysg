import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/session"
import { db } from "@/lib/db"
import { recalculateRating } from "@/lib/rating"

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
    const comment = await db.comment.findUnique({
      where: { id: params.commentId },
      select: { postId: true, approved: true, rating: true },
    })
    await db.comment.delete({ where: { id: params.commentId } })
    if (comment?.approved && comment.rating != null) {
      await recalculateRating(comment.postId)
    }
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
      select: { id: true, approved: true, postId: true, rating: true },
    })
    if (comment.rating != null) {
      await recalculateRating(comment.postId)
    }
    return NextResponse.json({ id: comment.id, approved: comment.approved })
  } catch {
    return new Response(null, { status: 500 })
  }
}
