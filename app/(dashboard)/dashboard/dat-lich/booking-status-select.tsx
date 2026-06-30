"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

const OPTIONS = [
  { value: "pending",   label: "Chờ xác nhận" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "done",      label: "Hoàn thành" },
  { value: "cancelled", label: "Đã huỷ" },
]

const COLORS: Record<string, string> = {
  pending:   "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  done:      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
}

export function BookingStatusSelect({ id, status }: { id: string; status: string }) {
  const [current, setCurrent] = React.useState(status)
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value
    const prev = current
    setLoading(true)
    setCurrent(next)
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    })
    setLoading(false)
    if (!res.ok) {
      setCurrent(prev)
      toast({ title: "Lỗi", description: "Không thể cập nhật trạng thái.", variant: "destructive" })
      return
    }
    const label = OPTIONS.find((o) => o.value === next)?.label ?? next
    toast({ variant: "success", description: `Đã cập nhật: ${label}.` })
    router.refresh()
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      disabled={loading}
      className={`rounded-full px-2.5 py-1 text-xs font-semibold border-0 outline-none cursor-pointer ${COLORS[current]}`}
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}
