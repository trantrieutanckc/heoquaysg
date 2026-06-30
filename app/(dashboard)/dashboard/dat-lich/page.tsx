import { redirect } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/admin/header"
import { DashboardShell } from "@/components/admin/shell"
import { cn } from "@/lib/utils"
import { BookingStatusSelect } from "./booking-status-select"

export const metadata = { title: "Đặt lịch" }

const PRODUCT_LABELS: Record<string, string> = {
  "heo-quay":     "Heo Quay",
  "ga-quay":      "Gà Quay",
  "vit-quay":     "Vịt Quay",
  "heo-quay-sua": "Heo Quay Sữa",
}

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  done:      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
}

const STATUS_LABELS: Record<string, string> = {
  pending:   "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  done:      "Hoàn thành",
  cancelled: "Đã huỷ",
}

function formatDateTime(d: Date) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(d)
}

export default async function DatLichPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const user = await getCurrentUser()
  if (!user || (user as any).role !== "ADMIN") redirect("/dashboard")

  const statusFilter = searchParams.status

  const where = statusFilter ? { status: statusFilter } : {}

  const [bookings, pendingCount, totalCount] = await Promise.all([
    db.booking.findMany({
      where,
      orderBy: { createdAt: "desc" },
    }),
    db.booking.count({ where: { status: "pending" } }),
    db.booking.count(),
  ])

  const tabs = [
    { label: "Tất cả", value: undefined },
    { label: "Chờ xác nhận", value: "pending" },
    { label: "Đã xác nhận", value: "confirmed" },
    { label: "Hoàn thành", value: "done" },
    { label: "Đã huỷ", value: "cancelled" },
  ]

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Đặt lịch giao hàng"
        text={pendingCount > 0 ? `${pendingCount} đơn đang chờ xác nhận` : `${totalCount} đơn tổng cộng`}
      />

      {/* Tabs */}
      <div className="flex gap-1 border-b mb-4 overflow-x-auto">
        {tabs.map((tab) => {
          const active = (tab.value === undefined && !statusFilter) || tab.value === statusFilter
          return (
            <Link
              key={tab.label}
              href={tab.value ? `/dashboard/dat-lich?status=${tab.value}` : "/dashboard/dat-lich"}
              className={cn(
                "px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap",
                active
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              {tab.value === "pending" && pendingCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 px-1.5 py-0.5 text-[10px] font-bold min-w-[1.25rem]">
                  {pendingCount}
                </span>
              )}
            </Link>
          )
        })}
      </div>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-lg">
          <p className="font-medium mb-1">Chưa có đơn nào</p>
          <p className="text-sm text-muted-foreground">Đơn đặt lịch từ khách sẽ xuất hiện ở đây.</p>
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Khách</th>
                <th className="text-left px-4 py-3 font-semibold">Món</th>
                <th className="text-left px-4 py-3 font-semibold">Giao lúc</th>
                <th className="text-left px-4 py-3 font-semibold">Trạng thái</th>
                <th className="text-left px-4 py-3 font-semibold">Đặt lúc</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.phone}</p>
                    {b.address && (
                      <p className="text-xs text-muted-foreground truncate max-w-[180px]">{b.address}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{PRODUCT_LABELS[b.product] ?? b.product}</p>
                    <p className="text-xs text-muted-foreground">{b.quantity} con</p>
                    {b.note && (
                      <p className="text-xs text-muted-foreground italic truncate max-w-[160px]">{b.note}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatDateTime(b.deliveryDate)}
                  </td>
                  <td className="px-4 py-3">
                    <BookingStatusSelect id={b.id} status={b.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {formatDateTime(b.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardShell>
  )
}
