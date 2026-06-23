export const dynamic = "force-dynamic"

import Link from "next/link"
import { db } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import {
  PageEntrance,
  FadeUp,
  SlideInLeft,
  StaggerContainer,
  StaggerItem,
  ScaleIn,
} from "@/components/motion-primitives"

export default async function IndexPage() {
  const [featuredPost, posts, categories] = await Promise.all([
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
      take: 7,
    }),
    db.category.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: 6,
      include: { _count: { select: { posts: true } } },
    }),
  ])

  const featured = featuredPost ?? posts[0]
  const others = posts.filter((p) => p.id !== featured?.id).slice(0, 6)
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
      <div className="container px-4 sm:px-6 pt-10 pb-20 lg:pt-14 lg:pb-28 space-y-14">

        {/* ── Hero featured post ─────────────────────────────── */}
        {featured && (() => {
          const image = img(featured.image)
          return (
            <PageEntrance>
              <Link
                href={`/posts/${featured.id}`}
                className="group block relative w-full overflow-hidden rounded-2xl bg-muted"
                style={{ height: "480px" }}
              >
                {image?.url ? (
                  <img
                    src={image.url}
                    alt={image.alt ?? featured.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-muted" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10">
                  <div className="max-w-3xl">
                    {featured.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {featured.categories.map(({ category }) => (
                          <span
                            key={category.slug}
                            className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm text-white px-3 py-0.5 text-xs font-semibold"
                          >
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
                <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
                  <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow">
                    Nổi bật
                  </span>
                </div>
              </Link>
            </PageEntrance>
          )
        })()}

        {/* ── Danh mục nổi bật ───────────────────────────────── */}
        {categories.length > 0 && (
          <section>
            <SlideInLeft>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <h2 className="font-heading text-xl sm:text-2xl">Danh mục</h2>
                  <div className="h-px w-16 bg-border" />
                </div>
                <Link href="/categories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Xem tất cả →
                </Link>
              </div>
            </SlideInLeft>
            <StaggerContainer className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {categories.map((cat) => {
                const catImg = img(cat.image)
                return (
                  <StaggerItem key={cat.id} hover>
                    <Link
                      href={`/categories/${cat.slug}`}
                      className="group flex flex-col items-center gap-2 rounded-xl border bg-card p-4 text-center hover:border-primary/50 hover:shadow-sm transition-colors duration-200 h-full"
                    >
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0">
                        {catImg?.url ? (
                          <img
                            src={catImg.url}
                            alt={cat.name}
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xl">
                            🍽️
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-medium leading-tight line-clamp-2">{cat.name}</span>
                      <span className="text-[10px] text-muted-foreground">{cat._count.posts} bài</span>
                    </Link>
                  </StaggerItem>
                )
              })}
            </StaggerContainer>
          </section>
        )}

        {/* ── Bài viết mới nhất ──────────────────────────────── */}
        {others.length > 0 && (
          <section>
            <SlideInLeft>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <h2 className="font-heading text-xl sm:text-2xl">Bài viết mới nhất</h2>
                  <div className="h-px w-16 bg-border" />
                </div>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Xem tất cả →
                </Link>
              </div>
            </SlideInLeft>
            <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((post) => {
                const image = img(post.image)
                return (
                  <StaggerItem key={post.id} hover>
                    <Link
                      href={`/posts/${post.id}`}
                      className="group flex flex-col rounded-2xl overflow-hidden border bg-card hover:shadow-lg transition-shadow duration-300 h-full"
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
                      <div className="flex flex-col gap-2.5 p-4 flex-1">
                        {post.categories.length > 0 && (
                          <span className="text-xs font-semibold text-primary">
                            {post.categories[0].category.name}
                          </span>
                        )}
                        <h3 className="font-heading text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
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
                  </StaggerItem>
                )
              })}
            </StaggerContainer>
          </section>
        )}

        {/* ── Banner CTA nhà hàng ────────────────────────────── */}
        <ScaleIn>
          <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-primary/5 to-background px-6 py-10 sm:px-10 sm:py-14">
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
              <div className="flex-1 text-center sm:text-left space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">Heo Quay 47</p>
                <h2 className="font-heading text-2xl sm:text-3xl">
                  Hương vị gia truyền,{" "}
                  <br className="hidden sm:block" />
                  đậm đà qua nhiều thế hệ
                </h2>
                <p className="text-sm text-muted-foreground max-w-md">
                  Chuyên heo quay, vịt quay, gà quay — công thức bí truyền, nguyên liệu tươi sạch, phục vụ từ 06:00 đến 20:00 hàng ngày.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Về chúng tôi
                </Link>
                <Link
                  href="/lien-he"
                  className="inline-flex items-center justify-center rounded-full border px-6 py-2.5 text-sm font-semibold hover:bg-muted transition-colors"
                >
                  Liên hệ
                </Link>
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
          </section>
        </ScaleIn>

      </div>
    </div>
  )
}
