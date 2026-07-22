import Link from "next/link"
import Image from "next/image"
import { db } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { PageEntrance, StaggerContainer, StaggerItem } from "@/components/motion-primitives"
import { BLUR_PLACEHOLDER } from "@/lib/image"
import { StarDisplay } from "@/components/star-display"
import { BookingCtaSection } from "@/app/(marketing)/_components/home-sections"
import { postUrl } from "@/lib/post-url"

export async function generateMetadata() {
  const row = await db.siteConfig.findUnique({ where: { id: "default" } }).catch(() => null)
  const cfg = (row?.data ?? {}) as Record<string, string>
  const siteName = cfg.siteName?.trim() || "Heo Quay Bình Tân"
  const description = `Các món heo quay, vịt quay, gà quay và ẩm thực từ ${siteName}.`
  const ogImage = cfg.heroImage?.trim() || cfg.logoUrl?.trim() || null
  return {
    title: "Thực đơn & Món ăn",
    description,
    openGraph: {
      title: `Thực đơn | ${siteName}`,
      description,
      locale: "vi_VN",
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: siteName }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `Thực đơn | ${siteName}`,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string; tag?: string; page?: string }
}) {
  const selectedSlug = searchParams.category?.trim() || null
  const selectedTag = searchParams.tag?.trim() || null
  const page = Math.max(1, parseInt(searchParams.page ?? "1") || 1)

  const configRow = await db.siteConfig.findUnique({ where: { id: "default" } }).catch(() => null)
  const cfg = (configRow?.data ?? {}) as Record<string, string>
  const pageSize = Math.max(3, parseInt(cfg.blogPageSize ?? "12") || 12)
  const useSlugs = cfg.useSlugs === "true"

  const postWhere = {
    published: true,
    ...(selectedSlug ? { categories: { some: { category: { slug: selectedSlug } } } } : {}),
    ...(selectedTag ? { tags: { some: { tag: { slug: selectedTag } } } } : {}),
  }

  const [categories, tags, posts, total] = await Promise.all([
    db.category.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      select: { id: true, name: true, slug: true, _count: { select: { posts: true } } },
    }),
    db.tag.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true, _count: { select: { posts: true } } },
    }),
    db.post.findMany({
      where: postWhere,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        slug: true,
        title: true,
        image: true,
        createdAt: true,
        avgRating: true,
        ratingCount: true,
        seoDescription: true,
        author: { select: { name: true, image: true } },
        categories: { select: { category: { select: { name: true, slug: true } } } },
        tags: { select: { tag: { select: { name: true, slug: true } } } },
      },
    }),
    db.post.count({ where: postWhere }),
  ])

  const totalPages = Math.ceil(total / pageSize)

  const selectedCategory = categories.find((c) => c.slug === selectedSlug)
  const selectedTagObj = tags.find((t) => t.slug === selectedTag)

  return (
    <div>
      {/* Page header */}
      <div className="border-b bg-card">
        <div className="container px-4 sm:px-6 py-10 lg:py-14">
          <PageEntrance>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-2">Khám phá</p>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl">
              {selectedCategory ? selectedCategory.name : selectedTagObj ? `#${selectedTagObj.name}` : "Bài viết & Thực đơn"}
            </h1>
            <div className="flex items-center gap-1.5 mt-3">
              <div className="h-0.5 w-10 bg-primary rounded-full" />
              <div className="h-0.5 w-4 bg-primary/40 rounded-full" />
            </div>
            <p className="text-muted-foreground mt-3">
              {selectedCategory || selectedTagObj
                ? `${posts.length} bài viết.`
                : "Các bài viết mới nhất về ẩm thực và món quay."}
            </p>
          </PageEntrance>
        </div>
      </div>

      <div className="container px-4 sm:px-6 py-8 lg:py-10">
      <PageEntrance>
        <div />

        {/* Category filter tabs */}
        {categories.length > 0 && (
          <div className="flex overflow-x-auto scrollbar-none gap-1 mt-6 border-b">
            <Link
              href="/blog"
              className={cn(
                "relative shrink-0 inline-flex items-center px-4 py-2 text-sm font-semibold transition-colors",
                "after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:bg-primary after:transition-[width] after:duration-500",
                !selectedSlug
                  ? "text-primary after:w-full"
                  : "text-muted-foreground hover:text-foreground after:w-0 hover:after:w-full"
              )}
            >
              Tất cả
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/blog?category=${cat.slug}`}
                className={cn(
                  "relative shrink-0 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold transition-colors",
                  "after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:bg-primary after:transition-[width] after:duration-500",
                  selectedSlug === cat.slug
                    ? "text-primary after:w-full"
                    : "text-muted-foreground hover:text-foreground after:w-0 hover:after:w-full"
                )}
              >
                {cat.name}
                {cat._count.posts > 0 && (
                  <span className="text-xs opacity-50">{cat._count.posts}</span>
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Tag filter */}
        {tags.length > 0 && (
          <div className="flex flex-nowrap overflow-x-auto scrollbar-none sm:flex-wrap sm:overflow-x-visible gap-1.5 mt-3 pb-1 sm:pb-0">
            {tags.map((tag) => (
              <a
                key={tag.slug}
                href={selectedTag === tag.slug ? "/blog" : `/blog?tag=${tag.slug}`}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-medium border transition-colors",
                  selectedTag === tag.slug
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                )}
              >
                #{tag.name}
              </a>
            ))}
          </div>
        )}

        <div className="my-5" />
      </PageEntrance>

      {posts.length ? (
        <StaggerContainer key={selectedSlug ?? "all"} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const image = post.image as { url?: string; alt?: string } | null
            return (
              <StaggerItem key={post.id} hover>
                <Link
                  href={postUrl(post, useSlugs)}
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

                    <h2 className="relative font-heading text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2 after:absolute after:-bottom-[2px] after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:bg-primary after:w-0 after:transition-[width] after:duration-500 group-hover:after:w-full">
                      {post.title}
                    </h2>

                    {post.seoDescription && (
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{post.seoDescription}</p>
                    )}

                    {post.avgRating != null && post.ratingCount > 0 && (
                      <StarDisplay rating={post.avgRating} size="sm" showNumber count={post.ratingCount} />
                    )}

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
          <p className="text-muted-foreground">
            {selectedSlug ? "Chưa có bài viết nào trong danh mục này." : "Chưa có bài viết nào được đăng."}
          </p>
          {selectedSlug && (
            <Link href="/blog" className="mt-4 text-sm text-primary hover:underline">
              Xem tất cả bài viết →
            </Link>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 py-10">
          {page > 1 && (
            <Link
              href={`/blog?${new URLSearchParams({ ...(selectedSlug ? { category: selectedSlug } : {}), ...(selectedTag ? { tag: selectedTag } : {}), page: String(page - 1) })}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border text-sm font-medium hover:bg-muted transition-colors"
            >
              ← Trang trước
            </Link>
          )}
          <span className="text-sm text-muted-foreground px-2">
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/blog?${new URLSearchParams({ ...(selectedSlug ? { category: selectedSlug } : {}), ...(selectedTag ? { tag: selectedTag } : {}), page: String(page + 1) })}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border text-sm font-medium hover:bg-muted transition-colors"
            >
              Trang sau →
            </Link>
          )}
        </div>
      )}
      </div>
      <BookingCtaSection
        label={cfg.homeBookingLabel}
        title={cfg.homeBookingTitle}
        desc={cfg.homeBookingDesc}
        contactPhone={cfg.contactPhone}
        btn1Text={cfg.homeBookingBtn1Text}
        btn1Link={cfg.homeBookingBtn1Link}
        btn2Text={cfg.homeBookingBtn2Text}
        btn2Link={cfg.homeBookingBtn2Link}
        bgStyle={(() => {
          const img = cfg.homeBookingBgImage?.trim()
          const color = cfg.homeBookingBgColor?.trim()
          if (img) return { backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center" }
          if (color) return { backgroundColor: color }
          return undefined
        })()}
      />
    </div>
  )
}
