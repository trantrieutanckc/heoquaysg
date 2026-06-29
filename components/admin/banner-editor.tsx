"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Icons } from "@/components/icons"
import { ImageUploader } from "@/components/admin/image-uploader"
import { type BannerConfig, type BannerSlide, emptySlide } from "@/lib/banner"

interface BannerEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  value: BannerConfig | null
  onSave: (value: BannerConfig | null) => void
  saving?: boolean
}

export function BannerEditor({
  open, onOpenChange, title = "Banner", value, onSave, saving,
}: BannerEditorProps) {
  const [type, setType] = React.useState<"banner" | "slide">("banner")
  const [slides, setSlides] = React.useState<BannerSlide[]>([emptySlide()])

  // Sync state when dialog opens
  React.useEffect(() => {
    if (open) {
      if (!value) {
        setType("banner")
        setSlides([emptySlide()])
      } else {
        setType(value.type)
        setSlides(value.slides.length ? value.slides : [emptySlide()])
      }
    }
  }, [open, value])

  function updateSlide(index: number, field: keyof BannerSlide, val: string) {
    setSlides((prev) => prev.map((s, i) => i === index ? { ...s, [field]: val } : s))
  }

  function addSlide() {
    setSlides((prev) => [...prev, emptySlide()])
  }

  function removeSlide(index: number) {
    setSlides((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSave() {
    const validSlides = slides.filter((s) => s.image.trim())
    if (!validSlides.length) {
      onSave(null)
      return
    }
    onSave({ type, slides: validSlides })
  }

  const maxSlides = type === "banner" ? 1 : 10
  const shownSlides = type === "banner" ? slides.slice(0, 1) : slides

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* Type selector */}
        <div className="grid grid-cols-2 gap-2 pb-2">
          {(["banner", "slide"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setType(t)
                if (slides.length === 0) setSlides([emptySlide()])
              }}
              className={`rounded-lg border p-3 text-sm font-medium transition-colors text-left ${
                type === t ? "border-primary bg-primary/5 text-primary" : "hover:bg-muted"
              }`}
            >
              <div className="font-medium capitalize">
                {t === "banner" ? "Banner" : "Slide"}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {t === "banner" && "1 ảnh tĩnh"}
                {t === "slide" && "Nhiều ảnh xoay vòng"}
              </div>
            </button>
          ))}
        </div>

        {/* Slide forms */}
        <div className="grid gap-4">
            {shownSlides.map((slide, index) => (
              <div key={index} className="rounded-lg border p-4 grid gap-3">
                {type === "slide" && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Slide {index + 1}</span>
                    {slides.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSlide(index)}
                        className="h-7 px-2 text-destructive hover:text-destructive"
                      >
                        <Icons.trash className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                )}

                <div className="grid gap-2">
                  <Label>Ảnh <span className="text-destructive">*</span></Label>
                  <ImageUploader
                    value={slide.image}
                    onChange={(url) => updateSlide(index, "image", url)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Tiêu đề</Label>
                  <Input
                    placeholder="Tiêu đề hiển thị trên banner"
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
                      placeholder="Xem ngay, Đặt hàng..."
                      value={slide.linkText ?? ""}
                      onChange={(e) => updateSlide(index, "linkText", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            {type === "slide" && slides.length < maxSlides && (
              <Button type="button" variant="outline" size="sm" onClick={addSlide} className="w-full">
                <Icons.add className="mr-2 h-4 w-4" />
                Thêm slide
              </Button>
            )}
          </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Huỷ</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Lưu banner
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
