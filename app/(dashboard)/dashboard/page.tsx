import { redirect } from "next/navigation"
import dynamic from "next/dynamic"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

const DashboardOverview = dynamic(
  () => import("@/components/dashboard-overview"),
  { ssr: false }
)

export const metadata = { title: "Dashboard" }

function buildMonthChart(items: { createdAt: Date }[], monthCount = 6) {
  const now = new Date()
  return Array.from({ length: monthCount }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (monthCount - 1 - i), 1)
    const y = d.getFullYear()
    const m = d.getMonth()
    const label = d.toLocaleDateString("vi-VN", { month: "short" }).replace("thg ", "T")
    return {
      month: label,
      count: items.filter(
        (item) => item.createdAt.getFullYear() === y && item.createdAt.getMonth() === m
      ).length,
    }
  })
}

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect(authOptions?.pages?.signIn || "/login")

  const isAdmin = (user as any).role === "ADMIN"
  const postWhere = { authorId: user.id }

  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
  sixMonthsAgo.setDate(1)
  sixMonthsAgo.setHours(0, 0, 0, 0)

  const [totalPosts, publishedPosts, totalComments, pendingComments, totalUsers, recentPosts, recentComments] =
    await Promise.all([
      db.post.count({ where: isAdmin ? {} : postWhere }),
      db.post.count({ where: isAdmin ? { published: true } : { ...postWhere, published: true } }),
      db.comment.count(),
      db.comment.count({ where: { approved: false } }),
      isAdmin ? db.user.count() : Promise.resolve(0),
      db.post.findMany({
        where: { createdAt: { gte: sixMonthsAgo }, ...(isAdmin ? {} : postWhere) },
        select: { createdAt: true },
      }),
      db.comment.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true },
      }),
    ])

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Tổng quan hoạt động của website." />

      <DashboardOverview
        stats={{ totalPosts, publishedPosts, pendingComments, totalComments, totalUsers, isAdmin }}
        postsByMonth={buildMonthChart(recentPosts)}
        commentsByMonth={buildMonthChart(recentComments)}
      />
    </DashboardShell>
  )
}
