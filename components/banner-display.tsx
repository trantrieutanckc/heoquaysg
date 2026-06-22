"use client"

import * as React from "react"
import Link from "next/link"
import { type BannerConfig } from "@/lib/banner"

interface BannerDisplayProps {
  banner: BannerConfig
}

export function BannerDisplay({ banner }: BannerDisplayProps) {
  const [current, setCurrent] = React.useState(0)
  const slides = banner.slides

  React.useEffect(() => {
    if (banner.type !== "slide" || slides.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [banner.type, slides.length])

  const slide = slides[current]
  if (!slide) return null

  return (
    <div className="relative w-full overflow-hidden rounded-lg">
      {/* Image */}
      <div className="relative aspect-[21/7] min-h-[160px] max-h-[420px] w-full bg-muted">
        <img
          key={current}
          src={slide.image}
          alt={slide.title ?? ""}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
        />
        {/* Overlay khi có text */}
        {(slide.title || slide.description || slide.linkUrl) && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        )}
        {/* Content */}
        {(slide.title || slide.description || slide.linkUrl) && (
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
            {slide.title && (
              <h2 className="text-lg md:text-2xl font-bold mb-1 line-clamp-2">{slide.title}</h2>
            )}
            {slide.description && (
              <p className="text-sm md:text-base text-white/80 mb-3 line-clamp-2">{slide.description}</p>
            )}
            {slide.linkUrl && (
              <Link
                href={slide.linkUrl}
                className="inline-flex items-center rounded-md bg-white px-4 py-1.5 text-sm font-medium text-black hover:bg-white/90 transition-colors"
              >
                {slide.linkText || "Xem thêm"}
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Dots navigation (slide mode) */}
      {banner.type === "slide" && slides.length > 1 && (
        <div className="absolute bottom-3 right-4 flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === current ? "w-4 bg-white" : "w-1.5 bg-white/50"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
