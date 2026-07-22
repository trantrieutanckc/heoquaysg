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
import { postUrl } from "@/lib/post-url"

// ── Shared helpers ──────────────────────────────────────────────────

export function SectionTitle({ label, title, right, light }: { label?: string; title: string; right?: React.ReactNode; light?: boolean }) {
  return (
    <div className="flex items-end justify-between mb-8 gap-4">
      <div>
        {label && (
          <p className={`text-xs font-bold uppercase tracking-[0.25em] mb-2 ${light ? "text-orange-200" : "text-primary"}`}>{label}</p>
        )}
        <h2 className={`font-heading text-2xl sm:text-3xl ${light ? "text-white" : ""}`}>{title}</h2>
        <div className="flex items-center gap-1.5 mt-2.5">
          <div className={`h-1 w-10 rounded-full ${light ? "bg-orange-400" : "bg-primary"}`} />
          <div className={`h-1 w-5 rounded-full ${light ? "bg-orange-300/40" : "bg-primary/40"}`} />
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
  <span className="transition-transform duration-200 group-hover:translate-x-1.5 shrink-0">
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  </span>
)

const ArrowRightSm = () => (
  <span className="transition-transform duration-200 group-hover:translate-x-1 shrink-0">
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  </span>
)

// ── Section: Hero Banner ─────────────────────────────────────────────

interface HeroProps {
  heroImage?: string
  siteName: string
  siteTagline: string
  siteDescription: string
  contactPhone?: string
}

export function HeroSection({ heroImage, siteName, siteTagline, siteDescription, contactPhone }: HeroProps) {
  return (
    <section className="relative w-full overflow-hidden flex items-center" style={{ minHeight: "80vh" }}>
      {heroImage ? (
        <Image src={heroImage} alt="Hero background" fill sizes="100vw" className="object-cover" priority placeholder="blur" blurDataURL={BLUR_PLACEHOLDER} />
      ) : (
        <Image
          src="/heo-quay-img.png"
          alt="Heo Quay Bình Tân"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/15" />
      {/* dot pattern */}
      <div className="absolute inset-0 opacity-[0.07]" aria-hidden>
        <svg width="100%" height="100%"><pattern id="hero-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="white"/></pattern><rect width="100%" height="100%" fill="url(#hero-dots)"/></svg>
      </div>

      <div className="relative z-10 w-full">
        <div className="container px-4 sm:px-6 py-32 flex flex-col items-center text-center text-white">
          <FadeUp className="w-full flex flex-col items-center">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-12 bg-orange-300/60" />
              <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-orange-200">{siteName}</p>
              <div className="h-px w-12 bg-orange-300/60" />
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold max-w-4xl leading-tight mb-6 drop-shadow-lg">
              {siteTagline}
            </h1>
            <div className="flex items-center justify-center gap-3 mb-7">
              <div className="h-px w-10 bg-orange-400/50" />
              <div className="h-2 w-2 rounded-full bg-primary" />
              <div className="h-px w-10 bg-orange-400/50" />
            </div>
            <p className="text-white/75 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">{siteDescription}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/blog" className="group inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-4 text-sm font-bold transition-colors shadow-2xl shadow-primary/40 uppercase tracking-wider">
                Xem thực đơn <ArrowRight />
              </Link>
              {contactPhone && (
                <a href={`tel:${contactPhone}`} className="group inline-flex items-center justify-center gap-2 border-2 border-white/40 hover:bg-white/10 text-white px-10 py-4 text-sm font-bold transition-colors backdrop-blur-sm uppercase tracking-wider">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.98-1.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  Đặt lịch ngay
                </a>
              )}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}

// ── Section: Featured Post ──────────────────────────────────────────

interface FeaturedPost {
  id: string; slug?: string | null; title: string; createdAt: Date; image: unknown; content: unknown
  avgRating: number | null; ratingCount: number
  author: { name: string | null; image: string | null } | null
  categories: { category: { name: string; slug: string } }[]
}

interface FeaturedSectionProps {
  post: FeaturedPost; bgStyle?: React.CSSProperties; label?: string; title?: string; useSlugs?: boolean
}

export function FeaturedSection({ post, bgStyle, label, title, useSlugs = false }: FeaturedSectionProps) {
  const image = img(post.image)
  const excerpt = getExcerpt(post.content)

  return (
    <section className="py-14 lg:py-20 relative overflow-hidden" style={{ backgroundColor: "#1c1917", ...bgStyle }}>
      {/* bg decoration — chỉ hiện khi chưa set custom bg */}
      {!bgStyle?.backgroundColor && !bgStyle?.backgroundImage && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-orange-950/60 to-stone-900" />
          <div className="absolute inset-0 opacity-[0.06]" aria-hidden>
            <svg width="100%" height="100%"><pattern id="feat-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="white"/></pattern><rect width="100%" height="100%" fill="url(#feat-dots)"/></svg>
          </div>
        </>
      )}
      <div className="relative z-10 container px-4 sm:px-6">
        <ScaleIn>
          <SlideInLeft>
            <SectionTitle label={label || "Nổi bật"} title={title || "Sản phẩm nổi bật"} light={!bgStyle?.backgroundColor && !bgStyle?.backgroundImage} />
          </SlideInLeft>
          <Link
            href={postUrl(post, useSlugs)}
            className="group grid md:grid-cols-[48%_52%] overflow-hidden rounded-2xl shadow-2xl hover:shadow-primary/20 transition-all duration-500 bg-card"
          >
            <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden bg-muted min-h-[240px]">
              {image?.url ? (
                <Image src={image.url} alt={image.alt ?? post.title} fill priority sizes="(max-width: 768px) 100vw, 48vw" className="object-cover transition-transform duration-700 group-hover:scale-105" placeholder="blur" blurDataURL={BLUR_PLACEHOLDER} />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-amber-100" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider shadow-lg rounded-full">
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  Nổi bật
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-5 p-7 lg:p-10">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-2">
                  {post.categories.map(({ category }) => (
                    <span key={category.slug} className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-0.5 text-xs font-semibold">{category.name}</span>
                  ))}
                </div>
                <time className="text-xs text-muted-foreground">{formatDate(post.createdAt.toISOString())}</time>
              </div>
              <h2 className="font-heading text-2xl lg:text-3xl leading-snug group-hover:text-primary transition-colors">{post.title}</h2>
              {excerpt && <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{excerpt}</p>}
              {post.avgRating != null && post.ratingCount > 0 && (
                <StarDisplay rating={post.avgRating} size="md" showNumber count={post.ratingCount} />
              )}
              <div>
                <span className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3 text-xs font-bold uppercase tracking-wider group-hover:bg-primary/90 transition-colors rounded-full shadow-lg shadow-primary/30">
                  Xem chi tiết <ArrowRightSm />
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
  id: string; name: string; slug: string; image: unknown; _count: { posts: number }
}

interface CategoriesSectionProps {
  categories: CategoryItem[]; showViewAll?: boolean; bgStyle?: React.CSSProperties; label?: string; title?: string
}

export function CategoriesSection({ categories, showViewAll, bgStyle, label, title }: CategoriesSectionProps) {
  return (
    <section className="py-14 lg:py-20" style={{ background: "linear-gradient(135deg, #fff8f0 0%, #fef3e2 50%, #fff8f0 100%)", ...bgStyle }}>
      <div className="container px-4 sm:px-6">
        <SlideInLeft>
          <SectionTitle
            label={label || "Thực đơn"}
            title={title || "Danh mục món"}
            right={
              showViewAll ? (
                <Link href="/categories" className="group text-xs font-semibold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5">
                  Xem tất cả <ArrowRightSm />
                </Link>
              ) : undefined
            }
          />
        </SlideInLeft>
        <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const catImg = img(cat.image)
            return (
              <StaggerItem key={cat.id} hover>
                <Link href={`/categories/${cat.slug}`} className="group relative flex overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 h-full aspect-[3/4]">
                  {catImg?.url ? (
                    <Image src={catImg.url} alt={cat.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw" className="object-cover group-hover:scale-110 transition-transform duration-500" placeholder="blur" blurDataURL={BLUR_PLACEHOLDER} />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-4xl">🍽️</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white font-heading font-bold text-sm leading-tight line-clamp-2">{cat.name}</p>
                    <p className="text-white/65 text-[10px] mt-0.5">{cat._count.posts} món</p>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg">
                      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
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

// ── Section: About ──────────────────────────────────────────────────

interface AboutSectionProps {
  siteName: string; siteDescription: string; aboutImage?: string
  contactAddress?: string; contactPhone?: string; label?: string
  bgStyle?: React.CSSProperties; aboutContentHtml?: string | null
}

export function AboutSection({ siteName, siteDescription, aboutImage, contactAddress, contactPhone, label, bgStyle, aboutContentHtml }: AboutSectionProps) {
  return (
    <section className="py-14 lg:py-20 relative overflow-hidden" style={{ backgroundColor: "#fff8f0", ...bgStyle }}>
      {!bgStyle?.backgroundColor && !bgStyle?.backgroundImage && (
        <div className="absolute inset-0 opacity-[0.04]" aria-hidden>
          <svg width="100%" height="100%"><pattern id="about-dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="#ea580c"/></pattern><rect width="100%" height="100%" fill="url(#about-dots)"/></svg>
        </div>
      )}
      <div className="relative z-10 container px-4 sm:px-6">
        <FadeUp>
          <div className="grid md:grid-cols-2 items-stretch rounded-2xl overflow-hidden shadow-xl border border-orange-100">
            {/* Image */}
            <div className="relative aspect-[4/3] md:aspect-auto min-h-[280px] overflow-hidden order-1 md:order-2">
              {aboutImage ? (
                <Image src={aboutImage} alt={siteName} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" placeholder="blur" blurDataURL={BLUR_PLACEHOLDER} />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-orange-300 via-amber-200 to-orange-400 flex items-center justify-center">
                  <span className="text-8xl drop-shadow-sm select-none">🐷</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/10" />
            </div>
            {/* Content */}
            <div className="flex flex-col justify-center gap-5 p-8 lg:p-12 bg-white order-2 md:order-1">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-2">{label || "Câu chuyện của chúng tôi"}</p>
                <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl leading-tight">{siteName}</h2>
                <div className="flex items-center gap-1.5 mt-3">
                  <div className="h-1 w-10 bg-primary rounded-full" />
                  <div className="h-1 w-5 bg-primary/30 rounded-full" />
                </div>
              </div>
              {aboutContentHtml ? (
                <div className="prose prose-sm max-w-none text-muted-foreground [&_a]:text-primary [&_a]:underline" dangerouslySetInnerHTML={{ __html: aboutContentHtml }} />
              ) : (
                <p className="text-muted-foreground leading-relaxed">{siteDescription}</p>
              )}
              <div className="flex flex-col gap-2 text-sm">
                {contactAddress && (
                  <div className="flex items-start gap-2.5 text-muted-foreground">
                    <div className="h-7 w-7 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-primary" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <span className="pt-0.5">{contactAddress}</span>
                  </div>
                )}
                {contactPhone && (
                  <div className="flex items-start gap-2.5 text-muted-foreground">
                    <div className="h-7 w-7 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-primary" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.98-1.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </div>
                    <a href={`tel:${contactPhone}`} className="pt-0.5 hover:text-primary transition-colors">{contactPhone}</a>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <Link href="/about" className="group inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors rounded-full shadow-md shadow-primary/30">
                  Về chúng tôi <ArrowRightSm />
                </Link>
                {contactPhone && (
                  <a href={`tel:${contactPhone}`} className="inline-flex items-center gap-2 border-2 border-primary/30 hover:border-primary text-primary hover:bg-primary/5 px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors rounded-full">
                    Liên hệ đặt hàng
                  </a>
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

export type { }

interface PostItem {
  id: string; slug?: string | null; title: string; createdAt: Date; image: unknown; content: unknown
  avgRating: number | null; ratingCount: number; seoDescription?: string | null
  author: { name: string | null; image: string | null } | null
  categories: { category: { name: string; slug: string } }[]
}

interface LatestPostsSectionProps {
  posts: PostItem[]; bgStyle?: React.CSSProperties; label?: string; title?: string; maxShow?: number; useSlugs?: boolean
}

export function LatestPostsSection({ posts, bgStyle, label, title, maxShow = 6, useSlugs = false }: LatestPostsSectionProps) {
  const visible = posts.slice(0, maxShow)
  if (visible.length === 0) return null

  return (
    <section className="py-14 lg:py-20" style={{ backgroundColor: "var(--background)", ...bgStyle }}>
      <div className="container px-4 sm:px-6">
        <SlideInLeft>
          <SectionTitle
            label={label || "Khám phá"}
            title={title || "Sản phẩm mới nhất"}
            right={
              <Link href="/blog" className="group text-xs font-semibold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5">
                Xem tất cả <ArrowRightSm />
              </Link>
            }
          />
        </SlideInLeft>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {visible.map((post, index) => {
            const image = post.image as { url?: string; alt?: string } | null
            const excerpt = (post.seoDescription || getExcerpt(post.content, 100))?.replace(/\n+/g, " ").trim()
            const isFeatured = index === 0
            return (
              <StaggerItem key={post.id} hover className={isFeatured ? "sm:col-span-2 lg:col-span-1" : ""}>
                <Link href={postUrl(post, useSlugs)} className="group flex flex-row sm:flex-col overflow-hidden rounded-xl border bg-card hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 h-full">
                  <div className="shrink-0 relative bg-muted overflow-hidden w-40 sm:w-full sm:aspect-[4/3]" style={{ minHeight: "7rem" }}>
                    {image?.url ? (
                      <Image src={image.url} alt={image.alt ?? post.title} fill sizes="(max-width: 640px) 160px, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" placeholder="blur" blurDataURL={BLUR_PLACEHOLDER} />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-orange-100 to-amber-50" />
                    )}
                    {isFeatured && (
                      <div className="absolute top-3 left-3 hidden sm:block">
                        <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full shadow">
                          ⭐ Nổi bật
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex flex-col p-3 sm:p-4 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between gap-2">
                        {post.categories.length > 0 && (
                          <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-semibold">{post.categories[0].category.name}</span>
                        )}
                        <time className="text-[10px] text-muted-foreground/70 shrink-0" dateTime={post.createdAt.toISOString()}>{formatDate(post.createdAt.toISOString())}</time>
                      </div>
                      <h3 className={`font-heading leading-snug group-hover:text-primary transition-colors line-clamp-2 ${isFeatured ? "text-base sm:text-lg" : "text-sm sm:text-base"}`}>{post.title}</h3>
                      {excerpt && (
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3 sm:line-clamp-2">{excerpt}</p>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 text-xs font-bold uppercase tracking-wider group-hover:bg-primary/90 transition-colors w-fit rounded-full shadow-sm shadow-primary/20">
                      Xem chi tiết <ArrowRightSm />
                    </span>
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

export function BookingCtaSection({ bgStyle, label, title, desc, contactPhone, btn1Text, btn1Link, btn2Text, btn2Link }: {
  bgStyle?: React.CSSProperties; label?: string; title?: string; desc?: string; contactPhone?: string
  btn1Text?: string; btn1Link?: string; btn2Text?: string; btn2Link?: string
}) {
  const resolvedBtn1Link = btn1Link?.trim() || (contactPhone ? `tel:${contactPhone}` : "/dat-lich")
  const resolvedBtn2Link = btn2Link?.trim() || "/thuc-don"

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden" style={bgStyle ?? undefined}>
      {!bgStyle?.backgroundColor && !bgStyle?.backgroundImage && <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500" aria-hidden />}
      <div className="absolute inset-0 opacity-10" aria-hidden>
        <svg width="100%" height="100%"><pattern id="booking-dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="white"/></pattern><rect width="100%" height="100%" fill="url(#booking-dots)"/></svg>
      </div>
      {/* decorative circles */}
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5" aria-hidden />
      <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/5" aria-hidden />

      <div className="relative z-10 container px-4 sm:px-6">
        <FadeUp className="flex flex-col items-center text-center text-white">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/70 mb-3">{label || "Giao hàng tận nơi"}</p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight drop-shadow-md">
            {title || "Đặt lịch ngay hôm nay"}
          </h2>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-10 bg-white/40" />
            <div className="h-2 w-2 rounded-full bg-white/60" />
            <div className="h-px w-10 bg-white/40" />
          </div>
          <p className="text-white/80 text-base sm:text-lg max-w-xl mb-9 leading-relaxed">
            {desc || "Chọn món, chọn ngày giao — chúng tôi chuẩn bị tươi và giao đến tận tay bạn."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={resolvedBtn1Link} className="inline-flex items-center justify-center gap-2.5 bg-white text-primary hover:bg-orange-50 px-10 py-4 text-sm font-bold uppercase tracking-wider transition-colors shadow-2xl rounded-full">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.98-1.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              {btn1Text?.trim() || "Đặt lịch ngay"}
            </a>
            <Link href={resolvedBtn2Link} className="group inline-flex items-center justify-center gap-2 border-2 border-white/50 hover:bg-white/10 text-white px-10 py-4 text-sm font-bold uppercase tracking-wider transition-colors rounded-full">
              {btn2Text?.trim() || "Xem thực đơn"} <ArrowRight />
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ── Section: Map ────────────────────────────────────────────────────

interface MapSectionProps {
  contactAddress: string; contactPhone?: string; bgStyle?: React.CSSProperties
}

export function MapSection({ contactAddress, contactPhone, bgStyle }: MapSectionProps) {
  return (
    <section className="py-14 lg:py-20" style={{ background: "linear-gradient(135deg, #fff8f0 0%, #fef3e2 50%, #fff8f0 100%)", ...bgStyle }}>
      <div className="container px-4 sm:px-6">
        <FadeUp>
          <div className="grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-xl border border-orange-100 bg-white">
            <div className="flex flex-col justify-center gap-6 p-8 sm:p-10 order-2 md:order-1">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-1.5">Đến thăm chúng tôi</p>
                <h2 className="font-heading text-2xl sm:text-3xl">Tìm chúng tôi</h2>
                <div className="flex items-center gap-1.5 mt-2.5">
                  <div className="h-1 w-10 bg-primary rounded-full" />
                  <div className="h-1 w-5 bg-primary/30 rounded-full" />
                </div>
              </div>
              <div className="flex flex-col gap-4 text-sm text-muted-foreground">
                <div className="flex gap-3">
                  <div className="h-9 w-9 shrink-0 bg-primary/10 rounded-xl flex items-center justify-center mt-0.5">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/><path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/></svg>
                  </div>
                  <div><p className="font-semibold text-foreground mb-0.5">Địa chỉ</p><p>{contactAddress}</p></div>
                </div>
                {contactPhone && (
                  <div className="flex gap-3">
                    <div className="h-9 w-9 shrink-0 bg-primary/10 rounded-xl flex items-center justify-center mt-0.5">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"/></svg>
                    </div>
                    <div><p className="font-semibold text-foreground mb-0.5">Điện thoại</p><a href={`tel:${contactPhone.replace(/\s/g, "")}`} className="hover:text-primary transition-colors">{contactPhone}</a></div>
                  </div>
                )}
              </div>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(contactAddress)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors w-fit rounded-full shadow-md shadow-primary/30">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/><path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/></svg>
                Chỉ đường
              </a>
            </div>
            <div className="relative h-[300px] md:h-full min-h-[380px] order-1 md:order-2">
              <iframe src={`https://maps.google.com/maps?q=${encodeURIComponent(contactAddress)}&output=embed`} className="absolute inset-0 w-full h-full border-0" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Bản đồ" />
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ── Section: Thực đơn ───────────────────────────────────────────────

interface DishItem {
  id: string; name: string; description: string | null; unit: string; available: boolean; image: string | null
}

interface DishGroupItem {
  id: string; name: string; dishes: DishItem[]
}

interface ThucDonSectionProps {
  groups: DishGroupItem[]; bgStyle?: React.CSSProperties
}

export function ThucDonSection({ groups, bgStyle }: ThucDonSectionProps) {
  const visibleGroups = groups.filter((g) => g.dishes.length > 0)
  if (visibleGroups.length === 0) return null

  return (
    <section className="py-14 lg:py-20 relative overflow-hidden" style={{ backgroundColor: "#1c1917", ...bgStyle }}>
      {!bgStyle?.backgroundColor && !bgStyle?.backgroundImage && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-amber-950/40 to-stone-900" />
          <div className="absolute inset-0 opacity-[0.06]" aria-hidden>
            <svg width="100%" height="100%"><pattern id="menu-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="white"/></pattern><rect width="100%" height="100%" fill="url(#menu-dots)"/></svg>
          </div>
        </>
      )}
      <div className="relative z-10 container px-4 sm:px-6">
        <SlideInLeft>
          <SectionTitle
            label="Thực đơn"
            title="Các món chúng tôi cung cấp"
            light={!bgStyle?.backgroundColor && !bgStyle?.backgroundImage}
            right={
              <Link href="/thuc-don" className="group text-xs font-semibold uppercase tracking-wider text-orange-300 hover:text-orange-200 transition-colors flex items-center gap-1.5">
                Xem đầy đủ <ArrowRightSm />
              </Link>
            }
          />
        </SlideInLeft>

        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleGroups.map((group) => {
            const preview = group.dishes.slice(0, 3)
            const remaining = group.dishes.length - preview.length
            return (
              <StaggerItem key={group.id} hover>
                <Link href="/thuc-don" className="group flex flex-col h-full rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 bg-white/5 border border-white/10 hover:border-primary/40 backdrop-blur-sm">
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-gradient-to-r from-primary/20 to-amber-500/10">
                    <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-primary to-amber-400 shrink-0" />
                    <h3 className="font-heading font-bold text-base text-white">{group.name}</h3>
                    <span className="ml-auto text-[10px] font-bold text-primary bg-primary/20 px-2 py-0.5 rounded-full">{group.dishes.length} món</span>
                  </div>
                  <div className="flex-1 divide-y divide-white/5">
                    {preview.map((dish) => (
                      <div key={dish.id} className={`flex items-center px-5 py-3 gap-3${!dish.available ? " opacity-30" : ""}`}>
                        <div className="h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                        <span className="text-sm text-white/80 truncate">{dish.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="px-5 py-3 border-t border-white/10 bg-white/5 flex items-center justify-between">
                    {remaining > 0 ? (
                      <span className="text-xs text-white/40">+{remaining} món khác</span>
                    ) : <span />}
                    <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                      Xem thêm <ArrowRightSm />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            )
          })}
        </StaggerContainer>

        <FadeUp className="mt-10 text-center">
          <Link href="/thuc-don" className="group inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-9 py-3.5 text-sm font-bold uppercase tracking-wider transition-colors rounded-full shadow-xl shadow-primary/30">
            Xem thực đơn & bảng giá đầy đủ <ArrowRightSm />
          </Link>
        </FadeUp>
      </div>
    </section>
  )
}
