import Link from "next/link"
import { db } from "@/lib/db"

export const metadata = {
  title: "Categories",
}

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  })

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block font-heading text-4xl tracking-tight lg:text-5xl">
            Categories
          </h1>
          <p className="text-xl text-muted-foreground">
            Khám phá các danh mục bài viết.
          </p>
        </div>
      </div>
      <hr className="my-8" />
      {categories.length ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {categories.map((cat) => {
            const image = cat.image as { url?: string; alt?: string; title?: string } | null
            return (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group flex flex-col overflow-hidden rounded-lg border bg-background transition-shadow hover:shadow-md"
              >
                {image?.url ? (
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    <img
                      src={image.url}
                      alt={image.alt ?? cat.name}
                      title={image.title ?? ""}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="aspect-video w-full bg-muted" />
                )}
                <div className="flex flex-col gap-1 p-4">
                  <h2 className="font-semibold text-lg">{cat.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {cat._count.posts} bài viết
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <p className="text-muted-foreground">Chưa có category nào.</p>
      )}
    </div>
  )
}
