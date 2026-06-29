"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface Stats {
  totalPosts: number
  publishedPosts: number
  pendingComments: number
  totalComments: number
  totalUsers: number
  isAdmin: boolean
}

interface Props {
  stats: Stats
  postsByMonth: { month: string; count: number }[]
  commentsByMonth: { month: string; count: number }[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-background shadow-md px-3 py-2 text-sm">
      <p className="font-medium mb-1">{label}</p>
      <p className="text-muted-foreground">
        {payload[0].name}: <span className="font-semibold text-foreground">{payload[0].value}</span>
      </p>
    </div>
  )
}

const STAT_CONFIGS = [
  {
    key: "posts",
    label: "Bài viết",
    gradient: "from-blue-500 to-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
  {
    key: "comments",
    label: "Bình luận",
    gradient: "from-orange-400 to-orange-500",
    bg: "bg-orange-50 dark:bg-orange-950/40",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
      </svg>
    ),
  },
  {
    key: "published",
    label: "Đã đăng",
    gradient: "from-emerald-500 to-green-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    key: "users",
    label: "Người dùng",
    gradient: "from-violet-500 to-purple-600",
    bg: "bg-violet-50 dark:bg-violet-950/40",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
]

export default function DashboardOverview({ stats, postsByMonth, commentsByMonth }: Props) {
  const draftPosts = stats.totalPosts - stats.publishedPosts

  const statValues = [
    { value: stats.totalPosts, sub: `${stats.publishedPosts} đã đăng · ${draftPosts} nháp` },
    { value: stats.totalComments, sub: stats.pendingComments > 0 ? `${stats.pendingComments} chờ duyệt` : "Tất cả đã duyệt" },
    { value: stats.publishedPosts, sub: `${stats.totalPosts > 0 ? Math.round((stats.publishedPosts / stats.totalPosts) * 100) : 0}% tổng bài viết` },
    { value: stats.isAdmin ? stats.totalUsers : stats.pendingComments, sub: stats.isAdmin ? "Tổng tài khoản hệ thống" : "Bình luận cần xem xét" },
  ]

  return (
    <div className="space-y-5">
      {/* ── Stat cards ─────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STAT_CONFIGS.map((cfg, i) => (
          <div key={cfg.key} className="rounded-xl border bg-card overflow-hidden">
            <div className={`h-1.5 w-full bg-gradient-to-r ${cfg.gradient}`} />
            <div className="p-5 flex items-start gap-4">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br ${cfg.gradient}`}>
                {cfg.icon}
              </div>
              <div>
                <p className="text-2xl font-bold leading-none tracking-tight">
                  {statValues[i].value.toLocaleString("vi-VN")}
                </p>
                <p className="text-sm font-medium mt-1 text-foreground">{cfg.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{statValues[i].sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts ─────────────────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm font-semibold mb-1">Bài viết theo tháng</p>
          <p className="text-xs text-muted-foreground mb-4">6 tháng gần nhất</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={postsByMonth} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))" }} />
              <Bar dataKey="count" name="Bài viết" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm font-semibold mb-1">Bình luận theo tháng</p>
          <p className="text-xs text-muted-foreground mb-4">6 tháng gần nhất</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={commentsByMonth} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))" }} />
              <Bar dataKey="count" name="Bình luận" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )
}
