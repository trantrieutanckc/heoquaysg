import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { CommentList } from "@/components/comment-list"
import { DashboardPagination } from "@/components/dashboard-pagination"

export const metadata = { title: "Bình luận" }

const PAGE_SIZE = 20

export default async function CommentsPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const user = await getCurrentUser()
  if (!user || (user as any).role !== "ADMIN") redirect("/dashboard")

  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1)

  const [total, comments] = await Promise.all([
    db.comment.count(),
    db.comment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        post: { select: { id: true, title: true } },
      },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Bình luận"
        text={`${total} bình luận`}
      />
      <CommentList comments={comments} />
      <DashboardPagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/dashboard/comments"
      />
    </DashboardShell>
  )
}
