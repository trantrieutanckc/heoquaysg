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
      author: { select: { name: true, image: true } },
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
        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const image = post.image as { url?: string; alt?: string } | null
            return (
              <StaggerItem key={post.id} hover>
                <Link
                  href={`/posts/${post.id}`}
                  className="group flex flex-col rounded-2xl overflow-hidden border bg-card hover:shadow-lg transition-shadow duration-300 h-full"
                >
                  <div className="aspect-video overflow-hidden bg-muted">
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

                  <div className="flex flex-col gap-2.5 p-4 flex-1">
                    {post.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {post.categories.map(({ category }) => (
                          <span
                            key={category.slug}
                            className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-semibold"
                          >
                            {category.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <h2 className="font-heading text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    {post.price != null && (
                      <span className="inline-flex items-center rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-2.5 py-0.5 text-xs font-bold w-fit">
                        {new Intl.NumberFormat("vi-VN").format(post.price)} đ
                      </span>
                    )}

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto pt-2 border-t">
                      {post.author?.image ? (
                        <img src={post.author.image} alt="" className="h-5 w-5 rounded-full object-cover" />
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                          {post.author?.name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                      )}
                      {post.author?.name && <span>{post.author.name}</span>}
                      {post.author?.name && <span>·</span>}
                      <time dateTime={post.createdAt.toISOString()}>
                        {formatDate(post.createdAt.toISOString())}
                      </time>
                    </div>
                  </div>
                </Link>
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
