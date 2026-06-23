import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

export async function GET() {
  const config = await db.siteConfig.findUnique({ where: { id: "default" } })
  return NextResponse.json(config?.data ?? {})
}

export async function PUT(req: Request) {
  const user = await getCurrentUser()
  if (!user || (user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const data = await req.json()

  const config = await db.siteConfig.upsert({
    where: { id: "default" },
    update: { data },
    create: { id: "default", data },
  })

  return NextResponse.json(config.data)
}
