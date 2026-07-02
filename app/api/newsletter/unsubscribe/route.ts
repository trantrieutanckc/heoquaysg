import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get("token")

  if (!token) {
    return new Response("Token không hợp lệ", { status: 400, headers: { "Content-Type": "text/plain; charset=utf-8" } })
  }

  const subscriber = await db.subscriber.findUnique({ where: { token } })
  if (!subscriber) {
    return new Response("Link không hợp lệ hoặc đã hết hạn", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } })
  }

  if (!subscriber.active) {
    return new Response("Email này đã hủy đăng ký trước đó rồi", { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } })
  }

  await db.subscriber.update({
    where: { token },
    data: { active: false, unsubscribedAt: new Date() },
  })

  return new Response("Đã hủy đăng ký thành công. Bạn sẽ không nhận email từ chúng tôi nữa.", {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
