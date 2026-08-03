import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

async function requireAdmin() {
  const user = await getCurrentUser()
  if (!user || user.role !== "ADMIN") return null
  return user
}

// GET: danh sách blocked IPs + top request logs
export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const [blocked, topIps] = await Promise.all([
    db.blockedIp.findMany({ orderBy: { createdAt: "desc" } }),
    db.requestLog.groupBy({
      by: ["ip"],
      _sum: { count: true },
      _max: { lastSeen: true },
      orderBy: { _sum: { count: "desc" } },
      take: 50,
    }),
  ])

  return NextResponse.json({ blocked, topIps })
}

// POST: block IP
export async function POST(req: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { ip, reason } = await req.json()
  if (!ip) return NextResponse.json({ error: "IP required" }, { status: 400 })

  const blocked = await db.blockedIp.upsert({
    where: { ip },
    update: { reason },
    create: { ip, reason },
  })
  return NextResponse.json(blocked)
}

// DELETE: unblock IP
export async function DELETE(req: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { ip } = await req.json()
  await db.blockedIp.delete({ where: { ip } }).catch(() => null)
  return NextResponse.json({ ok: true })
}
