export const dynamic = "force-dynamic"

import Image from "next/image"
import Link from "next/link"
import { db } from "@/lib/db"
import { BLUR_PLACEHOLDER } from "@/lib/image"
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/motion-primitives"

export const metadata = {
  title: "Danh mục & Mô tả",
}

export default async function CatDesPage() {
  const categories = await db.category.findMany({
    where: { published: true },
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  })

  return (
    <div className="min-h-screen">
      <FadeUp>
        <div className="border-b bg-card">
          <div className="container px-4 sm:px-6 py-12 lg:py-16">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-2">Thực đơn</p>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-3">
              Danh mục & Mô tả
            </h1>
            <div className="flex items-center gap-1.5 mb-4">
              <div className="h-0.5 w-10 bg-primary rounded-full" />
              <div className="h-0.5 w-4 bg-primary/40 rounded-full" />
            </div>
            <p className="text-muted-foreground max-w-md">
              Tìm hiểu chi tiết từng danh mục món ăn đặc sản của chúng tôi.
            </p>
          </div>
        </div>
      </FadeUp>

      <div className="container px-4 sm:px-6 py-10 lg:py-14">
        {categories.length ? (
          // Mobile: 1 cột nằm ngang | Tablet+: grid nhiều cột dọc
          <StaggerContainer className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5">
            {categories.map((cat) => {
              const image = cat.image as { url?: string; alt?: string } | null
              return (
                <StaggerItem key={cat.id} hover>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="group flex flex-row md:flex-col overflow-hidden rounded-2xl border bg-card hover:shadow-lg transition-shadow duration-300 h-full"
                  >
                    {/* Ảnh: mobile nhỏ bên trái, tablet+ full width trên đầu */}
                    <div className="w-28 shrink-0 md:w-full md:aspect-[16/9] relative bg-muted overflow-hidden" style={{ minHeight: '7rem' }}>
                      {image?.url ? (
                        <Image
                          src={image.url}
                          alt={image.alt ?? cat.name}
                          fill
                          sizes="(max-width: 768px) 112px, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          placeholder="blur"
                          blurDataURL={BLUR_PLACEHOLDER}
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-primary/20 via-muted to-muted-foreground/10 flex items-center justify-center">
                          <span className="font-heading text-3xl text-muted-foreground/40 select-none">
                            {cat.name[0]}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Nội dung */}
                    <div className="flex-1 p-4 md:p-5 flex flex-col justify-center md:justify-start gap-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="font-heading text-base md:text-lg group-hover:text-primary transition-colors">
                          {cat.name}
                        </h2>
                        <span className="inline-flex items-center rounded-full bg-muted text-muted-foreground px-2 py-0.5 text-xs font-medium shrink-0">
                          {cat._count.posts} bài
                        </span>
                      </div>
                      {cat.description ? (
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {cat.description}
                        </p>
                      ) : (
                        <p className="text-muted-foreground/40 text-sm italic">Chưa có mô tả.</p>
                      )}
                      <span className="text-xs text-primary font-medium group-hover:underline mt-1">
                        Xem tất cả bài →
                      </span>
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
