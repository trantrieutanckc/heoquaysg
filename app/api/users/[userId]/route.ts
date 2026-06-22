import { NextResponse } from "next/server"
import * as z from "zod"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

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
  try {
    const json = await req.json()
    const body = updateUserSchema.parse(json)

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
