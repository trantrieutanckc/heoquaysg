export const dynamic = "force-dynamic"

import Image from "next/image"
import Link from "next/link"
import { db } from "@/lib/db"
import { BLUR_PLACEHOLDER } from "@/lib/image"
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/motion-primitives"

export const metadata = {
  title: "Danh mục",
}

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    where: { published: true },
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  })

  return (
    <div className="min-h-screen">
      {/* Header */}
      <FadeUp>
        <div className="relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #7c2d12 0%, #c2410c 45%, #ea580c 100%)" }}
        >
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
          <div className="container px-4 sm:px-6 py-14 lg:py-20 relative z-10">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-200 mb-3">✦ Thực đơn</p>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-3 text-white drop-shadow-lg">
              Danh mục món ăn
            </h1>
            <div className="flex items-center gap-1.5 mb-4">
              <div className="h-0.5 w-10 bg-white/60 rounded-full" />
              <div className="h-0.5 w-4 bg-white/30 rounded-full" />
            </div>
            <p className="text-orange-100/80 max-w-md text-sm leading-relaxed">
              Khám phá heo quay, vịt quay, gà quay và các món đặc sản theo từng chủ đề.
            </p>
          </div>
        </div>
      </FadeUp>

      <div className="container px-4 sm:px-6 py-10 lg:py-14">
        {categories.length ? (
          <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const image = cat.image as { url?: string; alt?: string } | null
              return (
                <StaggerItem key={cat.id} hover>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="group relative flex flex-col overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 h-full"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                      {image?.url ? (
                        <Image
                          src={image.url}
                          alt={image.alt ?? cat.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          placeholder="blur"
                          blurDataURL={BLUR_PLACEHOLDER}
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center"
                          style={{ background: "linear-gradient(135deg, #431407, #c2410c, #fb923c)" }}
                        >
                          <span className="font-heading text-5xl text-white/30 select-none">
                            {cat.name[0]}
                          </span>
                        </div>
                      )}

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-300" />

                      {/* Badge */}
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center rounded-full bg-black/50 backdrop-blur-sm text-white px-2.5 py-1 text-xs font-semibold">
                          {cat._count.posts} bài
                        </span>
                      </div>

                      {/* Title on image */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h2 className="font-heading text-white text-lg font-bold drop-shadow leading-snug group-hover:text-orange-200 transition-colors">
                          {cat.name}
                        </h2>
                        {(cat as any).description && (
                          <p className="text-white/60 text-xs mt-1 line-clamp-2 leading-relaxed">
                            {(cat as any).description}
                          </p>
                        )}
                      </div>

                      {/* Arrow */}
                      <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
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
