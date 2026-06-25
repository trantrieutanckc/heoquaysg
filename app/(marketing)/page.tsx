export const dynamic = "force-dynamic"

import Link from "next/link"
import Image from "next/image"
import { db } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import {
  FadeUp,
  SlideInLeft,
  StaggerContainer,
  StaggerItem,
  ScaleIn,
} from "@/components/motion-primitives"
import { BLUR_PLACEHOLDER } from "@/lib/image"

function SectionDivider() {
  return (
    <div className="flex items-center gap-4 py-1">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/70 to-transparent" />
      <div className="flex items-center gap-1.5">
        <div className="w-1 h-1 rounded-full bg-orange-300 dark:bg-orange-700" />
        <div className="w-1.5 h-1.5 rounded-full bg-orange-400 dark:bg-orange-600" />
        <div className="w-1 h-1 rounded-full bg-orange-300 dark:bg-orange-700" />
      </div>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-border/70 to-transparent" />
    </div>
  )
}

function getExcerpt(content: unknown, maxLength = 160): string {
  if (!content) return ""
  let parsed: { blocks?: { type: string; data: Record<string, string> }[] } = {}
  try {
    parsed = typeof content === "string" ? JSON.parse(content as string) : content as typeof parsed
  } catch {
    return ""
  }
  const para = parsed.blocks?.find((b) => b.type === "paragraph")
  if (!para) return ""
  const text = (para.data.text ?? "").replace(/<[^>]+>/g, "")
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text
}

