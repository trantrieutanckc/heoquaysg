import { getCurrentUser } from "@/lib/session"
import { db } from "@/lib/db"

export async function DELETE(
  _req: Request,
  { params }: { params: { commentId: string } }
) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return new Response(null, { status: 401 })
  }

  const role = (currentUser as any).role
  if (role !== "ADMIN" && role !== "EDITOR") {
    return new Response(null, { status: 403 })
  }

  try {
    await db.comment.delete({ where: { id: params.commentId } })
    return new Response(null, { status: 200 })
  } catch {
    return new Response(null, { status: 500 })
  }
}
