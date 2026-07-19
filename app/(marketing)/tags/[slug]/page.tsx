import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import { PageEntrance, StaggerContainer, StaggerItem } from "@/components/motion-primitives"
import { BLUR_PLACEHOLDER } from "@/lib/image"

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props) {
  const tag = await db.tag.findUnique({ where: { slug: params.slug }, select: { name: true } })
  if (!tag) return {}
  return { title: `#${tag.name}` }
}

export default async function TagPage({ params }: Props) {
  const tag = await db.tag.findUnique({
    where: { slug: params.slug },
    select: {
      id: true,
      name: true,
      slug: true,
      posts: {
        where: { post: { published: true } },
        orderBy: { post: { createdAt: "desc" } },
        select: {
          post: {
            select: {
              id: true,
              title: true,
              image: true,
              createdAt: true,
              author: { select: { name: true } },
              categories: { select: { category: { select: { name: true, slug: true } } } },
            },
          },
        },
      },
    },
  })

  if (!tag) notFound()

  const posts = tag.posts.map((p) => p.post)

  return (
    <div>
      <div className="border-b bg-card">
        <div className="container px-4 sm:px-6 py-10 lg:py-14">
          <PageEntrance>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-2">Tag</p>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl">#{tag.name}</h1>
            <div className="flex items-center gap-1.5 mt-3">
              <div className="h-0.5 w-10 bg-primary rounded-full" />
              <div className="h-0.5 w-4 bg-primary/40 rounded-full" />
            </div>
            <p className="text-muted-foreground mt-3">{posts.length} bài viết.</p>
          </PageEntrance>
        </div>
      </div>

      <div className="container px-4 sm:px-6 py-8 lg:py-10">
        {posts.length ? (
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const image = post.image as { url?: string; alt?: string } | null
              return (
                <StaggerItem key={post.id} hover>
                  <Link
                    href={`/posts/${post.id}`}
                    className="group flex flex-col overflow-hidden border bg-card hover:shadow-xl transition-shadow duration-300 h-full"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      {image?.url ? (
                        <Image
                          src={image.url}
                          alt={image.alt ?? post.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          placeholder="blur"
                          blurDataURL={BLUR_PLACEHOLDER}
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-muted to-muted-foreground/10" />
                      )}
                    </div>
                    <div className="flex flex-col gap-2.5 p-4 flex-1">
                      {post.categories.length > 0 && (
                        <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                          {post.categories[0].category.name}
                        </span>
                      )}
                      <h2 className="font-heading text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto pt-3 border-t border-border/60">
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
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-muted-foreground">Chưa có bài viết nào với tag này.</p>
            <Link href="/blog" className="mt-4 text-sm text-primary hover:underline">
              Xem tất cả bài viết →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
