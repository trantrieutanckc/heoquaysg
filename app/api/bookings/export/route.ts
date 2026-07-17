import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { isEditor } from "@/lib/permissions"

function esc(v: string) {
  return `"${String(v).replace(/"/g, '""')}"`
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  done: "Hoàn thành",
  cancelled: "Đã huỷ",
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || !isEditor(session.user.role)) {
    return new Response("Forbidden", { status: 403 })
  }

  const bookings = await db.booking.findMany({
    orderBy: { createdAt: "desc" },
  })

  const fmt = (d: Date) =>
    new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }).format(d)

  const header = "id,name,phone,address,items,deliveryDate,note,status,createdAt"
  const rows = bookings.map((b) => {
    const itemList = Array.isArray(b.items)
      ? (b.items as { title: string; quantity: number }[])
          .map((x) => `${x.title} x${x.quantity}`)
          .join(" | ")
      : ""
    return [
      esc(b.id),
      esc(b.name),
      esc(b.phone),
      esc(b.address ?? ""),
      esc(itemList),
      esc(fmt(b.deliveryDate)),
      esc(b.note ?? ""),
      esc(STATUS_LABELS[b.status] ?? b.status),
      esc(fmt(b.createdAt)),
    ].join(",")
  })

  const csv = [header, ...rows].join("\n")
  const date = new Date().toISOString().slice(0, 10)

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="don-dat-lich-${date}.csv"`,
    },
  })
}
