import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PATCH(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { featured } = await req.json()

    // Nếu set featured = true, bỏ featured của tất cả bài khác trước
    if (featured) {
      await db.post.updateMany({ where: { featured: true }, data: { featured: false } })
    }

    await db.post.update({
      where: { id: params.postId },
      data: { featured },
    })

    return NextResponse.json({ ok: true })
  } catch {
    return new Response(null, { status: 500 })
  }
}
