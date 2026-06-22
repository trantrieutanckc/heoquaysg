import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { formatDate } from "@/lib/utils"

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
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await db.category.findUnique({
    where: { slug: params.slug },
    include: {
      posts: {
        include: { post: true },
      },
    },
  })

  if (!category) notFound()

  const image = category.image as { url?: string; alt?: string; title?: string } | null
  const publishedPosts = category.posts.map((pc) => pc.post)

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-6">
        {image?.url && (
          <div className="w-full overflow-hidden rounded-lg">
            <img
              src={image.url}
              alt={image.alt ?? category.name}
              title={image.title ?? ""}
              className="h-48 w-full object-cover"
            />
          </div>
        )}
        <div className="space-y-2">
          <h1 className="font-heading text-4xl tracking-tight lg:text-5xl">
            {category.name}
          </h1>
          <p className="text-muted-foreground">{publishedPosts.length} bài viết</p>
        </div>
      </div>
      <hr className="my-8" />
      {publishedPosts.length ? (
        <div className="grid gap-6">
          {publishedPosts.map((post) => {
            const postImage = post.image as { url?: string; alt?: string } | null
            return (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="group flex gap-4 rounded-lg border p-4 transition-shadow hover:shadow-md"
              >
                {postImage?.url && (
                  <div className="h-20 w-32 shrink-0 overflow-hidden rounded-md bg-muted">
                    <img
                      src={postImage.url}
                      alt={postImage.alt ?? post.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <h2 className="font-semibold text-lg group-hover:underline">{post.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(post.createdAt.toISOString())}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <p className="text-muted-foreground">Chưa có bài viết nào trong danh mục này.</p>
      )}
    </div>
  )
}
