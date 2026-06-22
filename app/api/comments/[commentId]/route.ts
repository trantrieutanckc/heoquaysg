import { db } from "@/lib/db"

export async function DELETE(
  _req: Request,
  { params }: { params: { commentId: string } }
) {
  try {
    await db.comment.delete({ where: { id: params.commentId } })
    return new Response(null, { status: 200 })
  } catch {
    return new Response(null, { status: 500 })
  }
}
