"use client"

import * as React from "react"
import { DashboardHeader } from "@/components/admin/header"
import { DashboardShell } from "@/components/admin/shell"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

interface Subscriber {
  id: string
  email: string
  name: string | null
  active: boolean
  subscribedAt: string
  unsubscribedAt: string | null
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = React.useState<Subscriber[]>([])
  const [loading, setLoading] = React.useState(true)
  const [filter, setFilter] = React.useState<"all" | "active" | "inactive">("active")

  async function load() {
    setLoading(true)
    const res = await fetch("/api/newsletter/subscribers")
    if (res.ok) setSubscribers(await res.json())
    setLoading(false)
  }

  React.useEffect(() => { load() }, [])

  async function unsubscribe(id: string) {
    const res = await fetch(`/api/newsletter/subscribers/${id}`, { method: "DELETE" })
    if (res.ok) {
      toast({ title: "Đã hủy đăng ký" })
      load()
    }
  }

  function exportCsv() {
    window.open("/api/newsletter/export", "_blank")
  }

  const filtered = subscribers.filter((s) =>
    filter === "all" ? true : filter === "active" ? s.active : !s.active
  )

  const activeCount = subscribers.filter((s) => s.active).length

  return (
    <DashboardShell>
      <DashboardHeader heading="Subscribers" text={`${activeCount} người đang đăng ký nhận tin`}>
        <Button variant="outline" size="sm" onClick={exportCsv}>
          Xuất CSV
        </Button>
      </DashboardHeader>

      {/* Filter tabs */}
      <div className="flex gap-1 border-b mb-4">
        {(["active", "inactive", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              filter === f
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {f === "active" ? "Đang đăng ký" : f === "inactive" ? "Đã hủy" : "Tất cả"}
            <span className="ml-1.5 text-xs bg-muted px-1.5 py-0.5 rounded-full">
              {f === "active"
                ? subscribers.filter((s) => s.active).length
                : f === "inactive"
                ? subscribers.filter((s) => !s.active).length
                : subscribers.length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground py-8 text-center">Đang tải...</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">Chưa có subscriber nào.</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Tên</th>
                <th className="text-left px-4 py-3 font-medium">Ngày đăng ký</th>
                <th className="text-left px-4 py-3 font-medium">Trạng thái</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{s.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.name ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(s.subscribedAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-4 py-3">
                    {s.active ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
                        Đang đăng ký
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        Đã hủy
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {s.active && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs"
                        onClick={() => unsubscribe(s.id)}
                      >
                        Hủy đăng ký
                      </Button>
                    )}
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
