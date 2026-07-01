import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  const json = await req.json().catch(() => null)
  const query = typeof json?.query === "string" ? json.query.trim() : ""
  if (query.length < 3) return new Response(null, { status: 204 })

  await db.searchQuery.create({ data: { query } }).catch(() => null)
  return new Response(null, { status: 204 })
}

export async function GET() {
  const recent = await db.searchQuery.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
    select: { query: true, createdAt: true },
  })
  return NextResponse.json(recent)
}
