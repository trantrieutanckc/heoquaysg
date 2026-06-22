import { db } from "@/lib/db"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { CommentList } from "@/components/comment-list"

export const metadata = { title: "Bình luận" }

export default async function CommentsPage() {
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
