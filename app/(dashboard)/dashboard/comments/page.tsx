import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { CommentList } from "@/components/comment-list"

export const metadata = { title: "Bình luận" }

export default async function CommentsPage() {
  const user = await getCurrentUser()
  if (!user || (user as any).role !== "ADMIN") redirect("/dashboard")
  const comments = await db.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      post: { select: { id: true, title: true } },
    },
  })

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Bình luận"
        text={`${comments.length} bình luận`}
      />
      <CommentList comments={comments} />
    </DashboardShell>
  )
}
