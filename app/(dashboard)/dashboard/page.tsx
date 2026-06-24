import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { isEditor } from "@/lib/permissions"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { PostCreateButton } from "@/components/post-create-button"
import { PostItem } from "@/components/post-item"
import { DashboardShell } from "@/components/shell"
import { DashboardPagination } from "@/components/dashboard-pagination"
import { DashboardOverview } from "@/components/dashboard-overview"

export const metadata = {
  title: "Dashboard",
}

const PAGE_SIZE = 10

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

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const isAdmin = (user as any).role === "ADMIN"
  const canCreate = isEditor((user as any).role)
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1)
  const postWhere = { authorId: user.id }

  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
  sixMonthsAgo.setDate(1)
  sixMonthsAgo.setHours(0, 0, 0, 0)

  const [
    total, posts, allCategories,
    totalPosts, publishedPosts,
    totalComments, pendingComments,
    totalUsers,
    recentPosts, recentComments,
    topCategories,
  ] = await Promise.all([
    // Posts list (paginated, by current user)
    db.post.count({ where: postWhere }),
    db.post.findMany({
      where: postWhere,
      select: {
        id: true,
        title: true,
        published: true,
        featured: true,
        createdAt: true,
        image: true,
        likes: true,
        categories: {
          select: { category: { select: { id: true, name: true, slug: true } } },
        },
      },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    // Overview stats
    db.post.count({ where: isAdmin ? {} : postWhere }),
    db.post.count({ where: isAdmin ? { published: true } : { ...postWhere, published: true } }),
    db.comment.count(),
    db.comment.count({ where: { approved: false } }),
    isAdmin ? db.user.count() : Promise.resolve(0),
    // Chart data
    db.post.findMany({
      where: {
        createdAt: { gte: sixMonthsAgo },
        ...(isAdmin ? {} : postWhere),
      },
      select: { createdAt: true },
    }),
    db.comment.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    }),
    // Top categories
    db.category.findMany({
      select: { name: true, _count: { select: { posts: true } } },
      orderBy: { posts: { _count: "desc" } },
      take: 5,
    }),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <DashboardShell>
      {/* ── Overview section ─────────────────────────────────── */}
      <DashboardOverview
        stats={{
          totalPosts,
          publishedPosts,
          pendingComments,
          totalComments,
          totalUsers,
          isAdmin,
        }}
        postsByMonth={buildMonthChart(recentPosts)}
        commentsByMonth={buildMonthChart(recentComments)}
        topCategories={topCategories.map((c) => ({ name: c.name, count: c._count.posts }))}
      />

      {/* ── Posts list ───────────────────────────────────────── */}
      <div className="mt-2">
        <DashboardHeader heading="Bài viết của tôi" text={`${total} bài viết.`}>
          {canCreate && <PostCreateButton />}
        </DashboardHeader>
        <div>
          {posts?.length ? (
            <>
              <div className="divide-y divide-border rounded-md border">
                {posts.map((post) => (
                  <PostItem key={post.id} post={post} allCategories={allCategories} />
                ))}
              </div>
              <DashboardPagination
                currentPage={page}
                totalPages={totalPages}
                basePath="/dashboard"
              />
            </>
          ) : (
            <EmptyPlaceholder>
              <EmptyPlaceholder.Icon name="post" />
              <EmptyPlaceholder.Title>Chưa có bài viết</EmptyPlaceholder.Title>
              <EmptyPlaceholder.Description>
                {canCreate
                  ? "Bạn chưa có bài viết nào. Bắt đầu tạo nội dung."
                  : "Chưa có bài viết nào được phân công cho bạn."}
              </EmptyPlaceholder.Description>
              {canCreate && <PostCreateButton variant="outline" />}
            </EmptyPlaceholder>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}
