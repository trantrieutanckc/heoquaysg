export const dynamic = "force-dynamic"

import { db as metaDb } from "@/lib/db"
import { siteConfig } from "@/config/site"

export async function generateMetadata() {
  const row = await metaDb.siteConfig.findUnique({ where: { id: "default" } }).catch(() => null)
  const cfg = (row?.data ?? {}) as Record<string, string>
  const siteName = cfg.siteName?.trim() || siteConfig.name
  const description = cfg.siteDescription?.trim() || siteConfig.description
  const ogImage = cfg.heroImage?.trim() || cfg.logoUrl?.trim() || null
  return {
    title: { absolute: siteName },
    description,
    openGraph: {
      title: siteName,
      description,
      locale: "vi_VN",
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: siteName }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  }
}

import React from "react"
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
    <div className="flex items-center justify-center gap-3 py-2">
      <div className="h-px w-16 bg-border" />
      <svg viewBox="0 0 16 16" className="w-3 h-3 text-primary/50 shrink-0" fill="currentColor">
        <path d="M8 0 L9.5 6.5 L16 8 L9.5 9.5 L8 16 L6.5 9.5 L0 8 L6.5 6.5 Z" />
      </svg>
      <div className="h-px w-16 bg-border" />
    </div>
  )
}

function SectionTitle({ label, title, right }: { label?: string; title: string; right?: React.ReactNode }) {
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
          <div className="container px-4 sm:px-6 py-28 flex flex-col items-center text-center text-white">
            <FadeUp className="w-full flex flex-col items-center">
              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="h-px w-10 bg-orange-300/60" />
                <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.3em] text-orange-200">
                  {siteName}
                </p>
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
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
                <Link
                  href="/lien-he"
                  className="inline-flex items-center justify-center gap-2 border border-white/50 hover:bg-white/10 text-white px-10 py-3.5 text-sm font-semibold transition-colors backdrop-blur-sm uppercase tracking-wider"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.98-1.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  Đặt hàng ngay
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Bài viết nổi bật ─────────────────────────────────── */}
      {featured && (() => {
        const image = img(featured.image)
        const excerpt = getExcerpt((featured as any).content)
        return (
          <section className="bg-background py-14 lg:py-20">
            <div className="container px-4 sm:px-6">
              <ScaleIn>
                <SlideInLeft>
                  <SectionTitle label="Nổi bật" title="Bài viết nổi bật" />
                </SlideInLeft>
                <Link
                  href={`/posts/${featured.id}`}
                  className="group grid md:grid-cols-[45%_55%] overflow-hidden border bg-card hover:shadow-2xl transition-all duration-300"
                >
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
                  <div className="flex flex-col justify-center gap-4 p-6 lg:p-10">
                    {featured.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {featured.categories.map(({ category }) => (
                          <span key={category.slug} className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-0.5 text-xs font-semibold">
                            {category.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <h2 className="font-heading text-2xl lg:text-3xl leading-snug group-hover:text-primary transition-colors">
                      {featured.title}
                    </h2>
                    {excerpt && (
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{excerpt}</p>
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
                      <span className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 text-xs font-bold uppercase tracking-wider group-hover:bg-primary/90 transition-colors">
                        Xem chi tiết
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </ScaleIn>
            </div>
          </section>
        )
      })()}

      {/* ── Danh mục nổi bật ─────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="bg-stone-50 dark:bg-stone-900/60 py-14 lg:py-20 border-y border-border/40">
          <div className="container px-4 sm:px-6">
            <SlideInLeft>
              <SectionTitle
                label="Thực đơn"
                title="Danh mục món"
                right={
                  <Link href="/categories" className="text-xs font-semibold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5">
                    Xem tất cả
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
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
      )}

      {/* ── Về chúng tôi ─────────────────────────────────────── */}
      <section className="bg-amber-50/60 dark:bg-amber-950/20 py-14 lg:py-20 border-b border-border/40">
        <div className="container px-4 sm:px-6">
          <FadeUp>
            <div className="overflow-hidden border border-border/60 bg-card/80">
              <div className="grid md:grid-cols-2 items-stretch">
                <div className="flex flex-col justify-center gap-5 p-8 lg:p-12 order-2 md:order-1">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-2">Câu chuyện của chúng tôi</p>
                    <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl leading-tight italic">{siteName}</h2>
                    <div className="flex items-center gap-1.5 mt-3">
                      <div className="h-0.5 w-10 bg-primary rounded-full" />
                      <div className="h-0.5 w-4 bg-primary/40 rounded-full" />
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{siteDescription}</p>
                  <div className="flex flex-col gap-2 text-sm">
                    {cfg.contactAddress && (
                      <div className="flex items-start gap-2">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 mt-0.5 text-primary/70" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span>{cfg.contactAddress}</span>
                      </div>
                    )}
                    {cfg.businessHours && (
                      <div className="flex items-start gap-2">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 mt-0.5 text-primary/70" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <span>{cfg.businessHours}</span>
                      </div>
                    )}
                    {cfg.contactPhone && (
                      <div className="flex items-start gap-2">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 mt-0.5 text-primary/70" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.98-1.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        <a href={`tel:${cfg.contactPhone}`} className="hover:text-primary transition-colors">{cfg.contactPhone}</a>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 pt-1">
                    <Link
                      href="/about"
                      className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      Về chúng tôi
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
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

      {/* ── Bài viết mới nhất ────────────────────────────────── */}
      {others.length > 0 && (
        <section className="bg-background py-14 lg:py-20">
          <div className="container px-4 sm:px-6">
            <SlideInLeft>
              <SectionTitle
                label="Khám phá"
                title="Bài viết mới nhất"
                right={
                  <Link href="/blog" className="text-xs font-semibold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5">
                    Xem tất cả
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                }
              />
            </SlideInLeft>
            <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((post) => {
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
      )}

      {posts.length === 0 && (
        <section className="bg-background py-14">
          <div className="container px-4 sm:px-6 flex flex-col items-center justify-center py-24 text-center">
            <p className="text-lg font-medium mb-2">Chưa có bài viết nào</p>
            <p className="text-sm text-muted-foreground">Hãy tạo bài viết đầu tiên trong dashboard.</p>
          </div>
        </section>
      )}

      {/* ── Google Map ───────────────────────────────────────── */}
      {cfg.contactAddress && (
        <section className="bg-stone-50 dark:bg-stone-900/60 py-14 lg:py-20 border-t border-border/40">
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
                        <p>{cfg.contactAddress}</p>
                      </div>
                    </div>
                    {cfg.businessHours && (
                      <div className="flex gap-3">
                        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 mt-0.5 text-primary/70" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        <div>
                          <p className="font-medium text-foreground mb-0.5">Giờ mở cửa</p>
                          <p>{cfg.businessHours}</p>
                        </div>
                      </div>
                    )}
                    {cfg.contactPhone && (
                      <div className="flex gap-3">
                        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 mt-0.5 text-primary/70" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"/>
                        </svg>
                        <div>
                          <p className="font-medium text-foreground mb-0.5">Điện thoại</p>
                          <a href={`tel:${cfg.contactPhone.replace(/\s/g, "")}`} className="hover:text-primary transition-colors">{cfg.contactPhone}</a>
                        </div>
                      </div>
                    )}
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(cfg.contactAddress)}`}
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
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(cfg.contactAddress)}&output=embed`}
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
      )}

    </div>
  )
}
