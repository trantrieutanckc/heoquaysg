import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import type { CategoryTemplate } from "@/lib/templates"
import { parseBanner } from "@/lib/banner"
import { BannerDisplay } from "@/components/banner-display"
import { PageEntrance, FadeUp, StaggerContainer, StaggerItem } from "@/components/motion-primitives"

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

// ─── Shared post card (vertical) ─────────────────────────────────────────────
function PostCard({ post }: { post: any }) {
  const postImage = post.image as { url?: string; alt?: string } | null
  return (
    <Link
      href={`/posts/${post.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border bg-card hover:shadow-lg transition-all duration-300"
    >
      <div className="aspect-[16/9] overflow-hidden bg-muted">
        {postImage?.url ? (
          <img
            src={postImage.url}
            alt={postImage.alt ?? post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-muted to-muted-foreground/10" />
        )}
      </div>
      <div className="flex flex-col gap-2 p-4">
        <h2 className="font-heading text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h2>
        <time className="text-xs text-muted-foreground">{formatDate(post.createdAt.toISOString())}</time>
      </div>
    </Link>
  )
}

// ─── Standard template ────────────────────────────────────────────────────────
function StandardTemplate({ category, image, posts, banner }: any) {
  return (
    <div className="min-h-screen">
      <PageEntrance>
        <div className="border-b bg-muted/30">
          <div className="container max-w-5xl px-4 sm:px-6 py-12 lg:py-16">
            {image?.url && (
              <div className="mb-6 overflow-hidden rounded-2xl" style={{ maxHeight: 260 }}>
                <img src={image.url} alt={image.alt ?? category.name} className="h-full w-full object-cover" style={{ maxHeight: 260 }} />
              </div>
            )}
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
      </PageEntrance>

      <div className="container max-w-5xl px-4 sm:px-6 py-10 lg:py-14">
        {banner && <FadeUp className="mb-10"><BannerDisplay banner={banner} /></FadeUp>}
        {posts.length ? (
          <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
    </div>
  )
}

// ─── Grid template ────────────────────────────────────────────────────────────
function GridTemplate({ category, image, posts, banner }: any) {
  return (
    <div className="min-h-screen">
      <PageEntrance>
        <div className="border-b bg-muted/30">
          <div className="container max-w-6xl px-4 sm:px-6 py-12 lg:py-16">
            {image?.url && (
              <div className="mb-6 overflow-hidden rounded-2xl" style={{ maxHeight: 260 }}>
                <img src={image.url} alt={image.alt ?? category.name} className="h-full w-full object-cover" style={{ maxHeight: 260 }} />
              </div>
            )}
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
      </PageEntrance>

      <div className="container max-w-6xl px-4 sm:px-6 py-10 lg:py-14">
        {banner && <FadeUp className="mb-10"><BannerDisplay banner={banner} /></FadeUp>}
        {posts.length ? (
          <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
    </div>
  )
}

// ─── Hero template ────────────────────────────────────────────────────────────
function HeroTemplate({ category, image, posts, banner }: any) {
  return (
    <div className="min-h-screen">
      <div className="relative h-72 w-full overflow-hidden lg:h-[420px]">
        {image?.url ? (
          <img src={image.url} alt={image.alt ?? category.name} className="h-full w-full object-cover" />
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

      <div className="container max-w-6xl px-4 sm:px-6 py-10 lg:py-14 pb-20 lg:pb-28">
        {banner && <FadeUp className="mb-10"><BannerDisplay banner={banner} /></FadeUp>}
        {posts.length ? (
          <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
    </div>
  )
}
