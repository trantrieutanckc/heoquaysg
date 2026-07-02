import React from "react"
import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import {
  FadeUp,
  SlideInLeft,
  StaggerContainer,
  StaggerItem,
  ScaleIn,
} from "@/components/motion-primitives"
import { BLUR_PLACEHOLDER } from "@/lib/image"
import { StarDisplay } from "@/components/star-display"

// ── Shared helpers ──────────────────────────────────────────────────

export function SectionTitle({ label, title, right }: { label?: string; title: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between mb-8 gap-4">
      <div>
        {label && (
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-1.5">{label}</p>
        )}
        <h2 className="font-heading text-2xl sm:text-3xl">{title}</h2>
        <div className="flex items-center gap-1.5 mt-2.5">
          <div className="h-0.5 w-10 bg-primary rounded-full" />
          <div className="h-0.5 w-4 bg-primary/40 rounded-full" />
          <div className="h-0.5 w-2 bg-primary/20 rounded-full" />
        </div>
      </div>
      {right && <div className="shrink-0 pb-1">{right}</div>}
    </div>
  )
}

export function getExcerpt(content: unknown, maxLength = 160): string {
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

export const img = (image: unknown) => image as { url?: string; alt?: string } | null

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

const ArrowRightSm = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

// ── Section: Hero Banner ─────────────────────────────────────────────

interface HeroProps {
  heroImage?: string
  siteName: string
  siteTagline: string
  siteDescription: string
}

export function HeroSection({ heroImage, siteName, siteTagline, siteDescription }: HeroProps) {
  return (
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
        <div className="container px-4 sm:px-6 py-28 flex flex-col items-center text-center text-white">
          <FadeUp className="w-full flex flex-col items-center">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-10 bg-orange-300/60" />
              <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.3em] text-orange-200">{siteName}</p>
              <div className="h-px w-10 bg-orange-300/60" />
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold max-w-3xl leading-tight mb-6 italic">
              {siteTagline}
            </h1>
            <div className="flex items-center justify-center gap-2 mb-7">
              <div className="h-px w-8 bg-orange-400/60" />
              <svg viewBox="0 0 16 16" className="w-2.5 h-2.5 text-orange-400/70 shrink-0" fill="currentColor">
                <path d="M8 0 L9.5 6.5 L16 8 L9.5 9.5 L8 16 L6.5 9.5 L0 8 L6.5 6.5 Z" />
              </svg>
              <div className="h-px w-8 bg-orange-400/60" />
            </div>
            <p className="font-heading text-white/70 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed text-center italic">
              {siteDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-3.5 text-sm font-semibold transition-colors shadow-xl shadow-primary/30 uppercase tracking-wider"
              >
                Xem thực đơn
                <ArrowRight />
              </Link>
              <Link
                href="/dat-lich"
                className="inline-flex items-center justify-center gap-2 border border-white/50 hover:bg-white/10 text-white px-10 py-3.5 text-sm font-semibold transition-colors backdrop-blur-sm uppercase tracking-wider"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Đặt lịch ngay
              </Link>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}

// ── Section: Featured Post ──────────────────────────────────────────

interface FeaturedPost {
  id: string
  title: string
  createdAt: Date
  image: unknown
  content: unknown
  price: number | null
  avgRating: number | null
  ratingCount: number
  author: { name: string | null; image: string | null } | null
  categories: { category: { name: string; slug: string } }[]
}

interface FeaturedSectionProps {
  post: FeaturedPost
  bgStyle?: React.CSSProperties
  label?: string
  title?: string
}

export function FeaturedSection({ post, bgStyle, label, title }: FeaturedSectionProps) {
  const image = img(post.image)
  const excerpt = getExcerpt(post.content)

  return (
    <section className="py-14 lg:py-20" style={{ backgroundColor: "var(--background)", ...bgStyle }}>
      <div className="container px-4 sm:px-6">
        <ScaleIn>
          <SlideInLeft>
            <SectionTitle label={label || "Nổi bật"} title={title || "Bài viết nổi bật"} />
          </SlideInLeft>
          <Link
            href={`/posts/${post.id}`}
            className="group grid md:grid-cols-[45%_55%] overflow-hidden border bg-card hover:shadow-2xl transition-all duration-300"
          >
            <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden bg-muted min-h-[220px]">
              {image?.url ? (
                <Image
                  src={image.url}
                  alt={image.alt ?? post.title}
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
            <div className="flex flex-col justify-center gap-4 p-6 lg:p-10">
              {post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.categories.map(({ category }) => (
                    <span key={category.slug} className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-0.5 text-xs font-semibold">
                      {category.name}
                    </span>
                  ))}
                </div>
              )}
              <h2 className="font-heading text-2xl lg:text-3xl leading-snug group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              {excerpt && (
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{excerpt}</p>
              )}
              {post.avgRating != null && post.ratingCount > 0 && (
                <StarDisplay rating={post.avgRating} size="md" showNumber count={post.ratingCount} />
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {post.author?.image ? (
                  <img src={post.author.image} alt="" className="h-7 w-7 rounded-full object-cover ring-2 ring-border" />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                    {post.author?.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                )}
                <span className="font-medium">{post.author?.name}</span>
                <span>·</span>
                <time dateTime={post.createdAt.toISOString()}>{formatDate(post.createdAt.toISOString())}</time>
              </div>
              <div>
                <span className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 text-xs font-bold uppercase tracking-wider group-hover:bg-primary/90 transition-colors">
                  Xem chi tiết
                  <ArrowRightSm />
                </span>
              </div>
            </div>
          </Link>
        </ScaleIn>
      </div>
    </section>
  )
}

// ── Section: Categories ─────────────────────────────────────────────

interface CategoryItem {
  id: string
  name: string
  slug: string
  image: unknown
  _count: { posts: number }
}

interface CategoriesSectionProps {
  categories: CategoryItem[]
  showViewAll?: boolean
  bgStyle?: React.CSSProperties
  label?: string
  title?: string
}

export function CategoriesSection({ categories, showViewAll, bgStyle, label, title }: CategoriesSectionProps) {
  return (
    <section className="py-14 lg:py-20 border-y border-border/40" style={{ backgroundColor: "#f8f7f5", ...bgStyle }}>
      <div className="container px-4 sm:px-6">
        <SlideInLeft>
          <SectionTitle
            label={label || "Thực đơn"}
            title={title || "Danh mục món"}
            right={
              showViewAll ? (
                <Link href="/categories" className="text-xs font-semibold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5">
                  Xem tất cả
                  <ArrowRightSm />
                </Link>
              ) : undefined
            }
          />
        </SlideInLeft>
        <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const catImg = img(cat.image)
            return (
              <StaggerItem key={cat.id} hover>
                <Link
                  href={`/categories/${cat.slug}`}
                  className="group flex flex-col overflow-hidden border bg-card hover:shadow-lg transition-all duration-300 h-full"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {catImg?.url ? (
                      <Image
                        src={catImg.url}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        placeholder="blur"
                        blurDataURL={BLUR_PLACEHOLDER}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/15 to-amber-50 dark:from-primary/20 dark:to-primary/5 flex items-center justify-center text-3xl">
                        🍽️
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-3 text-center border-t">
                    <span className="text-sm font-semibold leading-tight line-clamp-1 font-heading">{cat.name}</span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{cat._count.posts} món</p>
                  </div>
                </Link>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </div>
    </section>
  )
}

// ── Section: About ──────────────────────────────────────────────────

interface AboutSectionProps {
  siteName: string
  siteDescription: string
  heroImage?: string
  contactAddress?: string
  businessHours?: string
  contactPhone?: string
  label?: string
  bgStyle?: React.CSSProperties
  aboutContentHtml?: string | null
}

export function AboutSection({ siteName, siteDescription, heroImage, contactAddress, businessHours, contactPhone, label, bgStyle, aboutContentHtml }: AboutSectionProps) {
  return (
    <section className="py-14 lg:py-20 border-b border-border/40" style={{ backgroundColor: "#fdf8f0", ...bgStyle }}>
      <div className="container px-4 sm:px-6">
        <FadeUp>
          <div className="overflow-hidden border border-border/60 bg-card/80">
            <div className="grid md:grid-cols-2 items-stretch">
              <div className="flex flex-col justify-center gap-5 p-8 lg:p-12 order-2 md:order-1">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-2">{label || "Câu chuyện của chúng tôi"}</p>
                  <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl leading-tight italic">{siteName}</h2>
                  <div className="flex items-center gap-1.5 mt-3">
                    <div className="h-0.5 w-10 bg-primary rounded-full" />
                    <div className="h-0.5 w-4 bg-primary/40 rounded-full" />
                  </div>
                </div>
                {aboutContentHtml ? (
                  <div
                    className="prose prose-sm max-w-none text-muted-foreground [&_a]:text-primary [&_a]:underline"
                    dangerouslySetInnerHTML={{ __html: aboutContentHtml }}
                  />
                ) : (
                  <p className="text-muted-foreground leading-relaxed">{siteDescription}</p>
                )}
                <div className="flex flex-col gap-2 text-sm">
                  {contactAddress && (
                    <div className="flex items-start gap-2">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 mt-0.5 text-primary/70" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                      <span>{contactAddress}</span>
                    </div>
                  )}
                  {businessHours && (
                    <div className="flex items-start gap-2">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 mt-0.5 text-primary/70" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      <span>{businessHours}</span>
                    </div>
                  )}
                  {contactPhone && (
                    <div className="flex items-start gap-2">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 mt-0.5 text-primary/70" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.98-1.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      <a href={`tel:${contactPhone}`} className="hover:text-primary transition-colors">{contactPhone}</a>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 pt-1">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Về chúng tôi
                    <ArrowRightSm />
                  </Link>
                  <Link
                    href="/lien-he"
                    className="inline-flex items-center gap-2 border border-border hover:bg-muted text-foreground px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors"
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
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ── Section: Latest Posts ───────────────────────────────────────────

interface PostItem {
  id: string
  title: string
  createdAt: Date
  image: unknown
  price: number | null
  avgRating: number | null
  ratingCount: number
  author: { name: string | null; image: string | null } | null
  categories: { category: { name: string; slug: string } }[]
}

interface LatestPostsSectionProps {
  posts: PostItem[]
  bgStyle?: React.CSSProperties
  label?: string
  title?: string
}

export function LatestPostsSection({ posts, bgStyle, label, title }: LatestPostsSectionProps) {
  if (posts.length === 0) return null

  return (
    <section className="py-14 lg:py-20" style={{ backgroundColor: "var(--background)", ...bgStyle }}>
      <div className="container px-4 sm:px-6">
        <SlideInLeft>
          <SectionTitle
            label={label || "Khám phá"}
            title={title || "Bài viết mới nhất"}
            right={
              <Link href="/blog" className="text-xs font-semibold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5">
                Xem tất cả
                <ArrowRightSm />
              </Link>
            }
          />
        </SlideInLeft>
        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const image = img(post.image)
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
                  <div className="flex flex-col gap-2.5 p-5 flex-1">
                    {post.categories.length > 0 && (
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                        {post.categories[0].category.name}
                      </span>
                    )}
                    <h3 className="font-heading text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    {post.price != null && (
                      <span className="inline-flex items-center bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-bold w-fit">
                        {new Intl.NumberFormat("vi-VN").format(post.price)} đ
                      </span>
                    )}
                    {post.avgRating != null && post.ratingCount > 0 && (
                      <StarDisplay rating={post.avgRating} size="sm" showNumber count={post.ratingCount} />
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto pt-3 border-t border-border/60">
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
      </div>
    </section>
  )
}

// ── Section: Booking CTA ────────────────────────────────────────────

export function BookingCtaSection({
  bgStyle,
  label,
  title,
  desc,
}: {
  bgStyle?: React.CSSProperties
  label?: string
  title?: string
  desc?: string
}) {
  return (
    <section
      className="py-16 lg:py-24 relative overflow-hidden"
      style={bgStyle ?? undefined}
    >
      {/* Fallback gradient khi không có background tùy chỉnh */}
      {!bgStyle && <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500" aria-hidden />}
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" aria-hidden>
        <svg width="100%" height="100%">
          <pattern id="booking-dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="white" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#booking-dots)" />
        </svg>
      </div>

      <div className="relative z-10 container px-4 sm:px-6">
        <FadeUp className="flex flex-col items-center text-center text-white">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/70 mb-3">{label || "Giao hàng tận nơi"}</p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            {title || "Đặt lịch ngay hôm nay"}
          </h2>
          <p className="text-white/80 text-base sm:text-lg max-w-xl mb-8 leading-relaxed">
            {desc || "Chọn món, chọn ngày giao — chúng tôi chuẩn bị tươi và giao đến tận tay bạn."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dat-lich"
              className="inline-flex items-center justify-center gap-2.5 bg-white text-orange-600 hover:bg-orange-50 px-10 py-4 text-sm font-bold uppercase tracking-wider transition-colors shadow-xl"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Đặt lịch ngay
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-2 border border-white/50 hover:bg-white/10 text-white px-10 py-4 text-sm font-semibold uppercase tracking-wider transition-colors"
            >
              Xem thực đơn
              <ArrowRight />
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ── Section: Map ────────────────────────────────────────────────────

interface MapSectionProps {
  contactAddress: string
  businessHours?: string
  contactPhone?: string
  bgStyle?: React.CSSProperties
}

export function MapSection({ contactAddress, businessHours, contactPhone, bgStyle }: MapSectionProps) {
  return (
    <section className="py-14 lg:py-20 border-t border-border/40" style={{ backgroundColor: "#f8f7f5", ...bgStyle }}>
      <div className="container px-4 sm:px-6">
        <FadeUp>
          <div className="grid md:grid-cols-2 border overflow-hidden bg-card">
            <div className="flex flex-col justify-center gap-6 p-8 sm:p-10 order-2 md:order-1">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-1.5">Đến thăm chúng tôi</p>
                <h2 className="font-heading text-2xl sm:text-3xl">Tìm chúng tôi</h2>
                <div className="flex items-center gap-1.5 mt-2.5">
                  <div className="h-0.5 w-10 bg-primary rounded-full" />
                  <div className="h-0.5 w-4 bg-primary/40 rounded-full" />
                  <div className="h-0.5 w-2 bg-primary/20 rounded-full" />
                </div>
              </div>
              <div className="flex flex-col gap-4 text-sm text-muted-foreground">
                <div className="flex gap-3">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 mt-0.5 text-primary/70" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                    <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/>
                  </svg>
                  <div>
                    <p className="font-medium text-foreground mb-0.5">Địa chỉ</p>
                    <p>{contactAddress}</p>
                  </div>
                </div>
                {businessHours && (
                  <div className="flex gap-3">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 mt-0.5 text-primary/70" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <div>
                      <p className="font-medium text-foreground mb-0.5">Giờ mở cửa</p>
                      <p>{businessHours}</p>
                    </div>
                  </div>
                )}
                {contactPhone && (
                  <div className="flex gap-3">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 mt-0.5 text-primary/70" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"/>
                    </svg>
                    <div>
                      <p className="font-medium text-foreground mb-0.5">Điện thoại</p>
                      <a href={`tel:${contactPhone.replace(/\s/g, "")}`} className="hover:text-primary transition-colors">{contactPhone}</a>
                    </div>
                  </div>
                )}
              </div>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(contactAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors w-fit"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                  <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/>
                </svg>
                Chỉ đường
              </a>
            </div>
            <div className="relative h-[300px] md:h-full min-h-[380px] order-1 md:order-2">
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(contactAddress)}&output=embed`}
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bản đồ"
              />
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ── Section: Thực đơn ───────────────────────────────────────────────

interface DishItem {
  id: string
  name: string
  description: string | null
  price: number
  unit: string
  available: boolean
  image: string | null
}

interface DishGroupItem {
  id: string
  name: string
  dishes: DishItem[]
}

interface ThucDonSectionProps {
  groups: DishGroupItem[]
  bgStyle?: React.CSSProperties
}

function formatPrice(p: number) {
  return p.toLocaleString("vi-VN") + "đ"
}

export function ThucDonSection({ groups, bgStyle }: ThucDonSectionProps) {
  const visibleGroups = groups.filter((g) => g.dishes.length > 0)
  if (visibleGroups.length === 0) return null

  return (
    <section className="py-14 lg:py-20 border-y border-border/40" style={{ backgroundColor: "#f8f7f5", ...bgStyle }}>
      <div className="container px-4 sm:px-6">
        <SlideInLeft>
          <SectionTitle
            label="Thực đơn & Bảng giá"
            title="Các món chúng tôi cung cấp"
            right={
              <Link href="/thuc-don" className="text-xs font-semibold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5">
                Xem đầy đủ
                <ArrowRightSm />
              </Link>
            }
          />
        </SlideInLeft>

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleGroups.map((group) => {
            const preview = group.dishes.slice(0, 3)
            const remaining = group.dishes.length - preview.length
            return (
              <StaggerItem key={group.id} hover>
                <Link
                  href="/thuc-don"
                  className="group flex flex-col h-full border bg-card hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Header */}
                  <div className="flex items-center gap-3 px-5 py-4 border-b bg-primary/5">
                    <div className="w-1 h-5 rounded-full bg-primary shrink-0" />
                    <h3 className="font-heading font-bold text-base">{group.name}</h3>
                    <span className="ml-auto text-xs text-muted-foreground">{group.dishes.length} món</span>
                  </div>

                  {/* Dish preview */}
                  <div className="flex-1 divide-y">
                    {preview.map((dish) => (
                      <div key={dish.id} className={`flex items-center justify-between px-5 py-3 gap-3${!dish.available ? " opacity-40" : ""}`}>
                        <span className="text-sm truncate">{dish.name}</span>
                        <span className="text-sm font-bold text-primary shrink-0">{formatPrice(dish.price)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="px-5 py-3 border-t bg-muted/30 flex items-center justify-between">
                    {remaining > 0 ? (
                      <span className="text-xs text-muted-foreground">+{remaining} món khác</span>
                    ) : (
                      <span />
                    )}
                    <span className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                      Xem thêm <ArrowRightSm />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            )
          })}
        </StaggerContainer>

        {/* CTA */}
        <FadeUp className="mt-10 text-center">
          <Link
            href="/thuc-don"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-sm font-bold uppercase tracking-wider transition-colors"
          >
            Xem thực đơn & bảng giá đầy đủ
            <ArrowRightSm />
          </Link>
        </FadeUp>
      </div>
    </section>
  )
}
