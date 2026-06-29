"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import TextareaAutosize from "react-textarea-autosize"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { toast } from "@/components/ui/use-toast"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { SeoPanel } from "@/components/seo-panel"
import { ImageUploader } from "@/components/image-uploader"
import { type BannerConfig, type BannerSlide, emptySlide, parseBanner } from "@/lib/banner"
import { TiptapEditor } from "@/components/tiptap-editor"
import { editorJsToTiptap, isTiptapContent } from "@/lib/editorjs-to-tiptap"

interface PageEditorProps {
  page: {
    id: string
    title: string
    slug: string
    content: unknown
    published: boolean
    image?: unknown
    seoTitle?: string | null
    seoDescription?: string | null
    seoKeywords?: string | null
    seoImage?: string | null
    banner?: unknown
  }
}

export function PageEditor({ page }: PageEditorProps) {
  const router = useRouter()
  const [isMounted, setIsMounted] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)

  const initialContent = React.useMemo(() => {
    const raw = page.content
    const parsed = typeof raw === "string" ? (() => { try { return JSON.parse(raw) } catch { return null } })() : raw
    return isTiptapContent(parsed) ? parsed as object : editorJsToTiptap(parsed)
  }, [])
  const [tiptapContent, setTiptapContent] = React.useState<object>(initialContent)
  const [title, setTitle] = React.useState(page.title)
  const [slug] = React.useState(page.slug)
  const [published, setPublished] = React.useState(page.published)
  const [imageTab, setImageTab] = React.useState<"upload" | "url">("upload")

  // Image
  const [imageUrl, setImageUrl] = React.useState(
    (page.image as { url?: string } | null)?.url ?? ""
  )
  const [imageAlt, setImageAlt] = React.useState(
    (page.image as { alt?: string } | null)?.alt ?? ""
  )

  // SEO
  const [seoTitle, setSeoTitle] = React.useState(page.seoTitle ?? "")
  const [seoDescription, setSeoDescription] = React.useState(page.seoDescription ?? "")
  const [seoKeywords, setSeoKeywords] = React.useState(page.seoKeywords ?? "")
  const [seoImage, setSeoImage] = React.useState(page.seoImage ?? "")

  // Banner
  const initialBanner = parseBanner(page.banner)
  const [bannerType, setBannerType] = React.useState<"banner" | "slide">(
    initialBanner?.type ?? "banner"
  )
  const [bannerSlides, setBannerSlides] = React.useState<BannerSlide[]>(
    initialBanner?.slides.length ? initialBanner.slides : [emptySlide()]
  )
  const [savingBanner, setSavingBanner] = React.useState(false)

  React.useEffect(() => setIsMounted(true), [])

  async function handleSave() {
    setIsSaving(true)
    try {
      const res = await fetch(`/api/pages/${page.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          content: tiptapContent,
          published,
          image: imageUrl ? { url: imageUrl, alt: imageAlt } : null,
          seoTitle: seoTitle || null,
          seoDescription: seoDescription || null,
          seoKeywords: seoKeywords || null,
          seoImage: seoImage || null,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast({ title: "Lỗi", description: data.error ?? "Không thể lưu trang.", variant: "destructive" })
        return
      }
      toast({ description: "Đã lưu trang." })
      router.refresh()
    } finally {
      setIsSaving(false)
    }
  }

  async function handleBannerSave() {
    setSavingBanner(true)
    try {
      const validSlides = bannerSlides.filter((s) => s.image.trim() || s.video?.trim())
      const bannerValue: BannerConfig | null = validSlides.length
        ? { type: bannerType, slides: validSlides }
        : null
      await fetch(`/api/pages/${page.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banner: bannerValue }),
      })
      toast({ description: "Đã lưu banner." })
    } finally {
      setSavingBanner(false)
    }
  }

  function updateSlide(index: number, field: keyof BannerSlide, val: string) {
    setBannerSlides((prev) => prev.map((s, i) => i === index ? { ...s, [field]: val } : s))
  }

  const shownSlides = bannerType === "banner" ? bannerSlides.slice(0, 1) : bannerSlides

  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Sticky header ──────────────────────────────────── */}
      <div className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-14 items-center justify-between px-4 gap-4">
          <button
            onClick={() => router.push("/dashboard/pages")}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            <Icons.chevronLeft className="mr-1 h-4 w-4" />
            Trang
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPublished((v) => !v)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                published
                  ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", published ? "bg-green-500" : "bg-muted-foreground")} />
              {published ? "Đã đăng" : "Nháp"}
            </button>

            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              {isSaving && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Lưu
            </Button>
          </div>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────── */}
      <div className="container max-w-4xl px-4 py-8 pb-16 space-y-6">

        {/* Title */}
        <TextareaAutosize
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tiêu đề trang"
          className="w-full resize-none appearance-none overflow-hidden bg-transparent text-4xl font-bold leading-tight focus:outline-none placeholder:text-muted-foreground/50"
        />

        <hr />

        {/* TipTap Editor */}
        {isMounted && (
          <TiptapEditor
            content={tiptapContent}
            onChange={setTiptapContent}
          />
        )}

        <hr />

        {/* ── Accordion panels ─────────────────────────────── */}
        <Accordion type="multiple" className="w-full">

          {/* Ảnh bìa */}
          <AccordionItem value="image">
            <AccordionTrigger className="text-base font-medium">
              Ảnh bìa
              {imageUrl && <span className="ml-2 text-xs text-muted-foreground font-normal truncate max-w-[200px]">{imageUrl}</span>}
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4 pt-2">
                <div className="flex gap-1 rounded-md border bg-muted p-1">
                  <button
                    type="button"
                    onClick={() => setImageTab("upload")}
                    className={cn("flex-1 rounded py-1.5 text-sm font-medium transition-colors",
                      imageTab === "upload" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Tải lên
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageTab("url")}
                    className={cn("flex-1 rounded py-1.5 text-sm font-medium transition-colors",
                      imageTab === "url" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    URL
                  </button>
                </div>

                {imageTab === "upload" ? (
                  <ImageUploader value={imageUrl} onChange={(url) => setImageUrl(url)} />
                ) : (
                  <div className="grid gap-2">
                    <Label>URL ảnh</Label>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                  </div>
                )}

                <div className="grid gap-2">
                  <Label>Alt text</Label>
                  <Input
                    placeholder="Mô tả ảnh"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Ảnh bìa sẽ được lưu khi nhấn <strong>Lưu</strong> phía trên.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Banner */}
          <AccordionItem value="banner">
            <AccordionTrigger className="text-base font-medium">Banner</AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4 pt-2">
                {/* Type selector */}
                <div className="grid grid-cols-2 gap-2">
                  {(["banner", "slide"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setBannerType(t)
                        if (bannerSlides.length === 0) setBannerSlides([emptySlide()])
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

                {/* Slides */}
                <div className="grid gap-4">
                  {shownSlides.map((slide, index) => (
                    <div key={index} className="rounded-lg border p-4 grid gap-3">
                      {bannerType === "slide" && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Slide {index + 1}</span>
                          {bannerSlides.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setBannerSlides((prev) => prev.filter((_, i) => i !== index))}
                              className="text-destructive hover:text-destructive/80"
                            >
                              <Icons.trash className="h-3.5 w-3.5" />
                            </button>
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
                      onClick={() => setBannerSlides((prev) => [...prev, emptySlide()])}
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
                  onClick={handleBannerSave}
                  disabled={savingBanner}
                >
                  {savingBanner && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                  Lưu banner
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* SEO */}
          <AccordionItem value="seo">
            <AccordionTrigger className="text-base font-medium">SEO</AccordionTrigger>
            <AccordionContent>
              <div className="pt-2">
                <SeoPanel
                  seoTitle={seoTitle}
                  seoDescription={seoDescription}
                  seoKeywords={seoKeywords}
                  seoImage={seoImage}
                  previewTitle={title}
                  onChange={(field, value) => {
                    if (field === "seoTitle") setSeoTitle(value)
                    if (field === "seoDescription") setSeoDescription(value)
                    if (field === "seoKeywords") setSeoKeywords(value)
                    if (field === "seoImage") setSeoImage(value)
                  }}
                />
                <p className="text-xs text-muted-foreground mt-4">SEO sẽ được lưu khi nhấn <strong>Lưu</strong> phía trên.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>
    </div>
  )
}
