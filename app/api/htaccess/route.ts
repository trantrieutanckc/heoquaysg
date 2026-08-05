import { NextResponse } from "next/server"
import { writeFile, readFile } from "fs/promises"
import { getCurrentUser } from "@/lib/session"

const getPath = () => process.env.HTACCESS_PATH ?? ""

export async function GET() {
  const user = await getCurrentUser()
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const path = getPath()
  if (!path) {
    return NextResponse.json({ content: "", path: null })
  }

  try {
    const content = await readFile(path, "utf-8")
    return NextResponse.json({ content, path })
  } catch {
    return NextResponse.json({ content: "", path })
  }
}

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const path = getPath()
  if (!path) {
    return NextResponse.json(
      { error: "HTACCESS_PATH chưa được cấu hình trong file .env trên server." },
      { status: 500 }
    )
  }

  try {
    const { content } = await req.json()
    if (typeof content !== "string") {
      return NextResponse.json({ error: "Nội dung không hợp lệ." }, { status: 422 })
    }
    await writeFile(path, content, "utf-8")
    return NextResponse.json({ ok: true, path })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi không xác định"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
