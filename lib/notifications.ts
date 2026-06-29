import { db } from "@/lib/db"

export async function createCommentNotification({
  postId,
  postTitle,
  authorName,
}: {
  postId: string
  postTitle: string
  authorName: string
}) {
  // Notify all ADMIN users + the post author (deduplicated)
  const [admins, post] = await Promise.all([
    db.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true },
    }),
    db.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    }),
  ])

  const recipientIds = new Set(admins.map((u) => u.id))
  if (post?.authorId) recipientIds.add(post.authorId)

  if (!recipientIds.size) return

  await db.notification.createMany({
    data: Array.from(recipientIds).map((userId) => ({
      userId,
      type: "new_comment",
      title: "Bình luận mới",
      body: `${authorName} vừa bình luận vào "${postTitle}"`,
      link: `/dashboard/comments`,
    })),
  })
}

export async function createScheduledPublishedNotification({
  postId,
  postTitle,
  authorId,
}: {
  postId: string
  postTitle: string
  authorId: string
}) {
  await db.notification.create({
    data: {
      userId: authorId,
      type: "scheduled_published",
      title: "Bài viết đã được đăng",
      body: `"${postTitle}" vừa được đăng tự động theo lịch.`,
      link: `/posts/${postId}`,
    },
  })
}
