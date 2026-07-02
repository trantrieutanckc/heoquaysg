import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

export async function GET() {
  const user = await getCurrentUser()
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR")) {
    return new Response("Unauthorized", { status: 401 })
  }

  const subscribers = await db.subscriber.findMany({
    where: { active: true },
    orderBy: { subscribedAt: "desc" },
  })

  const rows = [
    ["Email", "Tên", "Ngày đăng ký"].join(","),
    ...subscribers.map((s) =>
      [
        `"${s.email}"`,
        `"${s.name ?? ""}"`,
        `"${s.subscribedAt.toISOString().slice(0, 10)}"`,
      ].join(",")
    ),
  ].join("\n")

  return new Response(rows, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
