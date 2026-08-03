"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/admin/header"
import { DashboardShell } from "@/components/admin/shell"

interface BlockedIp { id: string; ip: string; reason: string | null; createdAt: string }
interface TopIp { ip: string; _sum: { count: number | null }; _max: { lastSeen: string | null } }

export default function IpBlockPage() {
  const [blocked, setBlocked] = useState<BlockedIp[]>([])
  const [topIps, setTopIps] = useState<TopIp[]>([])
  const [loading, setLoading] = useState(true)
  const [ip, setIp] = useState("")
  const [reason, setReason] = useState("")
  const [saving, setSaving] = useState(false)

  async function load() {
    const res = await fetch("/api/dashboard/ip-block")
    const data = await res.json()
    setBlocked(data.blocked ?? [])
    setTopIps(data.topIps ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function blockIp(targetIp: string, targetReason = "") {
    setSaving(true)
    await fetch("/api/dashboard/ip-block", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ip: targetIp, reason: targetReason }),
    })
    setIp(""); setReason("")
    await load()
    setSaving(false)
  }

  async function unblockIp(targetIp: string) {
    await fetch("/api/dashboard/ip-block", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ip: targetIp }),
    })
    await load()
  }

  const blockedSet = new Set(blocked.map((b) => b.ip))

  return (
    <DashboardShell>
      <DashboardHeader heading="Chặn IP" text="Quản lý các IP spam và độc hại." />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── Top IPs ── */}
        <div className="rounded-xl border bg-card">
          <div className="p-5 border-b">
            <p className="font-semibold text-sm">Top IPs gửi request</p>
            <p className="text-xs text-muted-foreground mt-0.5">Nhấn "Chặn" để block ngay</p>
          </div>
          {loading ? (
            <p className="p-5 text-sm text-muted-foreground">Đang tải...</p>
          ) : topIps.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">Chưa có dữ liệu.</p>
          ) : (
            <div className="divide-y">
              {topIps.map((row) => (
                <div key={row.ip} className="flex items-center justify-between px-5 py-3 gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-sm truncate">{row.ip}</p>
                    <p className="text-xs text-muted-foreground">
                      {(row._sum.count ?? 0).toLocaleString("vi-VN")} requests
                      {row._max.lastSeen && ` · ${new Date(row._max.lastSeen).toLocaleDateString("vi-VN")}`}
                    </p>
                  </div>
                  {blockedSet.has(row.ip) ? (
                    <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full shrink-0">Đã chặn</span>
                  ) : (
                    <button
                      onClick={() => blockIp(row.ip, "Spam")}
                      className="text-xs bg-destructive text-destructive-foreground px-3 py-1.5 rounded-lg hover:opacity-90 shrink-0"
                    >
                      Chặn
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Blocked IPs + Add form ── */}
        <div className="space-y-4">
          {/* Add IP */}
          <div className="rounded-xl border bg-card p-5 space-y-3">
            <p className="font-semibold text-sm">Thêm IP vào danh sách chặn</p>
            <input
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="Nhập địa chỉ IP..."
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Lý do (tuỳ chọn)..."
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={() => ip && blockIp(ip, reason)}
              disabled={!ip || saving}
              className="w-full bg-destructive text-destructive-foreground py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              Chặn IP này
            </button>
          </div>

          {/* Blocked list */}
          <div className="rounded-xl border bg-card">
            <div className="p-5 border-b">
              <p className="font-semibold text-sm">Danh sách đang chặn ({blocked.length})</p>
            </div>
            {blocked.length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground">Chưa có IP nào bị chặn.</p>
            ) : (
              <div className="divide-y">
                {blocked.map((b) => (
                  <div key={b.id} className="flex items-center justify-between px-5 py-3 gap-3">
                    <div className="min-w-0">
                      <p className="font-mono text-sm truncate">{b.ip}</p>
                      {b.reason && <p className="text-xs text-muted-foreground">{b.reason}</p>}
                    </div>
                    <button
                      onClick={() => unblockIp(b.ip)}
                      className="text-xs border px-3 py-1.5 rounded-lg hover:bg-muted shrink-0"
                    >
                      Bỏ chặn
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
