import { notFound } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/db"
import { formatDate, cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { EditorJsRenderer } from "@/components/editorjs-renderer"
import { CommentSection } from "@/components/comment-section"
import { LikeButton } from "@/components/like-button"
import { ShareButton } from "@/components/share-button"

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

  return (
    <article className="container relative max-w-3xl py-6 lg:py-10">
      {/* Back button */}
      <Link
        href="javascript:history.back()"
        className={cn(buttonVariants({ variant: "ghost" }), "mb-6 inline-flex")}
      >
        <Icons.chevronLeft className="mr-2 h-4 w-4" />
        Quay lại
      </Link>

      {/* Meta */}
      <div className="space-y-2 mb-6">
        <time
          dateTime={post.createdAt.toISOString()}
          className="block text-sm text-muted-foreground"
        >
          {formatDate(post.createdAt.toISOString())}
        </time>
        <h1 className="font-heading text-4xl leading-tight lg:text-5xl">
          {post.title}
        </h1>

        {/* Categories */}
        {post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {post.categories.map(({ category }) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors hover:bg-muted"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}

        {/* Author */}
        {post.author && (
          <div className="flex items-center gap-2 pt-2">
            {post.author.image ? (
              <img
                src={post.author.image}
                alt={post.author.name ?? ""}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                {post.author.name?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
            <span className="text-sm font-medium">{post.author.name}</span>
          </div>
        )}
      </div>

      {/* Cover image */}
      {postImage?.url && (
        <div className="mb-8 overflow-hidden rounded-lg border">
          <img
            src={postImage.url}
            alt={postImage.alt ?? post.title}
            className="w-full object-cover max-h-96"
          />
        </div>
      )}

      {/* Content */}
      <EditorJsRenderer content={post.content} />

      {/* Like & Share */}
      <div className="flex justify-center items-center gap-3 py-8">
        <LikeButton postId={post.id} initialLikes={post.likes} />
        <ShareButton title={post.title} />
      </div>

      <CommentSection postId={post.id} />

      <hr className="mt-12" />
      <div className="flex justify-center py-6">
        <Link href="javascript:history.back()" className={cn(buttonVariants({ variant: "ghost" }))}>
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Link>
      </div>
    </article>
  )
}
