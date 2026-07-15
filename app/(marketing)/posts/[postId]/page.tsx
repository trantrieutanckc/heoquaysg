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

export async function generateMetadata({ params }: PostPageProps) {
  const post = await db.post.findUnique({
    where: { id: params.postId },
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
  const post = await db.post.findUnique({
    where: { id: params.postId },
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

  // Related posts: manual selection or fallback to same category
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
      {postImage?.url && (
        <PageEntrance>
          <div className="relative w-full overflow-hidden bg-muted aspect-video sm:aspect-[16/7] max-h-[480px]">
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
          </div>
        </PageEntrance>
      )}

      <div className="container px-4 sm:px-6 py-6 lg:py-10">
        <PageEntrance>
          <BackButton className="mb-6 -ml-2" />
        </PageEntrance>

        {/* Header */}
        <FadeUp>
          <header className="mb-8">
            {template !== "minimal" && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {post.categories.map(({ category }) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-0.5 text-xs font-semibold hover:bg-primary/20 transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}

            <h1 className="font-heading text-2xl leading-tight sm:text-3xl lg:text-4xl xl:text-5xl mb-4">
              {post.title}
            </h1>

            {post.price != null && (
              <div className="mb-4">
                <span className="inline-flex items-center rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-4 py-1.5 text-base font-bold">
                  {new Intl.NumberFormat("vi-VN").format(post.price)} đ
                </span>
              </div>
            )}

            {post.avgRating != null && post.ratingCount > 0 && (
              <div className="mb-4">
                <StarDisplay rating={post.avgRating} size="lg" showNumber count={post.ratingCount} />
              </div>
            )}

            {template !== "minimal" && (
              <div className="flex items-center gap-3 border-t pt-4">
                <time
                  dateTime={post.createdAt.toISOString()}
                  className="text-sm text-muted-foreground"
                >
                  {formatDate(post.createdAt.toISOString())}
                </time>
              </div>
            )}
          </header>
        </FadeUp>

        {banner && (
          <FadeUp className="mb-8 rounded-xl overflow-hidden">
            <BannerDisplay banner={banner} />
          </FadeUp>
        )}

        {/* Content + TOC */}
        <div className="flex gap-10 items-start">
          <FadeUp delay={0.1} className="min-w-0 flex-1">
            {isTiptap
              ? <TiptapRenderer
                  content={post.content}
                  className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-heading prose-headings:scroll-mt-24 prose-h2:text-xl prose-h2:sm:text-2xl prose-p:text-base prose-p:leading-relaxed prose-p:text-foreground/90 prose-img:rounded-xl prose-img:shadow-md prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-blockquote:border-primary prose-blockquote:bg-muted/50 prose-blockquote:rounded-r-lg prose-blockquote:py-1 [&_.tiptap-columns]:grid [&_.tiptap-columns]:grid-cols-2 [&_.tiptap-columns]:gap-6 [&_.tiptap-column]:min-w-0"
                />
              : <EditorJsRenderer content={post.content} />
            }
          </FadeUp>
          <div className="hidden lg:block w-56 shrink-0">
            <TableOfContents headings={headings} />
          </div>
        </div>

        <FadeUp className="flex justify-center items-center gap-4 py-10 mt-10 border-t">
          <LikeButton postId={post.id} initialLikes={post.likes} />
          <ShareButton title={post.title} />
        </FadeUp>

        {phone && (
          <FadeUp className="my-6 relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-orange-500 to-amber-500">
            {/* dot pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden>
              <svg width="100%" height="100%">
                <pattern id="post-cta-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.2" fill="white" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#post-cta-dots)" />
              </svg>
            </div>
            <div className="relative flex flex-col sm:flex-row items-center gap-5 p-6 sm:p-8">
              {/* icon */}
              <div className="shrink-0 h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl select-none">
                🐷
              </div>
              {/* text */}
              <div className="flex-1 text-center sm:text-left text-white">
                <h2 className="font-heading text-xl sm:text-2xl font-bold leading-snug mb-1">
                  Muốn đặt món hoặc hỏi thêm?
                </h2>
                <p className="text-white/80 text-sm leading-relaxed">
                  Liên hệ với chúng tôi để được tư vấn và đặt hàng nhanh nhất.
                </p>
              </div>
              {/* buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center gap-2 rounded-full bg-white text-orange-600 hover:bg-orange-50 font-bold px-6 py-3 text-sm transition-colors shadow-lg whitespace-nowrap"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.98-1.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  Gọi ngay
                </a>
                <a
                  href="/dat-lich"
                  className="inline-flex items-center gap-2 rounded-full border border-white/50 hover:bg-white/10 text-white font-semibold px-6 py-3 text-sm transition-colors whitespace-nowrap"
                >
                  Đặt lịch online
                </a>
              </div>
            </div>
          </FadeUp>
        )}

        {relatedPosts.length > 0 && (
          <FadeUp className="border-t pt-10 mt-2">
            <h2 className="font-heading text-xl sm:text-2xl mb-6">Bài viết liên quan</h2>
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
