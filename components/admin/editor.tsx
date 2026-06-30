"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Post } from "@prisma/client"
import { useForm } from "react-hook-form"
import TextareaAutosize from "react-textarea-autosize"
import * as z from "zod"
import { format } from "date-fns"
import { Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { postPatchSchema } from "@/lib/validations/post"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { CategorySelector } from "@/components/admin/category-selector"
import { SeoPanel } from "@/components/admin/seo-panel"
import { ImageUploader } from "@/components/admin/image-uploader"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { POST_TEMPLATES } from "@/lib/templates"
import { type BannerConfig, type BannerSlide, emptySlide, parseBanner } from "@/lib/banner"
import { RelatedPostSelector } from "@/components/admin/related-post-selector"
import { TiptapEditor } from "@/components/admin/tiptap-editor"
import { editorJsToTiptap, isTiptapContent } from "@/lib/editorjs-to-tiptap"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface Category {
  id: string
  name: string
  slug: string
}

interface PostOption {
  id: string
  title: string
}

interface EditorProps {
  post: Pick<Post, "id" | "title" | "content" | "published" | "image" | "seoTitle" | "seoDescription" | "seoKeywords" | "seoImage"> & {
    template?: string
    banner?: unknown
    relatedPostIds?: unknown
    price?: number | null
    scheduledAt?: Date | string | null
    bookable?: boolean
  }
  categories: Category[]
  postCategoryIds: string[]
  allPosts: PostOption[]
}

type FormData = z.infer<typeof postPatchSchema>

export function Editor({ post, categories, postCategoryIds, allPosts }: EditorProps) {
  const { register, handleSubmit, watch } = useForm<FormData>({
    resolver: zodResolver(postPatchSchema),
    defaultValues: { title: post.title, content: post.content },
  })
  const router = useRouter()
  const initialPostRef = React.useRef(post)

  const initialContent = React.useMemo(() => {
    const raw = initialPostRef.current.content
    const parsed = typeof raw === "string" ? (() => { try { return JSON.parse(raw) } catch { return null } })() : raw
    return isTiptapContent(parsed) ? parsed as object : editorJsToTiptap(parsed)
  }, [])
  const [tiptapContent, setTiptapContent] = React.useState<object>(initialContent)

  const [isSaving, setIsSaving] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false)
  const [isPublished, setIsPublished] = React.useState(post.published)
  const [isPublishing, setIsPublishing] = React.useState(false)

  // Schedule
  const initScheduled = post.scheduledAt ? new Date(post.scheduledAt) : undefined
  const [scheduledAt, setScheduledAt] = React.useState<Date | undefined>(initScheduled)
  const [scheduleOpen, setScheduleOpen] = React.useState(false)
  const [scheduleDate, setScheduleDate] = React.useState<Date | undefined>(initScheduled)
  const [scheduleTime, setScheduleTime] = React.useState(
    initScheduled ? format(initScheduled, "HH:mm") : "09:00"
  )
  const [isScheduling, setIsScheduling] = React.useState(false)

  // Danh mục & bài liên quan
  const [selectedCategoryIds, setSelectedCategoryIds] = React.useState<string[]>(postCategoryIds)
  const [relatedPostIds, setRelatedPostIds] = React.useState<string[]>(
    Array.isArray(post.relatedPostIds) ? (post.relatedPostIds as string[]) : []
  )

  // Giá
  const [price, setPrice] = React.useState(post.price != null ? String(post.price) : "")

  // Đặt lịch
  const [bookable, setBookable] = React.useState(post.bookable ?? false)
  const [isSavingBookable, setIsSavingBookable] = React.useState(false)

  async function handleBookableToggle() {
    const next = !bookable
    setBookable(next)
    setIsSavingBookable(true)
    try {
      await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookable: next }),
      })
      toast({ variant: "success", description: next ? "Bài đã hiện trên trang đặt lịch." : "Bài đã ẩn khỏi trang đặt lịch." })
    } finally {
      setIsSavingBookable(false)
    }
  }

  // Ảnh bìa
  const [imageTab, setImageTab] = React.useState<"upload" | "url">("upload")
  const [imageUrl, setImageUrl] = React.useState((post.image as { url?: string } | null)?.url ?? "")
  const [imageAlt, setImageAlt] = React.useState((post.image as { alt?: string } | null)?.alt ?? "")
  const [imageTitle, setImageTitle] = React.useState((post.image as { title?: string } | null)?.title ?? "")

  // Template
  const [postTemplate, setPostTemplate] = React.useState(post.template ?? "standard")

  // Banner
  const initialBanner = parseBanner(post.banner)
  const [bannerType, setBannerType] = React.useState<"banner" | "slide">(initialBanner?.type ?? "banner")
  const [bannerSlides, setBannerSlides] = React.useState<BannerSlide[]>(
    initialBanner?.slides.length ? initialBanner.slides : [emptySlide()]
  )
  const [savingBanner, setSavingBanner] = React.useState(false)
  const [bannerConfig, setBannerConfig] = React.useState<BannerConfig | null>(initialBanner)

  // SEO
  const [seoTitle, setSeoTitle] = React.useState((post.seoTitle as string) ?? "")
  const [seoDescription, setSeoDescription] = React.useState((post.seoDescription as string) ?? "")
  const [seoKeywords, setSeoKeywords] = React.useState((post.seoKeywords as string) ?? "")
  const [seoImage, setSeoImage] = React.useState((post.seoImage as string) ?? "")

  const shownSlides = bannerType === "banner" ? bannerSlides.slice(0, 1) : bannerSlides

  React.useEffect(() => {
    if (typeof window !== "undefined") setIsMounted(true)
  }, [])

  // ── Handlers ────────────────────────────────────────────────
  async function handlePublishToggle() {
    setIsPublishing(true)
    try {
      const next = !isPublished
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: next }),
      })
      if (res.ok) {
        setIsPublished(next)
        setScheduledAt(undefined)
        router.refresh()
        toast({ variant: "success", description: next ? "Đã đăng bài." : "Đã chuyển về bản nháp." })
      } else {
        toast({ title: "Lỗi", description: "Không thể thay đổi trạng thái.", variant: "destructive" })
      }
    } finally {
      setIsPublishing(false)
    }
  }

  async function handleScheduleSave() {
    if (!scheduleDate) return
    const [h, m] = scheduleTime.split(":").map(Number)
    const dt = new Date(scheduleDate)
    dt.setHours(h, m, 0, 0)
    if (dt <= new Date()) {
      toast({ title: "Lỗi", description: "Thời gian phải ở tương lai.", variant: "destructive" })
      return
    }
    setIsScheduling(true)
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduledAt: dt.toISOString() }),
      })
      if (res.ok) {
        setScheduledAt(dt)
        setScheduleOpen(false)
        toast({ variant: "success", description: `Đã lên lịch đăng lúc ${format(dt, "HH:mm dd/MM/yyyy")}.` })
      } else {
        toast({ title: "Lỗi", description: "Không thể lưu lịch.", variant: "destructive" })
      }
    } finally {
      setIsScheduling(false)
    }
  }

  async function handleCancelSchedule() {
    setIsScheduling(true)
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduledAt: null }),
      })
      if (res.ok) {
        setScheduledAt(undefined)
        setScheduleDate(undefined)
        setScheduleTime("09:00")
        setScheduleOpen(false)
        toast({ variant: "success", description: "Đã huỷ lịch đăng bài." })
      }
    } finally {
      setIsScheduling(false)
    }
  }

  async function handleBannerSave() {
    setSavingBanner(true)
    try {
      const validSlides = bannerSlides.filter((s) => s.image.trim() || s.video?.trim())
      const value: BannerConfig | null = validSlides.length ? { type: bannerType, slides: validSlides } : null
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banner: value }),
      })
      if (res.ok) {
        setBannerConfig(value)
        toast({ variant: "success", description: "Đã lưu banner." })
      }
    } finally {
      setSavingBanner(false)
    }
  }

  function updateSlide(index: number, field: keyof BannerSlide, val: string) {
    setBannerSlides((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: val } : s)))
  }

  async function onSubmit(data: FormData) {
    setIsSaving(true)
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          content: tiptapContent,
          image: imageUrl ? { url: imageUrl, alt: imageAlt, title: imageTitle } : null,
          categoryIds: selectedCategoryIds,
          seoTitle: seoTitle || null,
          seoDescription: seoDescription || null,
          seoKeywords: seoKeywords || null,
          seoImage: seoImage || null,
          template: postTemplate,
          relatedPostIds: relatedPostIds.length > 0 ? relatedPostIds : null,
          price: price !== "" ? parseFloat(price) : null,
        }),
      })
      if (!res?.ok) {
        toast({ title: "Lỗi", description: "Không thể lưu bài viết.", variant: "destructive" })
        return
      }
      router.refresh()
      toast({ variant: "success", description: "Đã lưu bài viết." })
    } catch {
      toast({ title: "Lỗi", description: "Không thể lưu bài viết.", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  if (!isMounted) return null

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* ── Sticky header ──────────────────────────────────────── */}
      <div className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-14 items-center justify-between px-4 gap-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard/posts")}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            <Icons.chevronLeft className="mr-1 h-4 w-4" />
            Quay lại
          </button>

          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                isPublished
                  ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                  : scheduledAt
                  ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <span className={cn(
                "h-1.5 w-1.5 rounded-full",
                isPublished ? "bg-green-500" : scheduledAt ? "bg-orange-500" : "bg-muted-foreground"
              )} />
              {isPublished ? "Đã đăng" : scheduledAt ? `Lên lịch: ${format(scheduledAt, "HH:mm dd/MM")}` : "Bản nháp"}
            </span>

            {/* Lên lịch */}
            {!isPublished && (
              <Popover open={scheduleOpen} onOpenChange={setScheduleOpen}>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline" size="sm" className="gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {scheduledAt ? "Sửa lịch" : "Lên lịch"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <div className="p-3 border-b">
                    <p className="text-sm font-medium">Lên lịch đăng bài</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Chọn ngày và giờ đăng tự động</p>
                  </div>
                  <Calendar
                    mode="single"
                    selected={scheduleDate}
                    onSelect={setScheduleDate}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                  />
                  <div className="p-3 border-t space-y-3">
                    <div className="grid gap-1.5">
                      <Label className="text-xs text-muted-foreground">Giờ đăng</Label>
                      <input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      {scheduledAt && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={handleCancelSchedule}
                          disabled={isScheduling}
                        >
                          Huỷ lịch
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        className="flex-1"
                        onClick={handleScheduleSave}
                        disabled={!scheduleDate || isScheduling}
                      >
                        {isScheduling && <Icons.spinner className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                        Đặt lịch
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            <Button
              type="button"
              variant={isPublished ? "secondary" : "default"}
              size="sm"
              onClick={handlePublishToggle}
              disabled={isPublishing}
            >
              {isPublishing && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              {isPublished ? "Huỷ đăng" : "Đăng bài"}
            </Button>

            <button type="submit" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
              {isSaving && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Lưu
            </button>
          </div>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────── */}
      <div className="container max-w-4xl px-4 py-8 pb-20 space-y-6">

        {/* Tiêu đề */}
        <TextareaAutosize
          autoFocus
          id="title"
          defaultValue={post.title}
          placeholder="Tiêu đề bài viết"
          className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none placeholder:text-muted-foreground/40"
          {...register("title")}
        />

        {/* TipTap Editor */}
        {isMounted && (
          <TiptapEditor
            content={tiptapContent}
            onChange={setTiptapContent}
          />
        )}

        <hr />

        {/* ── Accordion settings ─────────────────────────────── */}
        <Accordion type="multiple" className="w-full">

          {/* Danh mục */}
          <AccordionItem value="category">
            <AccordionTrigger className="text-base font-medium">
              Danh mục
              {selectedCategoryIds.length > 0 && (
                <span className="ml-2 text-xs text-muted-foreground font-normal">
                  {selectedCategoryIds.length} đã chọn
                </span>
              )}
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-2">
                <CategorySelector
                  categories={categories}
                  selected={selectedCategoryIds}
                  onChange={setSelectedCategoryIds}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Bài liên quan */}
          <AccordionItem value="related">
            <AccordionTrigger className="text-base font-medium">
              Bài liên quan
              {relatedPostIds.length > 0 && (
                <span className="ml-2 text-xs text-muted-foreground font-normal">
                  {relatedPostIds.length} bài
                </span>
              )}
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-2">
                <RelatedPostSelector
                  allPosts={allPosts}
                  currentPostId={post.id}
                  selected={relatedPostIds}
                  onChange={setRelatedPostIds}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Giá */}
          <AccordionItem value="price">
            <AccordionTrigger className="text-base font-medium">
              Giá
              {price && (
                <span className="ml-2 text-xs text-muted-foreground font-normal">
                  {Number(price).toLocaleString("vi-VN")}đ
                </span>
              )}
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-2 pt-2">
                <Label>Giá niêm yết (VNĐ)</Label>
                <Input
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="VD: 150000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="max-w-xs"
                />
                <p className="text-xs text-muted-foreground">Để trống nếu không hiển thị giá.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Đặt lịch */}
          <AccordionItem value="bookable">
            <AccordionTrigger className="text-base font-medium">
              Trang đặt lịch
              <span className={`ml-2 text-xs font-normal ${bookable ? "text-green-600" : "text-muted-foreground"}`}>
                {bookable ? "Đang hiển thị" : "Đang ẩn"}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-2 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Khi bật, bài viết này sẽ hiện trong danh sách món có thể đặt trên trang <strong>/dat-lich</strong>.
                </p>
                <button
                  type="button"
                  onClick={handleBookableToggle}
                  disabled={isSavingBookable}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${bookable ? "bg-primary" : "bg-muted-foreground/30"}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${bookable ? "translate-x-6" : "translate-x-1"}`} />
                </button>
                <p className="text-xs text-muted-foreground">
                  {bookable ? "Bài này đang hiện trên /dat-lich." : "Bài này đang ẩn khỏi /dat-lich."}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Ảnh bìa */}
          <AccordionItem value="image">
            <AccordionTrigger className="text-base font-medium">
              Ảnh bìa
              {imageUrl && (
                <span className="ml-2 text-xs text-muted-foreground font-normal truncate max-w-[200px]">
                  {imageUrl}
                </span>
              )}
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4 pt-2">
                <div className="flex gap-1 rounded-md border bg-muted p-1">
                  <button
                    type="button"
                    onClick={() => setImageTab("upload")}
                    className={cn(
                      "flex-1 rounded py-1.5 text-sm font-medium transition-colors",
                      imageTab === "upload" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Tải lên
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageTab("url")}
                    className={cn(
                      "flex-1 rounded py-1.5 text-sm font-medium transition-colors",
                      imageTab === "url" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    URL
                  </button>
                </div>

                {imageTab === "upload" ? (
                  <ImageUploader value={imageUrl} onChange={setImageUrl} />
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

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label>Alt text</Label>
                    <Input
                      placeholder="Mô tả ảnh"
                      value={imageAlt}
                      onChange={(e) => setImageAlt(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Title</Label>
                    <Input
                      placeholder="Tiêu đề ảnh"
                      value={imageTitle}
                      onChange={(e) => setImageTitle(e.target.value)}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Ảnh bìa sẽ được lưu khi nhấn <strong>Lưu</strong> phía trên.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Template */}
          <AccordionItem value="template">
            <AccordionTrigger className="text-base font-medium">
              Template
              <span className="ml-2 text-xs text-muted-foreground font-normal">
                {POST_TEMPLATES.find((t) => t.value === postTemplate)?.label ?? postTemplate}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-3 pt-2">
                {POST_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.value}
                    type="button"
                    onClick={() => setPostTemplate(tpl.value)}
                    className={cn(
                      "flex flex-col gap-0.5 rounded-lg border p-4 text-left transition-colors",
                      postTemplate === tpl.value ? "border-primary bg-primary/5" : "hover:bg-muted"
                    )}
                  >
                    <span className="font-medium">{tpl.label}</span>
                    <span className="text-sm text-muted-foreground">{tpl.description}</span>
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Banner */}
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
                  previewTitle={watch("title") as string}
                  onChange={(field, value) => {
                    if (field === "seoTitle") setSeoTitle(value)
                    if (field === "seoDescription") setSeoDescription(value)
                    if (field === "seoKeywords") setSeoKeywords(value)
                    if (field === "seoImage") setSeoImage(value)
                  }}
                />
                <p className="text-xs text-muted-foreground mt-4">
                  SEO sẽ được lưu khi nhấn <strong>Lưu</strong> phía trên.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>
    </form>
  )
}