export default async function IndexPage() {
  const [siteConfigRow, featuredPost, posts, categories] = await Promise.all([
    db.siteConfig.findUnique({ where: { id: "default" } }).catch(() => null),
    db.post.findFirst({
      where: { published: true, featured: true },
      include: {
        author: { select: { name: true, image: true } },
        categories: { include: { category: { select: { name: true, slug: true } } } },
      },
    }),
    db.post.findMany({
      where: { published: true },
      select: {
        id: true, title: true, createdAt: true, image: true, content: true, price: true,
        author: { select: { name: true, image: true } },
        categories: { include: { category: { select: { name: true, slug: true } } } },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    db.category.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: 6,
      include: { _count: { select: { posts: true } } },
    }),
  ])

  const cfg = (siteConfigRow?.data ?? {}) as Record<string, string>
  const heroImage = cfg.heroImage?.trim()
  const siteName = cfg.siteName?.trim() || "Heo Quay 47"
  const siteTagline = cfg.siteTagline?.trim() || "Hương vị gia truyền, đậm đà qua nhiều thế hệ"
  const siteDescription = cfg.siteDescription?.trim() || "Chuyên heo quay, vịt quay, gà quay — công thức bí truyền, nguyên liệu tươi sạch, phục vụ hàng ngày."

  const featured = featuredPost ?? posts[0] ?? null
  const others = posts.filter((p) => p.id !== featured?.id).slice(0, 6)
  const img = (image: unknown) => image as { url?: string; alt?: string } | null

  return (
    <div className="min-h-screen">

      {/* ── Hero Banner ────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden flex items-center" style={{ minHeight: "75vh" }}>
        {heroImage ? (
          <Image
            src={heroImage}
            alt="Hero background"
            fill
            sizes="100vw"
            className="object-cover"
            priority
            placeholder="blur"
            blurDataURL={BLUR_PLACEHOLDER}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-orange-950 to-stone-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        <div className="relative z-10 w-full">
          <div className="container px-4 sm:px-6 py-24 flex flex-col items-center text-center text-white">
            <FadeUp>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-orange-300 mb-5">
                {siteName}
              </p>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold max-w-3xl leading-tight mb-6">
                {siteTagline}
              </h1>
              <p className="text-white/70 text-base sm:text-lg max-w-xl mb-10 leading-relaxed">
                {siteDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 hover:bg-orange-400 text-white px-10 py-4 text-base font-semibold transition-colors shadow-xl shadow-orange-500/30"
                >
                  Xem công thức
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
                <Link
                  href="/lien-he"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/50 hover:bg-white/15 text-white px-10 py-4 text-base font-semibold transition-colors backdrop-blur-sm"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.98-1.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  Đặt hàng ngay
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <div className="container px-4 sm:px-6 pt-14 pb-20 lg:pt-16 lg:pb-28 space-y-16">

        {/* ── Bài viết nổi bật ───────────────────────────────── */}
        {featured && (() => {
          const image = img(featured.image)
          const excerpt = getExcerpt((featured as any).content)
          return (
            <ScaleIn>
              <section>
                <SlideInLeft>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="inline-flex items-center rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-3 py-0.5 text-xs font-bold uppercase tracking-wide">
                      Nổi bật
                    </span>
                    <h2 className="font-heading text-xl sm:text-2xl">Bài viết nổi bật</h2>
                    <div className="h-px flex-1 bg-border hidden sm:block" />
                  </div>
                </SlideInLeft>

                <Link
                  href={`/posts/${featured.id}`}
                  className="group grid md:grid-cols-[45%_55%] overflow-hidden rounded-2xl border bg-card hover:shadow-xl transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden bg-muted min-h-[220px]">
                    {image?.url ? (
                      <Image
                        src={image.url}
                        alt={image.alt ?? featured.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 45vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        placeholder="blur"
                        blurDataURL={BLUR_PLACEHOLDER}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-950 dark:to-stone-900" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-center gap-4 p-6 lg:p-10">
                    {featured.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {featured.categories.map(({ category }) => (
                          <span
                            key={category.slug}
                            className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-0.5 text-xs font-semibold"
                          >
                            {category.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <h2 className="font-heading text-2xl lg:text-3xl leading-snug group-hover:text-primary transition-colors">
                      {featured.title}
                    </h2>
                    {excerpt && (
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                        {excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {featured.author?.image ? (
                        <img src={featured.author.image} alt="" className="h-7 w-7 rounded-full object-cover ring-2 ring-border" />
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                          {featured.author?.name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                      )}
                      <span className="font-medium">{featured.author?.name}</span>
                      <span>·</span>
                      <time dateTime={featured.createdAt.toISOString()}>{formatDate(featured.createdAt.toISOString())}</time>
                    </div>
                    <div>
                      <span className="inline-flex items-center rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-semibold group-hover:bg-primary/90 transition-colors">
                        Đọc bài viết →
                      </span>
                    </div>
                  </div>
                </Link>
              </section>
            </ScaleIn>
          )
        })()}

        <SectionDivider />

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
            <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {categories.map((cat) => {
                const catImg = img(cat.image)
                return (
                  <StaggerItem key={cat.id} hover>
                    <Link
                      href={`/categories/${cat.slug}`}
                      className="group flex flex-col items-center gap-2 rounded-xl border bg-card p-4 text-center hover:border-primary/50 hover:shadow-sm transition-colors duration-200 h-full"
                    >
                      <div className="relative w-14 h-14 rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0">
                        {catImg?.url ? (
                          <Image
                            src={catImg.url}
                            alt={cat.name}
                            fill
                            sizes="56px"
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            placeholder="blur"
                            blurDataURL={BLUR_PLACEHOLDER}
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

        <SectionDivider />

        {/* ── Về chúng tôi ──────────────────────────────────── */}
        <FadeUp>
          <section className="rounded-2xl overflow-hidden border border-orange-100 dark:border-orange-900/30 bg-orange-50 dark:bg-orange-950/20">
            <div className="grid md:grid-cols-2 items-stretch">
              <div className="flex flex-col justify-center gap-5 p-8 lg:p-12 order-2 md:order-1">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-2">Câu chuyện của chúng tôi</p>
                  <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl leading-tight">{siteName}</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">{siteDescription}</p>
                <div className="flex flex-col gap-2 text-sm">
                  {cfg.contactAddress && (
                    <div className="flex items-start gap-2">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 mt-0.5 text-orange-500" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                      <span>{cfg.contactAddress}</span>
                    </div>
                  )}
                  {cfg.businessHours && (
                    <div className="flex items-start gap-2">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 mt-0.5 text-orange-500" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      <span>{cfg.businessHours}</span>
                    </div>
                  )}
                  {cfg.contactPhone && (
                    <div className="flex items-start gap-2">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 mt-0.5 text-orange-500" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.98-1.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      <a href={`tel:${cfg.contactPhone}`} className="hover:text-primary transition-colors">{cfg.contactPhone}</a>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 pt-1">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 text-sm font-semibold transition-colors"
                  >
                    Về chúng tôi →
                  </Link>
                  <Link
                    href="/lien-he"
                    className="inline-flex items-center gap-2 rounded-full border-2 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-950/50 px-6 py-2.5 text-sm font-semibold transition-colors"
                  >
                    Liên hệ đặt hàng
                  </Link>
                </div>
              </div>
              <div className="relative aspect-[4/3] md:aspect-auto min-h-[260px] overflow-hidden order-1 md:order-2">
                {heroImage ? (
                  <Image
                    src={heroImage}
                    alt={siteName}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={BLUR_PLACEHOLDER}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-200 via-amber-100 to-orange-300 dark:from-orange-900 dark:via-amber-950 dark:to-orange-800 flex items-center justify-center">
                    <span className="text-8xl drop-shadow-sm select-none">🐷</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        </FadeUp>

        <SectionDivider />

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
                      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
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
                          <span className="text-xs font-semibold text-primary">
                            {post.categories[0].category.name}
                          </span>
                        )}
                        <h3 className="font-heading text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
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

        {posts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <p className="text-lg font-medium mb-2">Chưa có bài viết nào</p>
            <p className="text-sm text-muted-foreground">Hãy tạo bài viết đầu tiên trong dashboard.</p>
          </div>
        )}

      </div>
    </div>
  )
}
