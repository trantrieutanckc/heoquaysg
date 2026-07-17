export const dynamic = "force-dynamic"

import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import { BLUR_PLACEHOLDER } from "@/lib/image"
import type { CategoryTemplate } from "@/lib/templates"
import { parseBanner } from "@/lib/banner"
import { BannerDisplay } from "@/components/banner-display"
import { PageEntrance, FadeUp, StaggerContainer, StaggerItem } from "@/components/motion-primitives"
import { StarDisplay } from "@/components/star-display"
import { BookingCtaSection } from "@/app/(marketing)/_components/home-sections"

interface CategoryPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const category = await db.category.findUnique({ where: { slug: params.slug } })
  if (!category) return {}

  const title = category.seoTitle || category.name
  const description = category.seoDescription ?? undefined
  const coverImage = category.image as { url?: string } | null
  const ogImageUrl =
    (category.seoImage as string | null) ||
    coverImage?.url ||
    `/api/og?heading=${encodeURIComponent(title)}&type=Guide&mode=dark`

  return {
    title,
    description,
    keywords: category.seoKeywords ?? undefined,
    openGraph: {
      title,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImageUrl] },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await db.category.findUnique({
    where: { slug: params.slug },
    include: {
      posts: {
        select: {
          post: {
            select: {
              id: true,
              title: true,
              image: true,
              createdAt: true,
              published: true,
              avgRating: true,
              ratingCount: true,
              seoDescription: true,
              price: true,
            },
          },
        },
      },
    },
  })

  if (!category) notFound()

  const image = category.image as { url?: string; alt?: string; title?: string } | null
  const posts = category.posts.map((pc) => pc.post).filter((p) => p?.published)
  const template = (category.template ?? "standard") as CategoryTemplate
  const banner = parseBanner(category.banner)

  const siteConfigRow = await db.siteConfig.findUnique({ where: { id: "default" } }).catch(() => null)
  const cfg = (siteConfigRow?.data ?? {}) as Record<string, string>

  const bookingProps = {
    label: cfg.homeBookingLabel,
    title: cfg.homeBookingTitle,
    desc: cfg.homeBookingDesc,
    contactPhone: cfg.contactPhone,
    btn1Text: cfg.homeBookingBtn1Text,
    btn1Link: cfg.homeBookingBtn1Link,
    btn2Text: cfg.homeBookingBtn2Text,
    btn2Link: cfg.homeBookingBtn2Link,
    bgStyle: (() => {
      const img = cfg.homeBookingBgImage?.trim()
      const color = cfg.homeBookingBgColor?.trim()
      if (img) return { backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center" }
      if (color) return { backgroundColor: color }
      return undefined
    })(),
  }

  if (template === "hero") {
    return <HeroTemplate category={category} image={image} posts={posts} banner={banner} bookingProps={bookingProps} />
  }
  if (template === "grid") {
    return <StandardTemplate category={category} image={image} posts={posts} banner={banner} bookingProps={bookingProps} />
  }
  return <StandardTemplate category={category} image={image} posts={posts} banner={banner} bookingProps={bookingProps} />
}

// ─── Shared post card ────────────────────────────────────────────────────────
function PostCard({ post }: { post: any }) {
  const postImage = post.image as { url?: string; alt?: string } | null
  const excerpt = post.seoDescription?.replace(/\n+/g, " ").trim()
  return (
    <Link
      href={`/posts/${post.id}`}
      className="group flex flex-row sm:flex-col overflow-hidden rounded-xl border bg-card hover:shadow-lg transition-shadow duration-300 h-full"
    >
      <div className="w-40 shrink-0 sm:w-full sm:aspect-[4/3] relative bg-muted overflow-hidden" style={{ minHeight: "7rem" }}>
        {postImage?.url ? (
          <Image
            src={postImage.url}
            alt={postImage.alt ?? post.title}
            fill
            sizes="(max-width: 640px) 160px, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            placeholder="blur"
            blurDataURL={BLUR_PLACEHOLDER}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-muted to-muted-foreground/10" />
        )}
      </div>
      <div className="flex flex-col p-3 sm:p-4 flex-1">
        <div className="flex-1 flex flex-col gap-1.5 mb-3">
          <time className="text-[10px] text-muted-foreground/70">{formatDate(post.createdAt.toISOString())}</time>
          <h2 className="font-heading text-sm sm:text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h2>
          {excerpt && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-1 sm:line-clamp-2">{excerpt}</p>
          )}
          {post.price != null && (
            <span className="inline-flex items-center bg-primary/10 text-primary px-2 py-0.5 text-xs font-bold w-fit">
              {new Intl.NumberFormat("vi-VN").format(post.price)} đ
            </span>
          )}
          {post.avgRating != null && post.ratingCount > 0 && (
            <StarDisplay rating={post.avgRating} size="sm" showNumber count={post.ratingCount} />
          )}
        </div>
        <span className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 text-xs font-bold uppercase tracking-wider group-hover:bg-primary/90 transition-colors w-fit">
          Xem chi tiết
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  )
}

