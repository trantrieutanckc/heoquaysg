import { readFile, access } from "fs/promises"
import path from "path"
import { NextResponse } from "next/server"

// Tìm project root từ __dirname (không phụ thuộc process.cwd() hay pm2 env)
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

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
}

export async function GET(_req: Request, { params }: { params: { path: string[] } }) {
  try {
    const filename = params.path.join("/")
    const ext = filename.split(".").pop()?.toLowerCase() ?? ""
    const filePath = path.join(UPLOAD_DIR, filename)

    const buffer = await readFile(filePath)
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": MIME[ext] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch {
    return new NextResponse("Not found", { status: 404 })
  }
}
