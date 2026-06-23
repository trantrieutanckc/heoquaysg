import { NextResponse } from "next/server"
import { compare, hash } from "bcryptjs"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { strongPasswordSchema } from "@/lib/validations/auth"

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { name, image, currentPassword, newPassword } = body

    // Change password flow
    if (currentPassword && newPassword) {
      const parsed = strongPasswordSchema.safeParse(newPassword)
      if (!parsed.success) {
        return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Mật khẩu không hợp lệ" }, { status: 400 })
      }

      const dbUser = await db.user.findUnique({
        where: { id: user.id },
        select: { password: true },
      })
      if (!dbUser?.password) return NextResponse.json({ message: "Không tìm thấy tài khoản" }, { status: 400 })

      const valid = await compare(currentPassword, dbUser.password)
      if (!valid) return NextResponse.json({ message: "Mật khẩu hiện tại không đúng" }, { status: 400 })

      const hashed = await hash(newPassword, 12)
      await db.user.update({ where: { id: user.id }, data: { password: hashed } })
      return NextResponse.json({ ok: true })
    }

    // Update name / image
    await db.user.update({
      where: { id: user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(image !== undefined && { image: image || null }),
      },
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ message: "Lỗi server" }, { status: 500 })
  }
}