// ─── Standard template ────────────────────────────────────────────────────────
function StandardTemplate({ category, image, posts, banner, bookingProps }: any) {
  return (
    <div className="min-h-screen">
      <PageEntrance>
        {image?.url ? (
          <div className="relative w-full overflow-hidden border-b" style={{ height: 340 }}>
            <Image
              src={image.url}
              alt={image.alt ?? category.name}
              fill
              sizes="100vw"
              className="object-cover"
              priority
              placeholder="blur"
              blurDataURL={BLUR_PLACEHOLDER}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 container px-4 sm:px-6 pb-8">
              <Link href="/categories" className="text-xs text-white/70 hover:text-white transition-colors mb-2 inline-block">
                ← Danh mục
              </Link>
              <div className="flex items-end justify-between gap-4 flex-wrap">
                <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white">{category.name}</h1>
                <span className="text-sm text-white/70 shrink-0">{posts.length} bài viết</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="border-b bg-muted/30">
            <div className="container px-4 sm:px-6 py-12 lg:py-16">
              <div className="flex items-end justify-between gap-4 flex-wrap">
                <div>
                  <Link href="/categories" className="text-xs text-muted-foreground hover:text-foreground transition-colors mb-2 inline-block">
                    ← Danh mục
                  </Link>
                  <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl tracking-tight">{category.name}</h1>
                </div>
                <span className="text-sm text-muted-foreground shrink-0">{posts.length} bài viết</span>
              </div>
            </div>
          </div>
        )}
      </PageEntrance>

      <div className="container px-4 sm:px-6 py-10 lg:py-14">
        {banner && <FadeUp className="mb-10"><BannerDisplay banner={banner} /></FadeUp>}
        {posts.length ? (
          <StaggerContainer className="flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
            {posts.map((post: any) => (
              <StaggerItem key={post.id} hover>
                <PostCard post={post} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <FadeUp className="flex flex-col items-center justify-center py-32 text-center">
            <p className="font-medium mb-1">Chưa có bài viết nào</p>
            <p className="text-sm text-muted-foreground">Danh mục này chưa có bài viết nào được đăng.</p>
          </FadeUp>
        )}
      </div>
      <BookingCtaSection {...bookingProps} />
    </div>
  )
}

// ─── Hero template ────────────────────────────────────────────────────────────
function HeroTemplate({ category, image, posts, banner, bookingProps }: any) {
  return (
    <div className="min-h-screen">
      <div className="relative h-72 w-full overflow-hidden lg:h-[420px]">
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.alt ?? category.name}
            fill
            sizes="100vw"
            className="object-cover"
            priority
            placeholder="blur"
            blurDataURL={BLUR_PLACEHOLDER}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-orange-900 via-orange-700 to-amber-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <PageEntrance className="absolute inset-0 flex flex-col items-center justify-end pb-10 text-center px-4">
          <Link href="/categories" className="text-xs text-white/60 hover:text-white/90 transition-colors mb-4 inline-block">
            ← Danh mục
          </Link>
          <h1 className="font-heading text-4xl sm:text-6xl text-white tracking-tight drop-shadow-lg mb-3">
            {category.name}
          </h1>
          <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm text-white px-4 py-1 text-sm">
            {posts.length} bài viết
          </span>
        </PageEntrance>
      </div>

      <div className="container px-4 sm:px-6 py-10 lg:py-14 pb-20 lg:pb-28">
        {banner && <FadeUp className="mb-10"><BannerDisplay banner={banner} /></FadeUp>}
        {posts.length ? (
          <StaggerContainer className="flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
            {posts.map((post: any) => (
              <StaggerItem key={post.id} hover>
                <PostCard post={post} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <FadeUp className="flex flex-col items-center justify-center py-32 text-center">
            <p className="font-medium mb-1">Chưa có bài viết nào</p>
            <p className="text-sm text-muted-foreground">Danh mục này chưa có bài viết nào được đăng.</p>
          </FadeUp>
        )}
      </div>
      <BookingCtaSection {...bookingProps} />
    </div>
  )
}
