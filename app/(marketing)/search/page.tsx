import Link from "next/link"
import { db } from "@/lib/db"
import { formatDate } from "@/lib/utils"
import { SearchInput } from "@/components/search-input"

export const metadata = { title: "Tìm kiếm" }

interface SearchPageProps {
  searchParams: { q?: string }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const q = searchParams.q?.trim() ?? ""

  const posts = q
    ? await db.post.findMany({
        where: {
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

  const postImage = (image: unknown) =>
    image as { url?: string; alt?: string } | null

  return (
    <div className="container max-w-3xl py-6 lg:py-10">
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="font-heading text-4xl tracking-tight">Tìm kiếm</h1>
        <SearchInput defaultValue={q} />
      </div>

      {q && (
        <p className="text-sm text-muted-foreground mb-6">
          {posts.length > 0
            ? `Tìm thấy ${posts.length} bài viết cho "${q}"`
            : `Không tìm thấy bài viết nào cho "${q}"`}
        </p>
      )}

      {posts.length > 0 && (
        <div className="grid gap-4">
          {posts.map((post) => {
            const img = postImage(post.image)
            return (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="group flex gap-4 rounded-lg border p-4 transition-shadow hover:shadow-md"
              >
                {img?.url && (
                  <div className="h-20 w-32 shrink-0 overflow-hidden rounded-md bg-muted">
                    <img
                      src={img.url}
                      alt={img.alt ?? post.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-1 min-w-0">
                  <h2 className="font-semibold text-lg group-hover:underline truncate">
                    {post.title}
                  </h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    {post.author?.name && (
                      <span className="text-xs text-muted-foreground">
                        {post.author.name}
                      </span>
                    )}
                    {post.categories.map(({ category }) => (
                      <span
                        key={category.slug}
                        className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(post.createdAt.toISOString())}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {!q && (
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
          <p>Nhập từ khoá để tìm kiếm bài viết.</p>
        </div>
      )}
    </div>
  )
}
