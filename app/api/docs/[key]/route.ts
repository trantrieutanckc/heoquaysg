import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

export async function GET(_: Request, { params }: { params: { key: string } }) {
  const doc = await db.siteDoc.findUnique({ where: { key: params.key } })
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(doc)
}

export async function PUT(req: Request, { params }: { params: { key: string } }) {
  const user = await getCurrentUser()
  if (!user || (user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { content, title } = await req.json()
  if (typeof content !== "string" || typeof title !== "string") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }

  const doc = await db.siteDoc.upsert({
    where: { key: params.key },
    update: { content, title },
    create: { key: params.key, title, content },
  })

  return NextResponse.json(doc)
}
