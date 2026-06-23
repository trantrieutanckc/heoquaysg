import { NextResponse } from "next/server"
import * as z from "zod"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { strongPasswordSchema } from "@/lib/validations/auth"

const createUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  role: z.enum(["ADMIN", "EDITOR", "CONTRIBUTOR"]).default("CONTRIBUTOR"),
  password: strongPasswordSchema,
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = createUserSchema.parse(json)

    const existing = await db.user.findUnique({ where: { email: body.email } })
    if (existing) {
      return NextResponse.json({ error: "Email đã tồn tại." }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(body.password, 10)

    const user = await db.user.create({
      data: { name: body.name, email: body.email, role: body.role, password: hashedPassword },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.issues, { status: 422 })
    }
    return new Response(null, { status: 500 })
  }
}

export async function GET() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      _count: { select: { Post: true } },
    },
  })
  return NextResponse.json(users)
}
