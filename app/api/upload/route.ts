import { writeFile, mkdir, access } from "fs/promises"
import path from "path"
import os from "os"
import { NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { getCurrentUser } from "@/lib/session"

async function exists(p: string) {
  try { await access(p); return true } catch { return false }
}

async function getUploadDir() {
  if (process.env.UPLOAD_DIR) return process.env.UPLOAD_DIR
  const cpanelDir = path.join(os.homedir(), "public_html", "images", "uploads")
  if (await exists(path.join(os.homedir(), "public_html"))) return cpanelDir
  return path.join(process.cwd(), "public", "images", "uploads")
}

const UPLOAD_BASE_URL = process.env.UPLOAD_BASE_URL ?? "/images/uploads"

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

    const uploadDir = await getUploadDir()
    await mkdir(uploadDir, { recursive: true })
    await writeFile(path.join(uploadDir, filename), buffer)

    const publicUrl = `${UPLOAD_BASE_URL}/${filename}`
    return NextResponse.json({ success: 1, url: publicUrl, file: { url: publicUrl } })
  } catch (err) {
    console.error("[upload]", err)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
