import Link from "next/link"
import Image from "next/image"
import { db } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import { SearchInput } from "@/components/search-input"
import { PageEntrance, FadeUp, StaggerContainer, StaggerItem } from "@/components/motion-primitives"
import { BLUR_PLACEHOLDER } from "@/lib/image"

export const metadata = { title: "Tìm kiếm" }

interface SearchPageProps {
  searchParams: { q?: string }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const q = searchParams.q?.trim() ?? ""

  const posts = q
    ? await db.post.findMany({
        where: {
          published: true,
          title: { contains: q, mode: "insensitive" },
        },
        include: {
          author: { select: { name: true } },
          categories: {
            include: { category: { select: { name: true, slug: true } } },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      })
    : []

  const postImage = (image: unknown) => image as { url?: string; alt?: string } | null

  return (
    <div className="container px-4 sm:px-6 py-8 lg:py-12">
      <PageEntrance className="mb-8">
        <h1 className="font-heading text-3xl sm:text-4xl tracking-tight mb-4">Tìm kiếm</h1>
        <SearchInput defaultValue={q} />
      </PageEntrance>

      {q && (
        <FadeUp>
          <p className="text-sm text-muted-foreground mb-6">
            {posts.length > 0
              ? <><span className="font-semibold text-foreground">{posts.length}</span> kết quả cho &ldquo;<span className="font-semibold text-foreground">{q}</span>&rdquo;</>
              : <>Không tìm thấy kết quả nào cho &ldquo;<span className="font-semibold text-foreground">{q}</span>&rdquo;</>
            }
          </p>
        </FadeUp>
      )}

      {posts.length > 0 && (
        <StaggerContainer className="divide-y divide-border rounded-xl border overflow-hidden">
          {posts.map((post) => {
            const img = postImage(post.image)
            return (
              <StaggerItem key={post.id}>
                <Link
                  href={`/posts/${post.id}`}
                  className="group flex gap-4 p-4 bg-background hover:bg-muted/40 transition-colors"
                >
                  {img?.url && (
                    <div className="relative h-20 w-28 sm:w-32 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={img.url}
                        alt={img.alt ?? post.title}
                        fill
                        sizes="128px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        placeholder="blur"
                        blurDataURL={BLUR_PLACEHOLDER}
                      />
                    </div>
                  )}
                  <div className="flex flex-col justify-center gap-1.5 min-w-0">
                    <h2 className="font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {post.categories.map(({ category }) => (
                        <span
                          key={category.slug}
                          className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium"
                        >
                          {category.name}
                        </span>
                      ))}
                      {post.author?.name && (
                        <span className="text-xs text-muted-foreground">{post.author.name}</span>
                      )}
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{formatDate(post.createdAt.toISOString())}</span>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      )}

      {q && posts.length === 0 && (
        <FadeUp className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 rounded-full bg-muted p-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-muted-foreground">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
          <p className="font-medium mb-1">Không tìm thấy kết quả</p>
          <p className="text-sm text-muted-foreground">Thử tìm với từ khoá khác</p>
        </FadeUp>
      )}

      {!q && (
        <FadeUp className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
          <div className="mb-4 rounded-full bg-muted p-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
          <p className="font-medium mb-1">Tìm kiếm bài viết</p>
          <p className="text-sm">Nhập từ khoá vào ô tìm kiếm phía trên</p>
        </FadeUp>
      )}
    </div>
  )
}
