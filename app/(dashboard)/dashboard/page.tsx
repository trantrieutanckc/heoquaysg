import { redirect } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

const DashboardOverview = dynamic(
  () => import("@/components/dashboard-overview").then((m) => m.DashboardOverview),
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

  const [
    totalPosts, publishedPosts,
    totalComments, pendingComments,
    totalUsers,
    recentPosts, recentComments,
    topCategories,
    topLikedPosts,
    topCommentedPosts,
  ] = await Promise.all([
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
    db.category.findMany({
      select: { name: true, _count: { select: { posts: true } } },
      orderBy: { posts: { _count: "desc" } },
      take: 5,
    }),
    // Top bài được like nhiều nhất
    db.post.findMany({
      where: { published: true, ...(isAdmin ? {} : postWhere) },
      select: {
        id: true, title: true, likes: true,
        categories: { select: { category: { select: { name: true } } }, take: 1 },
      },
      orderBy: { likes: "desc" },
      take: 5,
    }),
    // Top bài nhiều bình luận nhất
    db.post.findMany({
      where: { published: true, ...(isAdmin ? {} : postWhere) },
      select: {
        id: true, title: true,
        _count: { select: { comments: true } },
        categories: { select: { category: { select: { name: true } } }, take: 1 },
      },
      orderBy: { comments: { _count: "desc" } },
      take: 5,
    }),
  ])

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Tổng quan hoạt động của website." />

      <DashboardOverview
        stats={{ totalPosts, publishedPosts, pendingComments, totalComments, totalUsers, isAdmin }}
        postsByMonth={buildMonthChart(recentPosts)}
        commentsByMonth={buildMonthChart(recentComments)}
        topCategories={topCategories.map((c) => ({ name: c.name, count: c._count.posts }))}
      />

      {/* ── Top bài viết ─────────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Top liked */}
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-rose-400 to-pink-500" />
          <div className="p-5">
            <p className="text-sm font-semibold mb-1">Bài được like nhiều nhất</p>
            <p className="text-xs text-muted-foreground mb-4">Top 5 bài viết</p>
            {topLikedPosts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Chưa có dữ liệu.</p>
            ) : (
              <div className="space-y-3">
                {topLikedPosts.map((post, i) => {
                  const badges = ["bg-rose-500","bg-rose-400","bg-rose-300","bg-rose-200","bg-rose-100"]
                  const textColors = ["text-white","text-white","text-rose-700","text-rose-600","text-rose-500"]
                  return (
                    <div key={post.id} className="flex items-center gap-3">
                      <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${badges[i]} ${textColors[i]}`}>
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <Link href={`/editor/${post.id}`} className="text-sm font-medium truncate block hover:text-primary transition-colors">
                          {post.title}
                        </Link>
                        {post.categories[0] && (
                          <p className="text-xs text-muted-foreground truncate">{post.categories[0].category.name}</p>
                        )}
                      </div>
                      <span className="text-sm font-bold text-rose-500 shrink-0 tabular-nums">♥ {post.likes}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Top commented */}
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-orange-500" />
          <div className="p-5">
            <p className="text-sm font-semibold mb-1">Bài nhiều bình luận nhất</p>
            <p className="text-xs text-muted-foreground mb-4">Top 5 bài viết</p>
            {topCommentedPosts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Chưa có dữ liệu.</p>
            ) : (
              <div className="space-y-3">
                {topCommentedPosts.map((post, i) => {
                  const badges = ["bg-amber-500","bg-amber-400","bg-amber-300","bg-amber-200","bg-amber-100"]
                  const textColors = ["text-white","text-white","text-amber-800","text-amber-700","text-amber-600"]
                  return (
                    <div key={post.id} className="flex items-center gap-3">
                      <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${badges[i]} ${textColors[i]}`}>
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <Link href={`/editor/${post.id}`} className="text-sm font-medium truncate block hover:text-primary transition-colors">
                          {post.title}
                        </Link>
                        {post.categories[0] && (
                          <p className="text-xs text-muted-foreground truncate">{post.categories[0].category.name}</p>
                        )}
                      </div>
                      <span className="text-sm font-bold text-amber-500 shrink-0 tabular-nums">💬 {post._count.comments}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
