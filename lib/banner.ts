export type BannerSlide = {
  image: string
  title?: string
  description?: string
  linkUrl?: string
  linkText?: string
}

export type BannerConfig = {
  type: "banner" | "slide"
  slides: BannerSlide[]
}

export function parseBanner(raw: unknown): BannerConfig | null {
  if (!raw || typeof raw !== "object") return null
  const b = raw as any
  if (b.type !== "banner" && b.type !== "slide") return null
  if (!Array.isArray(b.slides)) return null
  return b as BannerConfig
}

export const emptySlide = (): BannerSlide => ({
  image: "",
  title: "",
  description: "",
  linkUrl: "",
  linkText: "",
})
