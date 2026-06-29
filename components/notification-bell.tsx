"use client"

import * as React from "react"
import Link from "next/link"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  type: string
  title: string
  body: string | null
  link: string | null
  read: boolean
  createdAt: string
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return "vừa xong"
  if (m < 60) return `${m} phút trước`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} giờ trước`
  const d = Math.floor(h / 24)
  return `${d} ngày trước`
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function typeIcon(type: string) {
  if (type === "new_comment") return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
  if (type === "scheduled_published") return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

export function NotificationBell() {
  const [open, setOpen] = React.useState(false)
  const [notifications, setNotifications] = React.useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = React.useState(0)
  const [loading, setLoading] = React.useState(true)

  async function fetchNotifications() {
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" })
      if (!res.ok) return
      const data = await res.json()
      setNotifications(data.notifications ?? [])
      setUnreadCount(data.unreadCount ?? 0)
    } catch {}
    finally { setLoading(false) }
  }

  // Initial fetch + polling every 60s, pause when tab is hidden
  React.useEffect(() => {
    fetchNotifications()
    const interval = setInterval(() => {
      if (!document.hidden) fetchNotifications()
    }, 60_000)
    return () => clearInterval(interval)
  }, [])

  async function markAllRead() {
    await fetch("/api/notifications/read-all", { method: "PATCH" })
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  async function clearAll() {
    await fetch("/api/notifications/read-all", { method: "DELETE" })
    setNotifications([])
    setUnreadCount(0)
  }

  function handleOpen(val: boolean) {
    setOpen(val)
    if (val && unreadCount > 0) {
      // Mark all read when opening the panel
      markAllRead()
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <button
          className="relative rounded-md p-2 hover:bg-accent transition-colors"
          aria-label="Thông báo"
        >
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white leading-none">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0 shadow-xl" sideOffset={8}>
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-sm font-semibold">Thông báo</h3>
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Xóa tất cả
            </button>
          )}
        </div>

        {/* List */}
        <div className="max-h-[360px] overflow-y-auto divide-y">
          {loading ? (
            <div className="py-10 text-center text-sm text-muted-foreground">Đang tải...</div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
              <BellIcon className="h-8 w-8 opacity-20" />
              <p className="text-sm">Chưa có thông báo</p>
            </div>
          ) : (
            notifications.map((n) => {
              const content = (
                <div className={cn(
                  "flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors",
                  !n.read && "bg-blue-50/50 dark:bg-blue-950/20"
                )}>
                  <div className="mt-0.5">{typeIcon(n.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug">{n.title}</p>
                    {n.body && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>
                    )}
                    <p className="text-[11px] text-muted-foreground/70 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                  {!n.read && (
                    <div className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                  )}
                </div>
              )
              return n.link ? (
                <Link key={n.id} href={n.link} onClick={() => setOpen(false)}>
                  {content}
                </Link>
              ) : (
                <div key={n.id}>{content}</div>
              )
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
