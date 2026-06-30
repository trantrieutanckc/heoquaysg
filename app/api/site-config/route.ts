import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

export async function GET() {
  const config = await db.siteConfig.findUnique({ where: { id: "default" } })
  return NextResponse.json(config?.data ?? {})
}

export async function PUT(req: Request) {
  const user = await getCurrentUser()
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const data = await req.json()
    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 422 })
    }

    const config = await db.siteConfig.upsert({
      where: { id: "default" },
      update: { data },
      create: { id: "default", data },
    })

    return NextResponse.json(config.data)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
