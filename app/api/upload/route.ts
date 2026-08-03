import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { getCurrentUser } from "@/lib/session"

function findProjectRoot(dir: string): string {
  const fs = require("fs")
  for (let i = 0; i < 8; i++) {
    if (fs.existsSync(path.join(dir, "package.json"))) return dir
    const parent = path.dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return process.cwd()
}

const PROJECT_ROOT = process.env.UPLOAD_DIR
  ? path.dirname(path.dirname(process.env.UPLOAD_DIR))
  : findProjectRoot(__dirname)

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? path.join(PROJECT_ROOT, "public/images/uploads")
const UPLOAD_BASE_URL = "/api/images"

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
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

    const filename = `${randomUUID()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    await mkdir(UPLOAD_DIR, { recursive: true })
    await writeFile(path.join(UPLOAD_DIR, filename), buffer)

    const publicUrl = `${UPLOAD_BASE_URL}/${filename}`
    return NextResponse.json({ success: 1, url: publicUrl, file: { url: publicUrl } })
  } catch (err) {
    console.error("[upload]", err)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
