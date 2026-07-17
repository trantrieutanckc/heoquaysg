import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { isEditor } from "@/lib/permissions"

function esc(v: string) {
  return `"${String(v).replace(/"/g, '""')}"`
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || !isEditor(session.user.role)) {
    return new Response("Forbidden", { status: 403 })
  }

  const groups = await db.dishGroup.findMany({
    include: { dishes: { orderBy: { order: "asc" } } },
    orderBy: { order: "asc" },
  })

  const header = "group,name,description,price,unit,available,order"
  const rows: string[] = []

  for (const g of groups) {
    for (const d of g.dishes) {
      rows.push([
        esc(g.name),
        esc(d.name),
        esc(d.description ?? ""),
        d.price,
        esc(d.unit),
        d.available ? "true" : "false",
        d.order,
      ].join(","))
    }
  }

  const csv = [header, ...rows].join("\n")
  const date = new Date().toISOString().slice(0, 10)

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="thuc-don-${date}.csv"`,
    },
  })
}
