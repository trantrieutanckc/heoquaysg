"use client"

import * as React from "react"
import Link from "next/link"

interface RelatedPost {
  id: string
  title: string
  image: unknown
  categories: { category: { name: string; slug: string } }[]
}

export function RelatedPostsCarousel({ posts }: { posts: RelatedPost[] }) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = React.useState(false)
  const [canNext, setCanNext] = React.useState(true)

  function updateArrows() {
    const el = scrollRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  function slide(dir: "prev" | "next") {
    const el = scrollRef.current
    if (!el) return
    const itemW = el.firstElementChild?.clientWidth ?? 300
    el.scrollBy({ left: dir === "next" ? itemW : -itemW, behavior: "smooth" })
  }

  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateArrows()
    el.addEventListener("scroll", updateArrows, { passive: true })
    const ro = new ResizeObserver(updateArrows)
    ro.observe(el)
    return () => { el.removeEventListener("scroll", updateArrows); ro.disconnect() }
  }, [])

  return (
    <div className="relative group/carousel">
      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 hide-scrollbar"
      >
        {posts.map((p) => {
          const img = p.image as { url?: string; alt?: string } | null
          return (
            <Link
              key={p.id}
              href={`/posts/${p.id}`}
              className="group flex flex-col rounded-xl border bg-card overflow-hidden hover:shadow-md transition-shadow
                snap-start shrink-0
                w-[80vw] sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]"
            >
              <div className="aspect-video overflow-hidden bg-muted">
                {img?.url ? (
                  <img
                    src={img.url}
                    alt={img.alt ?? p.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-muted" />
                )}
              </div>
              <div className="px-4 pb-4 pt-3 flex flex-col gap-1.5">
                <div className="flex flex-wrap gap-1">
                  {p.categories.slice(0, 2).map(({ category }) => (
                    <span key={category.slug} className="text-xs text-primary font-medium">
                      {category.name}
                    </span>
                  ))}
                </div>
                <p className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {p.title}
                </p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Prev button */}
      {canPrev && (
        <button
          onClick={() => slide("prev")}
          aria-label="Trước"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10
            h-9 w-9 rounded-full border bg-background shadow-md
            flex items-center justify-center
            opacity-0 group-hover/carousel:opacity-100 transition-opacity
            hover:bg-muted"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
      )}

      {/* Next button */}
      {canNext && (
        <button
          onClick={() => slide("next")}
          aria-label="Tiếp"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10
            h-9 w-9 rounded-full border bg-background shadow-md
            flex items-center justify-center
            opacity-0 group-hover/carousel:opacity-100 transition-opacity
            hover:bg-muted"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      )}
    </div>
  )
}
