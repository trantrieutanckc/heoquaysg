import { NextResponse } from "next/server"
import * as z from "zod"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { hashToken } from "@/lib/tokens"

const schema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .regex(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ hoa")
    .regex(/[0-9]/, "Mật khẩu phải có ít nhất 1 chữ số"),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const { token, password } = schema.parse(json)

    const tokenHash = hashToken(token)
    const emailToken = await db.emailToken.findUnique({
      where: { tokenHash },
    })

    if (
      !emailToken ||
      emailToken.type !== "RESET_PASSWORD" ||
      emailToken.usedAt !== null ||
      emailToken.expiresAt < new Date()
    ) {
      return NextResponse.json(
        { error: "Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn." },
        { status: 400 }
      )
    }

    const hashed = await bcrypt.hash(password, 10)

    await db.$transaction([
      db.user.update({
        where: { email: emailToken.email },
        data: { password: hashed },
      }),
      db.emailToken.update({
        where: { tokenHash },
        data: { usedAt: new Date() },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Dữ liệu không hợp lệ" },
        { status: 422 }
      )
    }
    return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 })
  }
}
