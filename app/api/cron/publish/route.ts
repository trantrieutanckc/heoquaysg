import { db } from "@/lib/db"
import { createScheduledPublishedNotification } from "@/lib/notifications"

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 })
  }

  try {
    const now = new Date()

    // Lấy danh sách bài trước khi update để gửi notification
    const duePosts = await db.post.findMany({
      where: { published: false, scheduledAt: { lte: now } },
      select: { id: true, title: true, authorId: true },
    })

    if (!duePosts.length) {
      return Response.json({ published: 0, at: now.toISOString() })
    }

    await db.post.updateMany({
      where: { published: false, scheduledAt: { lte: now } },
      data: { published: true, scheduledAt: null },
    })

    // Gửi notification cho từng tác giả (fire-and-forget)
    Promise.all(
      duePosts.map((p) =>
        createScheduledPublishedNotification({
          postId: p.id,
          postTitle: p.title,
          authorId: p.authorId,
        }).catch(() => {})
      )
    )

    return Response.json({ published: duePosts.length, at: now.toISOString() })
  } catch (err) {
    console.error("[cron/publish]", err)
    return new Response("Internal Server Error", { status: 500 })
  }
}
