import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import type { CategoryTemplate } from "@/lib/templates"
import { parseBanner } from "@/lib/banner"
import { BannerDisplay } from "@/components/banner-display"

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
        include: { post: true },
      },
    },
  })

  if (!category) notFound()

  const image = category.image as { url?: string; alt?: string; title?: string } | null
  const posts = category.posts.map((pc) => pc.post).filter((p) => p?.published)
  const template = (category.template ?? "standard") as CategoryTemplate
  const banner = parseBanner(category.banner)

  if (template === "hero") {
    return <HeroTemplate category={category} image={image} posts={posts} banner={banner} />
  }
  if (template === "grid") {
    return <GridTemplate category={category} image={image} posts={posts} banner={banner} />
  }
  return <StandardTemplate category={category} image={image} posts={posts} banner={banner} />
}

// ─── Standard template ────────────────────────────────────────────────────────
function StandardTemplate({ category, image, posts, banner }: any) {
  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      {banner && <div className="mb-6"><BannerDisplay banner={banner} /></div>}
      <div className="flex flex-col items-start gap-6">
        {image?.url && (
          <div className="w-full overflow-hidden rounded-lg">
            <img src={image.url} alt={image.alt ?? category.name} className="h-48 w-full object-cover" />
          </div>
        )}
        <div className="space-y-2">
          <h1 className="font-heading text-4xl tracking-tight lg:text-5xl">{category.name}</h1>
          <p className="text-muted-foreground">{posts.length} bài viết</p>
        </div>
      </div>
      <hr className="my-8" />
      {posts.length ? (
        <div className="grid gap-6">
          {posts.map((post: any) => {
            const postImage = post.image as { url?: string; alt?: string } | null
            return (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="group flex gap-4 rounded-lg border p-4 transition-shadow hover:shadow-md"
              >
                {postImage?.url && (
                  <div className="h-20 w-32 shrink-0 overflow-hidden rounded-md bg-muted">
                    <img src={postImage.url} alt={postImage.alt ?? post.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <h2 className="font-semibold text-lg group-hover:underline">{post.title}</h2>
                  <p className="text-sm text-muted-foreground">{formatDate(post.createdAt.toISOString())}</p>
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

// ─── Grid template ────────────────────────────────────────────────────────────
function GridTemplate({ category, image, posts, banner }: any) {
  return (
    <div className="container max-w-5xl py-6 lg:py-10">
      {banner && <div className="mb-6"><BannerDisplay banner={banner} /></div>}
      <div className="mb-8 space-y-2">
        <h1 className="font-heading text-4xl tracking-tight lg:text-5xl">{category.name}</h1>
        <p className="text-muted-foreground">{posts.length} bài viết</p>
      </div>
      <hr className="my-8" />
      {posts.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: any) => {
            const postImage = post.image as { url?: string; alt?: string } | null
            return (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="group flex flex-col overflow-hidden rounded-lg border transition-shadow hover:shadow-md"
              >
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  {postImage?.url ? (
                    <img src={postImage.url} alt={postImage.alt ?? post.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  ) : (
                    <div className="h-full w-full bg-muted" />
                  )}
                </div>
                <div className="flex flex-col gap-1 p-4">
                  <h2 className="font-semibold leading-tight group-hover:underline">{post.title}</h2>
                  <p className="text-xs text-muted-foreground">{formatDate(post.createdAt.toISOString())}</p>
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

// ─── Hero template ────────────────────────────────────────────────────────────
function HeroTemplate({ category, image, posts, banner }: any) {
  return (
    <div>
      {/* Hero banner */}
      <div className="relative h-72 w-full overflow-hidden bg-muted lg:h-96">
        {image?.url ? (
          <img src={image.url} alt={image.alt ?? category.name} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-muted to-muted-foreground/20" />
        )}
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-heading text-4xl text-white lg:text-6xl drop-shadow">{category.name}</h1>
          <p className="mt-2 text-white/80 text-lg">{posts.length} bài viết</p>
        </div>
      </div>

      {/* Banner below hero */}
      {banner && <div className="container max-w-5xl pt-6"><BannerDisplay banner={banner} /></div>}

      {/* Posts grid */}
      <div className="container max-w-5xl py-10">
        {posts.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: any) => {
              const postImage = post.image as { url?: string; alt?: string } | null
              return (
                <Link
                  key={post.id}
                  href={`/posts/${post.id}`}
                  className="group flex flex-col overflow-hidden rounded-lg border transition-shadow hover:shadow-md"
                >
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    {postImage?.url ? (
                      <img src={postImage.url} alt={postImage.alt ?? post.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    ) : (
                      <div className="h-full w-full bg-muted" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1 p-4">
                    <h2 className="font-semibold leading-tight group-hover:underline">{post.title}</h2>
                    <p className="text-xs text-muted-foreground">{formatDate(post.createdAt.toISOString())}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <p className="text-muted-foreground text-center">Chưa có bài viết nào trong danh mục này.</p>
        )}
      </div>
    </div>
  )
}
