"use client"

import * as React from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { Bell, MessageSquare, Clock, Info, Trash2, Check, CalendarCheck } from "lucide-react"

import { DashboardHeader } from "@/components/admin/header"
import { DashboardShell } from "@/components/admin/shell"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

interface Notification {
  id: string
  type: string
  title: string
  body: string | null
  link: string | null
  read: boolean
  createdAt: string
}

function NotificationIcon({ type }: { type: string }) {
  if (type === "new_comment") return <MessageSquare className="h-4 w-4 text-blue-500" />
  if (type === "scheduled_published") return <Clock className="h-4 w-4 text-green-500" />
  if (type === "new_booking") return <CalendarCheck className="h-4 w-4 text-orange-500" />
  return <Info className="h-4 w-4 text-muted-foreground" />
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<Notification[]>([])
  const [loading, setLoading] = React.useState(true)
  const [unreadCount, setUnreadCount] = React.useState(0)

  async function fetchNotifications() {
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" })
      if (!res.ok) return
      const data = await res.json()
      setNotifications(data.notifications ?? [])
      setUnreadCount(data.unreadCount ?? 0)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => { fetchNotifications() }, [])

  async function markAllRead() {
    await fetch("/api/notifications/read-all", { method: "PATCH" })
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
    toast({ variant: "success", description: "Đã đánh dấu tất cả là đã đọc." })
  }

  async function clearAll() {
    await fetch("/api/notifications/read-all", { method: "DELETE" })
    setNotifications([])
    setUnreadCount(0)
    toast({ variant: "success", description: "Đã xoá tất cả thông báo." })
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Thông báo"
        text={unreadCount > 0 ? `${unreadCount} thông báo chưa đọc.` : "Tất cả đã đọc."}
      >
        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllRead} className="gap-1.5">
                <Check className="h-4 w-4" />
                Đọc tất cả
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={clearAll} className="gap-1.5 text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
              Xoá tất cả
            </Button>
          </div>
        )}
      </DashboardHeader>

      {loading ? (
        <div className="rounded-md border divide-y">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-4 animate-pulse">
              <div className="h-4 w-4 rounded-full bg-muted mt-0.5 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground rounded-md border">
          <Bell className="h-12 w-12 opacity-15" />
          <p className="font-medium">Chưa có thông báo nào</p>
          <p className="text-sm">Thông báo sẽ xuất hiện khi có đặt lịch mới, bình luận mới, hoặc bài viết được đăng theo lịch.</p>
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          {notifications.map((n) => {
            const row = (
              <div className={cn(
                "flex items-start gap-3 px-4 py-4 hover:bg-muted/40 transition-colors",
                !n.read && "bg-blue-50/60 dark:bg-blue-950/20"
              )}>
                <div className="mt-0.5 shrink-0">
                  <NotificationIcon type={n.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm leading-snug", !n.read && "font-semibold")}>{n.title}</p>
                  {n.body && <p className="text-sm text-muted-foreground mt-0.5">{n.body}</p>}
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: vi })}
                  </p>
                </div>
                {!n.read && (
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                )}
              </div>
            )

            return n.link ? (
              <Link key={n.id} href={n.link} className="block border-b last:border-0">
                {row}
              </Link>
            ) : (
              <div key={n.id} className="border-b last:border-0">{row}</div>
            )
          })}
        </div>
      )}
    </DashboardShell>
  )
}
