"use client"

import * as React from "react"
import Link from "next/link"
import { type BannerConfig } from "@/lib/banner"

interface BannerDisplayProps {
  banner: BannerConfig
}

function getYoutubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

function isDirectVideo(url: string) {
  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url)
}

function SlideMedia({ slide, active }: { slide: { image: string; video?: string; title?: string }; active: boolean }) {
  const youtubeId = slide.video ? getYoutubeId(slide.video) : null
  const isDirect = slide.video ? isDirectVideo(slide.video) : false

  if (youtubeId) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=${active ? 1 : 0}&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0`}
        className="absolute inset-0 h-full w-full object-cover border-0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        title={slide.title ?? "Video"}
      />
    )
  }

  if (isDirect && slide.video) {
    return (
      <video
        src={slide.video}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay={active}
        muted
        loop
        playsInline
      />
    )
  }

  return (
    <img
      src={slide.image}
      alt={slide.title ?? ""}
      className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
    />
  )
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

  const hasContent = slide.title || slide.description || slide.linkUrl

  return (
    <div className="relative w-full overflow-hidden rounded-lg">
      <div className="relative aspect-[21/7] min-h-[160px] max-h-[420px] w-full bg-muted">
        <SlideMedia slide={slide} active={true} />

        {hasContent && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        )}
        {hasContent && (
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
