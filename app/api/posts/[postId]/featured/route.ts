import { NextResponse } from "next/server"
import * as z from "zod"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

const schema = z.object({ featured: z.boolean() })

export async function PATCH(
  req: Request,
  { params }: { params: { postId: string } }
) {
  const currentUser = await getCurrentUser()
  const role = (currentUser as any)?.role
  if (!currentUser || (role !== "ADMIN" && role !== "EDITOR")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const body = schema.parse(await req.json())

    if (body.featured) {
      // Dùng transaction để đảm bảo chỉ có đúng 1 bài featured tại mọi thời điểm
      await db.$transaction([
        db.post.updateMany({ where: { featured: true }, data: { featured: false } }),
        db.post.update({ where: { id: params.postId }, data: { featured: true } }),
      ])
    } else {
      await db.post.update({ where: { id: params.postId }, data: { featured: false } })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 })
    }
    return new Response(null, { status: 500 })
  }
}
