import Link from "next/link"
import { db } from "@/lib/db"
import { formatDate } from "@/lib/utils"

export const metadata = {
  title: "Tin tức",
  description: "Các bài viết mới nhất về heo quay, vịt quay, gà quay và ẩm thực.",
}

export default async function BlogPage() {
  const posts = await db.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true } },
      categories: {
        include: { category: { select: { name: true, slug: true } } },
      },
    },
  })

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block font-heading text-4xl tracking-tight lg:text-5xl">
            Tin tức
          </h1>
          <p className="text-xl text-muted-foreground">
            Các bài viết mới nhất về ẩm thực và món quay.
          </p>
        </div>
      </div>
      <hr className="my-8" />
      {posts.length ? (
        <div className="grid gap-8 sm:grid-cols-2">
          {posts.map((post) => {
            const image = post.image as { url?: string; alt?: string } | null
            return (
              <article
                key={post.id}
                className="group relative flex flex-col space-y-3"
              >
                {image?.url ? (
                  <div className="overflow-hidden rounded-md border bg-muted aspect-video">
                    <img
                      src={image.url}
                      alt={image.alt ?? post.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="rounded-md border bg-muted aspect-video" />
                )}

                <div className="flex flex-wrap gap-1">
                  {post.categories.map(({ category }) => (
                    <span
                      key={category.slug}
                      className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>

                <h2 className="text-2xl font-extrabold leading-tight">
                  {post.title}
                </h2>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {post.author?.name && <span>{post.author.name}</span>}
                  {post.author?.name && <span>·</span>}
                  <time dateTime={post.createdAt.toISOString()}>
                    {formatDate(post.createdAt.toISOString())}
                  </time>
                </div>

                <Link href={`/posts/${post.id}`} className="absolute inset-0">
                  <span className="sr-only">Đọc bài viết</span>
                </Link>
              </article>
            )
          })}
        </div>
      ) : (
        <p className="text-muted-foreground">Chưa có bài viết nào được đăng.</p>
      )}
    </div>
  )
}
