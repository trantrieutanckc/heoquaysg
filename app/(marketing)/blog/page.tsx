import Link from "next/link"
import Image from "next/image"
import { db } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { PageEntrance, StaggerContainer, StaggerItem } from "@/components/motion-primitives"
import { BLUR_PLACEHOLDER } from "@/lib/image"
import { StarDisplay } from "@/components/star-display"

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
  searchParams: { category?: string }
}) {
  const selectedSlug = searchParams.category?.trim() || null

  const [categories, posts] = await Promise.all([
    db.category.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      select: { id: true, name: true, slug: true, _count: { select: { posts: true } } },
    }),
    db.post.findMany({
      where: {
        published: true,
        ...(selectedSlug ? { categories: { some: { category: { slug: selectedSlug } } } } : {}),
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        image: true,
        price: true,
        createdAt: true,
        avgRating: true,
        ratingCount: true,
        author: { select: { name: true, image: true } },
        categories: { select: { category: { select: { name: true, slug: true } } } },
      },
    }),
  ])

  const selectedCategory = categories.find((c) => c.slug === selectedSlug)

  return (
    <div>
      {/* Page header */}
      <div className="border-b bg-card">
        <div className="container px-4 sm:px-6 py-10 lg:py-14">
          <PageEntrance>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-2">Khám phá</p>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl italic">
              {selectedCategory ? selectedCategory.name : "Bài viết & Thực đơn"}
            </h1>
            <div className="flex items-center gap-1.5 mt-3">
              <div className="h-0.5 w-10 bg-primary rounded-full" />
              <div className="h-0.5 w-4 bg-primary/40 rounded-full" />
            </div>
            <p className="text-muted-foreground mt-3">
              {selectedCategory
                ? `${posts.length} bài viết trong danh mục này.`
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
          <div className="flex flex-wrap gap-1 mt-6 border-b">
            <Link
              href="/blog"
              className={cn(
                "inline-flex items-center px-4 py-2 text-sm font-semibold transition-colors border-b-2 -mb-px",
                !selectedSlug
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              Tất cả
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/blog?category=${cat.slug}`}
                className={cn(
                  "inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold transition-colors border-b-2 -mb-px",
                  selectedSlug === cat.slug
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
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

        <div className="my-8" />
      </PageEntrance>

      {posts.length ? (
        <StaggerContainer key={selectedSlug ?? "all"} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

                    <h2 className="relative font-heading text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2 after:absolute after:-bottom-[2px] after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:bg-primary after:w-0 after:transition-[width] after:duration-500 group-hover:after:w-full">
                      {post.title}
                    </h2>

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
      </div>
    </div>
  )
}
