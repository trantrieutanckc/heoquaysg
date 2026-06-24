import Link from "next/link"
import { db } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import { PageEntrance, StaggerContainer, StaggerItem } from "@/components/motion-primitives"

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
    <div className="container py-6 lg:py-10">
      <PageEntrance>
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
      </PageEntrance>
      {posts.length ? (
        <StaggerContainer className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const image = post.image as { url?: string; alt?: string } | null
            return (
              <StaggerItem key={post.id} hover>
                <article className="group relative flex flex-col space-y-3">
                  {image?.url ? (
                    <div className="overflow-hidden rounded-md border bg-muted aspect-video">
                      <img
                        src={image.url}
                        alt={image.alt ?? post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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

                  <h2 className="text-2xl font-extrabold leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>

                  {post.price != null && (
                    <span className="inline-flex items-center rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-3 py-0.5 text-sm font-bold w-fit">
                      {new Intl.NumberFormat("vi-VN").format(post.price)} đ
                    </span>
                  )}

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
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      ) : (
        <p className="text-muted-foreground">Chưa có bài viết nào được đăng.</p>
      )}
    </div>
  )
}
