import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { DashboardHeader } from "@/components/admin/header"
import { DashboardShell } from "@/components/admin/shell"
import { ScheduledPostItem } from "@/components/admin/scheduled-post-item"
import { EmptyPlaceholder } from "@/components/admin/empty-placeholder"

export const metadata = { title: "Lên lịch" }

export default async function ScheduledPage() {
  const user = await getCurrentUser()
  if (!user) redirect(authOptions?.pages?.signIn || "/login")

  const isAdmin = user.role === "ADMIN"

  const posts = await db.post.findMany({
    where: {
      published: false,
      scheduledAt: { not: null },
      ...(isAdmin ? {} : { authorId: user.id }),
    },
    select: {
      id: true,
      title: true,
      scheduledAt: true,
      image: true,
      categories: { select: { category: { select: { name: true } } } },
      author: { select: { name: true } },
    },
    orderBy: { scheduledAt: "asc" },
  })

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Lên lịch đăng bài"
        text={posts.length ? `${posts.length} bài đang chờ đăng.` : "Chưa có bài nào được lên lịch."}
      />

      {posts.length ? (
        <div className="rounded-md border divide-y divide-border overflow-hidden">
          {posts.map((post) => (
            <ScheduledPostItem key={post.id} post={post as any} />
          ))}
        </div>
      ) : (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="clock" />
          <EmptyPlaceholder.Title>Chưa có bài lên lịch</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            Vào editor và dùng nút "Lên lịch" để đặt thời gian đăng bài tự động.
          </EmptyPlaceholder.Description>
        </EmptyPlaceholder>
      )}
    </DashboardShell>
  )
}
