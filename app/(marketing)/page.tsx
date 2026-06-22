export const dynamic = "force-dynamic"

import Link from "next/link"
import { db } from "@/lib/db"
import { formatDate } from "@/lib/utils"

export default async function IndexPage() {
  const [featuredPost, posts] = await Promise.all([
    db.post.findFirst({
      where: { published: true, featured: true },
      include: {
        author: { select: { name: true, image: true } },
        categories: { include: { category: { select: { name: true, slug: true } } } },
      },
    }),
    db.post.findMany({
      where: { published: true },
      include: {
        author: { select: { name: true, image: true } },
        categories: { include: { category: { select: { name: true, slug: true } } } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ])

  const featured = featuredPost ?? posts[0]
  const others = posts.filter((p) => p.id !== featured?.id)

  const img = (image: unknown) => image as { url?: string; alt?: string } | null

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-center">
        <p className="text-lg font-medium mb-2">Chưa có bài viết nào</p>
        <p className="text-sm text-muted-foreground">Hãy tạo bài viết đầu tiên trong dashboard.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">

      <div className="container max-w-6xl px-4 sm:px-6 pt-10 pb-20 lg:pt-14 lg:pb-28">

      {/* ── Hero featured post ─────────────────────────────── */}
      {featured && (() => {
        const image = img(featured.image)
        return (
          <Link href={`/posts/${featured.id}`} className="group block relative w-full overflow-hidden rounded-2xl bg-muted mb-12" style={{height: "460px"}}>
            {image?.url ? (
              <img
                src={image.url}
                alt={image.alt ?? featured.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-muted" />
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10">
              <div className="max-w-3xl">
                {featured.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {featured.categories.map(({ category }) => (
                      <span key={category.slug} className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm text-white px-3 py-0.5 text-xs font-semibold">
                        {category.name}
                      </span>
                    ))}
                  </div>
                )}
                <h1 className="font-heading text-2xl sm:text-4xl lg:text-5xl text-white leading-tight mb-4 group-hover:text-white/90 transition-colors">
                  {featured.title}
                </h1>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  {featured.author?.image ? (
                    <img src={featured.author.image} alt="" className="h-7 w-7 rounded-full object-cover ring-2 ring-white/30" />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">
                      {featured.author?.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                  )}
                  <span className="font-medium text-white/90">{featured.author?.name}</span>
                  <span>·</span>
                  <time dateTime={featured.createdAt.toISOString()}>{formatDate(featured.createdAt.toISOString())}</time>
                </div>
              </div>
            </div>

            {/* Badge */}
            <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
              <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow">
                Nổi bật
              </span>
            </div>
          </Link>
        )
      })()}

        {/* ── Posts grid ─────────────────────────────────────── */}
        {others.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="font-heading text-xl sm:text-2xl">Bài viết mới nhất</h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((post) => {
                const image = img(post.image)
                return (
                  <Link
                    key={post.id}
                    href={`/posts/${post.id}`}
                    className="group flex flex-col rounded-2xl overflow-hidden border bg-card hover:shadow-lg transition-all duration-300"
                  >
                    <div className="aspect-[16/9] overflow-hidden bg-muted">
                      {image?.url ? (
                        <img
                          src={image.url}
                          alt={image.alt ?? post.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-muted to-muted-foreground/10" />
                      )}
                    </div>
                    <div className="flex flex-col gap-2.5 p-4">
                      {post.categories.length > 0 && (
                        <span className="text-xs font-semibold text-primary">
                          {post.categories[0].category.name}
                        </span>
                      )}
                      <h2 className="font-heading text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto pt-2 border-t">
                        {post.author?.image ? (
                          <img src={post.author.image} alt="" className="h-5 w-5 rounded-full object-cover" />
                        ) : (
                          <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                            {post.author?.name?.[0]?.toUpperCase() ?? "?"}
                          </div>
                        )}
                        <span>{post.author?.name}</span>
                        <span>·</span>
                        <time dateTime={post.createdAt.toISOString()}>{formatDate(post.createdAt.toISOString())}</time>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

