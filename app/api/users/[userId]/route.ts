import { NextResponse } from "next/server"
import * as z from "zod"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: z.enum(["ADMIN", "EDITOR", "CONTRIBUTOR"]).optional(),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự").optional(),
  image: z.string().url().nullable().optional(),
})

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const isAdmin = (currentUser as any).role === "ADMIN"
  const isSelf = (currentUser as any).id === params.userId

  // Chỉ ADMIN hoặc chính user đó mới được sửa
  if (!isAdmin && !isSelf) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const json = await req.json()
    const body = updateUserSchema.parse(json)

    // Chỉ ADMIN mới được đổi role
    if (body.role && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const data: Record<string, any> = {}
    if (body.name) data.name = body.name
    if (body.email) data.email = body.email
    if (body.role) data.role = body.role
    if (body.password) data.password = await bcrypt.hash(body.password, 10)
    if (body.image !== undefined) data.image = body.image

    const user = await db.user.update({
      where: { id: params.userId },
      data,
      select: { id: true, name: true, email: true, role: true, image: true },
    })

    return NextResponse.json(user)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 })
    }
    return new Response(null, { status: 500 })
  }
}
