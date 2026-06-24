import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { randomUUID } from "crypto"
import path from "path"
import { getCurrentUser } from "@/lib/session"

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
}

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(req: Request) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

    const ext = MIME_TO_EXT[file.type]
    if (!ext) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 })
    }

    // Extension lấy từ MIME type (không lấy từ filename) để tránh bypass
    const filename = `${randomUUID()}.${ext}`

    const uploadDir = path.join(process.cwd(), "public", "uploads")
    await mkdir(uploadDir, { recursive: true })
    await writeFile(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()))

    const url = `/uploads/${filename}`
    return NextResponse.json({ success: 1, url, file: { url } })
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
