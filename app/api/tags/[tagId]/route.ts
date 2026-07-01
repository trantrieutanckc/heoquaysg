import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

export async function DELETE(
  _req: Request,
  { params }: { params: { tagId: string } }
) {
  const user = await getCurrentUser()
  if (!user || user.role !== "ADMIN") {
    return new Response(null, { status: 403 })
  }

  await db.tag.delete({ where: { id: params.tagId } })
  return new Response(null, { status: 200 })
}
