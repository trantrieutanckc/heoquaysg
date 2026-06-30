"use client"

import { cn } from "@/lib/utils"
import { type BannerConfig, type BannerSlide, emptySlide } from "@/lib/banner"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { ImageUploader } from "@/components/admin/image-uploader"

interface Props {
  bannerType: "banner" | "slide"
  bannerSlides: BannerSlide[]
  bannerConfig: BannerConfig | null
  isSaving: boolean
  onTypeChange: (type: "banner" | "slide") => void
  onSlidesChange: (slides: BannerSlide[]) => void
  onSave: () => void
}

export function EditorBannerSection({
  bannerType,
  bannerSlides,
  bannerConfig,
  isSaving,
  onTypeChange,
  onSlidesChange,
  onSave,
}: Props) {
  const shownSlides = bannerType === "banner" ? bannerSlides.slice(0, 1) : bannerSlides

  function updateSlide(index: number, field: keyof BannerSlide, val: string) {
    onSlidesChange(bannerSlides.map((s, i) => (i === index ? { ...s, [field]: val } : s)))
  }

  return (
    <AccordionItem value="banner">
      <AccordionTrigger className="text-base font-medium">
        Banner
        {bannerConfig && (
          <span className="ml-2 text-xs text-primary font-normal">
            {bannerConfig.type === "slide" ? `${bannerConfig.slides.length} slide` : "1 ảnh"}
          </span>
        )}
      </AccordionTrigger>
      <AccordionContent>
        <div className="grid gap-4 pt-2">
          <div className="grid grid-cols-2 gap-2">
            {(["banner", "slide"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  onTypeChange(t)
                  if (bannerSlides.length === 0) onSlidesChange([emptySlide()])
                }}
                className={cn(
                  "rounded-lg border p-3 text-sm text-left transition-colors",
                  bannerType === t ? "border-primary bg-primary/5 text-primary" : "hover:bg-muted"
                )}
              >
                <div className="font-medium">{t === "banner" ? "Banner" : "Slide"}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {t === "banner" ? "1 ảnh tĩnh" : "Nhiều ảnh xoay vòng"}
                </div>
              </button>
            ))}
          </div>

          <div className="grid gap-4">
            {shownSlides.map((slide, index) => (
              <div key={index} className="rounded-lg border p-4 grid gap-3">
                {bannerType === "slide" && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Slide {index + 1}</span>
                    {bannerSlides.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onSlidesChange(bannerSlides.filter((_, i) => i !== index))}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Icons.trash className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                )}
                <div className="grid gap-2">
                  <Label>Ảnh <span className="text-destructive">*</span></Label>
                  <ImageUploader value={slide.image} onChange={(url) => updateSlide(index, "image", url)} />
                </div>
                <div className="grid gap-2">
                  <Label>Video URL <span className="text-xs text-muted-foreground font-normal">(YouTube hoặc .mp4 — ưu tiên hơn ảnh)</span></Label>
                  <Input
                    placeholder="https://youtube.com/watch?v=... hoặc https://.../video.mp4"
                    value={slide.video ?? ""}
                    onChange={(e) => updateSlide(index, "video", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Tiêu đề</Label>
                  <Input
                    placeholder="Tiêu đề banner"
                    value={slide.title ?? ""}
                    onChange={(e) => updateSlide(index, "title", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Mô tả ngắn</Label>
                  <Input
                    placeholder="Mô tả ngắn (tuỳ chọn)"
                    value={slide.description ?? ""}
                    onChange={(e) => updateSlide(index, "description", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label>Link URL</Label>
                    <Input
                      placeholder="https://..."
                      value={slide.linkUrl ?? ""}
                      onChange={(e) => updateSlide(index, "linkUrl", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Nút CTA</Label>
                    <Input
                      placeholder="Xem ngay..."
                      value={slide.linkText ?? ""}
                      onChange={(e) => updateSlide(index, "linkText", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            {bannerType === "slide" && bannerSlides.length < 10 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onSlidesChange([...bannerSlides, emptySlide()])}
                className="w-full"
              >
                <Icons.add className="mr-2 h-4 w-4" />
                Thêm slide
              </Button>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Lưu banner
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
