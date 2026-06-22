import { notFound } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import { EditorJsRenderer } from "@/components/editorjs-renderer"
import { CommentSection } from "@/components/comment-section"
import { LikeButton } from "@/components/like-button"
import { ShareButton } from "@/components/share-button"
import type { PostTemplate } from "@/lib/templates"
import { BackButton } from "@/components/back-button"
import { parseBanner } from "@/lib/banner"
import { BannerDisplay } from "@/components/banner-display"

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
  const maxWidth = template === "wide" ? "max-w-4xl" : "max-w-2xl"

  return (
    <div className="min-h-screen">
      {/* Cover image — full width trên mobile, có max-height trên desktop */}
      {postImage?.url && (
        <div className="w-full overflow-hidden bg-muted aspect-[16/7] max-h-[480px]">
          <img
            src={postImage.url}
            alt={postImage.alt ?? post.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className={`container ${maxWidth} px-4 sm:px-6 py-6 lg:py-10`}>
        <BackButton className="mb-6 -ml-2" />

        {/* Header */}
        <header className="mb-8">
          {/* Categories */}
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

          {/* Author + date */}
          {template !== "minimal" && (
            <div className="flex items-center gap-3 pt-1 border-t pt-4">
              {post.author && (
                <>
                  {post.author.image ? (
                    <img
                      src={post.author.image}
                      alt={post.author.name ?? ""}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-border shrink-0"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold ring-2 ring-border shrink-0">
                      {post.author.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold leading-none">{post.author.name}</p>
                    <time
                      dateTime={post.createdAt.toISOString()}
                      className="text-xs text-muted-foreground mt-0.5 block"
                    >
                      {formatDate(post.createdAt.toISOString())}
                    </time>
                  </div>
                </>
              )}
              {!post.author && (
                <time
                  dateTime={post.createdAt.toISOString()}
                  className="text-sm text-muted-foreground"
                >
                  {formatDate(post.createdAt.toISOString())}
                </time>
              )}
            </div>
          )}
        </header>

        {/* Banner */}
        {banner && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <BannerDisplay banner={banner} />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none
          prose-headings:font-heading prose-headings:scroll-mt-20
          prose-h2:text-xl prose-h2:sm:text-2xl
          prose-p:text-base prose-p:leading-relaxed prose-p:text-foreground/90
          prose-img:rounded-xl prose-img:shadow-md
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-blockquote:border-primary prose-blockquote:bg-muted/50 prose-blockquote:rounded-r-lg prose-blockquote:py-1">
          <EditorJsRenderer content={post.content} />
        </div>

        {/* Like & Share */}
        <div className="flex justify-center items-center gap-4 py-10 mt-10 border-t">
          <LikeButton postId={post.id} initialLikes={post.likes} />
          <ShareButton title={post.title} />
        </div>

        <CommentSection postId={post.id} />

        <div className="flex justify-center pt-8 pb-4">
          <BackButton />
        </div>
      </div>
    </div>
  )
}
