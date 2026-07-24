import { notFound } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import { EditorJsRenderer, extractHeadings } from "@/components/editorjs-renderer"
import { TiptapRenderer, extractHeadingsTiptap } from "@/components/tiptap-renderer"
import { TableOfContents } from "@/components/table-of-contents"
import { CommentSection } from "@/components/comment-section"
import { LikeButton } from "@/components/like-button"
import { ShareButton } from "@/components/share-button"
import type { PostTemplate } from "@/lib/templates"
import { BackButton } from "@/components/back-button"
import { parseBanner } from "@/lib/banner"
import { BannerDisplay } from "@/components/banner-display"
import Image from "next/image"
import { PageEntrance, FadeUp } from "@/components/motion-primitives"
import { BLUR_PLACEHOLDER } from "@/lib/image"
import { RelatedPostsCarousel } from "@/components/related-posts-carousel"
import { StarDisplay } from "@/components/star-display"

interface PostPageProps {
  params: { postId: string }
}

async function findPost(ref: string) {
  const bySlug = await db.post.findUnique({ where: { slug: ref } }).catch(() => null)
  if (bySlug) return bySlug
  return db.post.findUnique({ where: { id: ref } }).catch(() => null)
}

export async function generateMetadata({ params }: PostPageProps) {
  const post = await db.post.findFirst({
    where: { OR: [{ slug: params.postId }, { id: params.postId }] },
    select: { title: true, seoTitle: true, seoDescription: true, seoKeywords: true, seoImage: true, image: true },
  })
  if (!post) return {}

  const coverImage = post.image as { url?: string } | null
  const title = post.seoTitle || post.title
  const description = post.seoDescription ?? undefined
  const ogImageUrl =
    post.seoImage ||
    coverImage?.url ||
    `/api/og?heading=${encodeURIComponent(title)}&type=Post&mode=dark`

  return {
    title,
    description,
    keywords: post.seoKeywords ?? undefined,
    openGraph: {
      title,
      description,
      type: "article",
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await db.post.findFirst({
    where: { OR: [{ slug: params.postId }, { id: params.postId }] },
    include: {
      author: { select: { name: true, image: true } },
      categories: {
        include: { category: { select: { id: true, name: true, slug: true } } },
      },
    },
  })

  if (!post) notFound()

  const postImage = post.image as { url?: string; alt?: string; title?: string } | null
  const template = (post.template ?? "standard") as PostTemplate
  const banner = parseBanner(post.banner)
  const isTiptap = post.content && typeof post.content === "object" && (post.content as any).type === "doc"
  const headings = isTiptap ? extractHeadingsTiptap(post.content) : extractHeadings(post.content)

  const siteConfigRow = await db.siteConfig.findUnique({ where: { id: "default" } }).catch(() => null)
  const cfg = (siteConfigRow?.data ?? {}) as Record<string, string>
  const phone = cfg.contactPhone?.trim() || null

  const relatedIds = Array.isArray(post.relatedPostIds) ? (post.relatedPostIds as string[]) : []
  const categoryIds = post.categories.map((c) => c.category.id)

  const relatedPosts = relatedIds.length > 0
    ? await db.post.findMany({
        where: { id: { in: relatedIds }, published: true },
        include: { categories: { include: { category: { select: { name: true, slug: true } } } } },
        take: 8,
      })
    : await db.post.findMany({
        where: {
          published: true,
          id: { not: params.postId },
          categories: { some: { categoryId: { in: categoryIds } } },
        },
        include: { categories: { include: { category: { select: { name: true, slug: true } } } } },
        orderBy: { createdAt: "desc" },
        take: 8,
      })

  return (
    <div className="min-h-screen">

      {/* ── Hero — ảnh + title đè lên ─────────────────────────── */}
      {postImage?.url ? (
        <PageEntrance>
          <div className="relative w-full overflow-hidden" style={{ minHeight: "420px", maxHeight: "580px" }}>
            <Image
              src={postImage.url}
              alt={postImage.alt ?? post.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
              placeholder="blur"
              blurDataURL={BLUR_PLACEHOLDER}
            />
            {/* gradient từ dưới lên */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
            {/* dot pattern */}
            <div className="absolute inset-0 opacity-[0.05]" aria-hidden>
              <svg width="100%" height="100%">
                <pattern id="post-hero-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.2" fill="white" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#post-hero-dots)" />
              </svg>
            </div>

            {/* Title trên ảnh */}
            <div className="absolute bottom-0 left-0 right-0 z-10">
              <div className="container px-4 sm:px-6 pb-10 pt-24">
                {template !== "minimal" && post.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.categories.map(({ category }) => (
                      <Link
                        key={category.id}
                        href={`/categories/${category.slug}`}
                        className="inline-flex items-center bg-primary text-white px-3 py-1 text-xs font-bold uppercase tracking-wider hover:bg-primary/80 transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
                <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-white leading-tight mb-4 max-w-3xl">
                  {post.title}
                </h1>
                <div className="flex items-center gap-4">
                  {post.avgRating != null && post.ratingCount > 0 && (
                    <StarDisplay rating={post.avgRating} size="sm" showNumber count={post.ratingCount} />
                  )}
                  {template !== "minimal" && (
                    <time dateTime={post.createdAt.toISOString()} className="text-white/60 text-sm">
                      {formatDate(post.createdAt.toISOString())}
                    </time>
                  )}
                </div>
              </div>
            </div>
          </div>
        </PageEntrance>
      ) : (
        /* Không có ảnh — header nền màu */
        <PageEntrance>
          <div className="bg-gradient-to-br from-primary/90 via-primary to-orange-600 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.08]" aria-hidden>
              <svg width="100%" height="100%">
                <pattern id="post-hero-dots-2" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.2" fill="white" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#post-hero-dots-2)" />
              </svg>
            </div>
            <div className="container px-4 sm:px-6 py-16 sm:py-24 relative z-10">
              {template !== "minimal" && post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.categories.map(({ category }) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      className="inline-flex items-center bg-white/20 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider hover:bg-white/30 transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-4 max-w-3xl">
                {post.title}
              </h1>
              {template !== "minimal" && (
                <time dateTime={post.createdAt.toISOString()} className="text-white/70 text-sm">
                  {formatDate(post.createdAt.toISOString())}
                </time>
              )}
            </div>
          </div>
        </PageEntrance>
      )}

      {/* ── Body ──────────────────────────────────────────────── */}
      <div className="container px-4 sm:px-6 py-8 lg:py-12">
        <PageEntrance>
          <BackButton className="mb-6 -ml-2" />
        </PageEntrance>

        {banner && (
          <FadeUp className="mb-8 rounded-xl overflow-hidden">
            <BannerDisplay banner={banner} />
          </FadeUp>
        )}

        {/* Content + TOC */}
        <div className="flex gap-12 items-start">
          <FadeUp delay={0.1} className="min-w-0 flex-1">
            {isTiptap
              ? <TiptapRenderer
                  content={post.content}
                  className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-heading prose-headings:scroll-mt-24 prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:border-l-4 prose-h2:border-primary prose-h2:pl-4 prose-h2:py-1 prose-p:text-base prose-p:leading-relaxed prose-p:text-foreground/90 prose-img:rounded-xl prose-img:shadow-md prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-blockquote:border-primary prose-blockquote:border-l-4 prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-lg prose-blockquote:py-3 prose-blockquote:text-foreground prose-strong:text-foreground [&_.tiptap-columns]:grid [&_.tiptap-columns]:grid-cols-2 [&_.tiptap-columns]:gap-6 [&_.tiptap-column]:min-w-0"
                />
              : <EditorJsRenderer content={post.content} />
            }
          </FadeUp>

          {/* TOC */}
          <div className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-24">
              <TableOfContents headings={headings} />
            </div>
          </div>
        </div>

        {/* Like + Share */}
        <FadeUp className="flex justify-center items-center gap-4 py-10 mt-10 border-t border-dashed">
          <LikeButton postId={post.id} initialLikes={post.likes} />
          <ShareButton title={post.title} />
        </FadeUp>

        {/* CTA block */}
        {phone && post.ctaEnabled !== false && (
          <FadeUp className="my-6 relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-orange-500 to-amber-500">
            <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden>
              <svg width="100%" height="100%">
                <pattern id="post-cta-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.2" fill="white" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#post-cta-dots)" />
              </svg>
            </div>
            <div className="relative flex flex-col sm:flex-row items-center gap-5 p-6 sm:p-8">
              <div className="shrink-0 h-16 w-16 drop-shadow-lg">
                <Image src={post.ctaImage?.trim() || "/images/heo-quay.png"} alt="Heo Quay Bình Tân" width={64} height={64} className="h-full w-full object-contain" />
              </div>
              <div className="flex-1 text-center sm:text-left text-white">
                <h2 className="font-heading text-xl sm:text-2xl font-bold leading-snug mb-1">
                  {post.ctaTitle?.trim() || "Muốn đặt món hoặc hỏi thêm?"}
                </h2>
                <p className="text-white/80 text-sm leading-relaxed">
                  {post.ctaDesc?.trim() || "Liên hệ với chúng tôi để được tư vấn và đặt hàng nhanh nhất."}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center gap-2 rounded-full bg-white text-primary hover:bg-orange-50 font-bold px-6 py-3 text-sm transition-colors shadow-lg whitespace-nowrap"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.98-1.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  Gọi ngay
                </a>
                <a
                  href={post.ctaBtn2Url?.trim() || "/thuc-don"}
                  className="inline-flex items-center gap-2 rounded-full border border-white/50 hover:bg-white/10 text-white font-semibold px-6 py-3 text-sm transition-colors whitespace-nowrap"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
                  </svg>
                  {post.ctaBtn2Label?.trim() || "Xem thực đơn"}
                </a>
              </div>
            </div>
          </FadeUp>
        )}

        {relatedPosts.length > 0 && (
          <FadeUp className="border-t pt-10 mt-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-6 w-1 rounded-full bg-primary" />
              <h2 className="font-heading text-xl sm:text-2xl">Sản phẩm liên quan</h2>
            </div>
            <RelatedPostsCarousel posts={relatedPosts} />
          </FadeUp>
        )}

        <FadeUp>
          <CommentSection postId={post.id} />
        </FadeUp>

        <div className="flex justify-center pt-8 pb-4">
          <BackButton />
        </div>
      </div>
    </div>
  )
}
