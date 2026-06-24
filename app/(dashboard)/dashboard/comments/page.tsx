import Link from "next/link"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { CommentList } from "@/components/comment-list"
import { DashboardPagination } from "@/components/dashboard-pagination"
import { cn } from "@/lib/utils"

export const metadata = { title: "Bình luận" }

const PAGE_SIZE = 20

export default async function CommentsPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string }
}) {
  const user = await getCurrentUser()
  if (!user || (user as any).role !== "ADMIN") redirect("/dashboard")

  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1)
  const status = searchParams.status // "pending" | "approved" | undefined (all)

  const where =
    status === "pending"
      ? { approved: false }
      : status === "approved"
      ? { approved: true }
      : {}

  const [total, pendingCount, comments] = await Promise.all([
    db.comment.count({ where }),
    db.comment.count({ where: { approved: false } }),
    db.comment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        post: { select: { id: true, title: true } },
      },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const tabs = [
    { label: "Tất cả", value: undefined },
    { label: "Chờ duyệt", value: "pending" },
    { label: "Đã duyệt", value: "approved" },
  ]

  function tabHref(value: string | undefined) {
    const params = new URLSearchParams()
    if (value) params.set("status", value)
    const q = params.toString()
    return `/dashboard/comments${q ? `?${q}` : ""}`
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Bình luận"
        text={
          pendingCount > 0
            ? `${pendingCount} bình luận đang chờ duyệt`
            : `${total} bình luận`
        }
      />

      {/* Filter tabs */}
      <div className="flex gap-1 border-b pb-0 mb-4">
        {tabs.map((tab) => {
          const active =
            (tab.value === undefined && !status) || tab.value === status
          return (
            <Link
              key={tab.label}
              href={tabHref(tab.value)}
              className={cn(
                "px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
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

      <CommentList comments={comments} />
      <DashboardPagination
        currentPage={page}
        totalPages={totalPages}
        basePath={status ? `/dashboard/comments?status=${status}` : "/dashboard/comments"}
      />
    </DashboardShell>
  )
}
