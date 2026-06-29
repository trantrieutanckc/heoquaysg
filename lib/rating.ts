import { db } from "@/lib/db"

export async function recalculateRating(postId: string) {
  const result = await db.comment.aggregate({
    where: { postId, approved: true, rating: { not: null } },
    _avg: { rating: true },
    _count: { rating: true },
  })
  await db.post.update({
    where: { id: postId },
    data: {
      avgRating: result._avg.rating,
      ratingCount: result._count.rating,
    },
  })
}
