import Link from "next/link"
import Image from "next/image"
import { BLUR_PLACEHOLDER } from "@/lib/image"
import { formatDate } from "@/lib/utils"

interface RelatedPost {
  id: string
  title: string
  image: unknown
  createdAt: Date
  seoDescription?: string | null
  price?: number | null
  categories: { category: { name: string; slug: string } }[]
}

export function RelatedPostsCarousel({ posts }: { posts: RelatedPost[] }) {
  return (
    <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
      {posts.map((p) => {
        const img = p.image as { url?: string; alt?: string } | null
        const excerpt = p.seoDescription?.replace(/\n+/g, " ").trim()
        return (
          <Link
            key={p.id}
            href={`/posts/${p.id}`}
            className="group flex flex-row sm:flex-col overflow-hidden rounded-xl border bg-card hover:shadow-lg transition-shadow duration-300 h-full"
          >
            <div className="w-40 shrink-0 sm:w-full sm:aspect-[4/3] relative bg-muted overflow-hidden" style={{ minHeight: "7rem" }}>
              {img?.url ? (
                <Image
                  src={img.url}
                  alt={img.alt ?? p.title}
                  fill
                  sizes="(max-width: 640px) 160px, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  placeholder="blur"
                  blurDataURL={BLUR_PLACEHOLDER}
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-muted to-muted-foreground/10" />
              )}
            </div>
            <div className="flex flex-col p-3 sm:p-4 flex-1">
              <div className="flex-1 flex flex-col gap-1.5 mb-3">
                <div className="flex items-center justify-between gap-2">
                  {p.categories.length > 0 && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{p.categories[0].category.name}</span>
                  )}
                  <time className="text-[10px] text-muted-foreground/70 shrink-0" dateTime={p.createdAt.toISOString()}>
                    {formatDate(p.createdAt.toISOString())}
                  </time>
                </div>
                <h3 className="font-heading text-sm sm:text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {p.title}
                </h3>
                {excerpt && (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-1 sm:line-clamp-2">{excerpt}</p>
                )}
                {p.price != null && (
                  <span className="inline-flex items-center bg-primary/10 text-primary px-2 py-0.5 text-xs font-bold w-fit">
                    {new Intl.NumberFormat("vi-VN").format(p.price)} đ
                  </span>
                )}
              </div>
              <span className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 text-xs font-bold uppercase tracking-wider group-hover:bg-primary/90 transition-colors w-fit">
                Xem chi tiết
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
