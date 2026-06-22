import Link from "next/link"
import { db } from "@/lib/db"

export const metadata = {
  title: "Danh mục",
}

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  })

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-muted/30">
        <div className="container max-w-6xl px-4 sm:px-6 py-12 lg:py-16">
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-3">
            Danh mục
          </h1>
          <p className="text-muted-foreground text-lg">
            Khám phá nội dung theo từng chủ đề.
          </p>
        </div>
      </div>

      <div className="container max-w-6xl px-4 sm:px-6 py-10 lg:py-14">
        {categories.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const image = cat.image as { url?: string; alt?: string } | null
              return (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border bg-card hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-muted relative">
                    {image?.url ? (
                      <img
                        src={image.url}
                        alt={image.alt ?? cat.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-primary/20 via-muted to-muted-foreground/10 flex items-center justify-center">
                        <span className="font-heading text-3xl text-muted-foreground/40 select-none">
                          {cat.name[0]}
                        </span>
                      </div>
                    )}
                    {/* Post count badge */}
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center rounded-full bg-black/50 backdrop-blur-sm text-white px-2.5 py-0.5 text-xs font-medium">
                        {cat._count.posts} bài
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h2 className="font-heading text-lg group-hover:text-primary transition-colors">
                      {cat.name}
                    </h2>
                    {(cat as any).description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {(cat as any).description}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="font-medium mb-1">Chưa có danh mục nào</p>
            <p className="text-sm text-muted-foreground">Hãy tạo danh mục đầu tiên trong dashboard.</p>
          </div>
        )}
      </div>
    </div>
  )
}
