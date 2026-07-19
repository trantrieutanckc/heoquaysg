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
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { TiptapEditor } from "@/components/admin/tiptap-editor"
import { editorJsToTiptap, isTiptapContent } from "@/lib/editorjs-to-tiptap"
import { SaveOverlay } from "@/components/ui/save-overlay"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { type BannerConfig, type BannerSlide, emptySlide, parseBanner } from "@/lib/banner"
import { Accordion } from "@/components/ui/accordion"

import { EditorCategorySection } from "./category-section"
import { EditorTagSection } from "./tag-section"
import { EditorRelatedSection } from "./related-section"
import { EditorBookableSection } from "./bookable-section"
import { EditorImageSection } from "./image-section"
import { EditorTemplateSection } from "./template-section"
import { EditorBannerSection } from "./banner-section"
import { EditorSeoSection } from "./seo-section"
import { EditorCtaSection } from "./cta-section"

interface Category {
  id: string
  name: string
  slug: string
}

interface Tag {
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
    ctaEnabled?: boolean
    ctaTitle?: string | null
    ctaDesc?: string | null
    ctaImage?: string | null
    ctaBtn2Label?: string | null
    ctaBtn2Url?: string | null
  }
  categories: Category[]
  postCategoryIds: string[]
  allPosts: PostOption[]
  tags: Tag[]
  postTagIds: string[]
}

type FormData = z.infer<typeof postPatchSchema>

export function Editor({ post, categories, postCategoryIds, allPosts, tags: initialTags, postTagIds }: EditorProps) {
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

  // Danh mục, tags & bài liên quan
  const [selectedCategoryIds, setSelectedCategoryIds] = React.useState<string[]>(postCategoryIds)
  const [availableTags, setAvailableTags] = React.useState<Tag[]>(initialTags)
  const [selectedTagIds, setSelectedTagIds] = React.useState<string[]>(postTagIds)
  const [relatedPostIds, setRelatedPostIds] = React.useState<string[]>(
    Array.isArray(post.relatedPostIds) ? (post.relatedPostIds as string[]) : []
  )

  // Đặt lịch
  const [bookable, setBookable] = React.useState(post.bookable ?? false)
  const [ctaEnabled, setCtaEnabled] = React.useState(post.ctaEnabled ?? true)
  const [ctaTitle, setCtaTitle] = React.useState(post.ctaTitle ?? "")
  const [ctaDesc, setCtaDesc] = React.useState(post.ctaDesc ?? "")
  const [ctaImage, setCtaImage] = React.useState(post.ctaImage ?? "")
  const [ctaBtn2Label, setCtaBtn2Label] = React.useState(post.ctaBtn2Label ?? "")
  const [ctaBtn2Url, setCtaBtn2Url] = React.useState(post.ctaBtn2Url ?? "")
  const [isSavingBookable, setIsSavingBookable] = React.useState(false)

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

  React.useEffect(() => {
    if (typeof window !== "undefined") setIsMounted(true)
  }, [])

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
          tagIds: selectedTagIds,
          seoTitle: seoTitle || null,
          seoDescription: seoDescription || null,
          seoKeywords: seoKeywords || null,
          seoImage: seoImage || null,
          template: postTemplate,
          relatedPostIds: relatedPostIds.length > 0 ? relatedPostIds : null,
          ctaEnabled,
          ctaTitle: ctaTitle.trim() || null,
          ctaDesc: ctaDesc.trim() || null,
          ctaImage: ctaImage.trim() || null,
          ctaBtn2Label: ctaBtn2Label.trim() || null,
          ctaBtn2Url: ctaBtn2Url.trim() || null,
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
      <SaveOverlay visible={isSaving || isPublishing} text={isPublishing ? "Đang xử lý..." : "Đang lưu..."} />
      {/* ── Sticky header ──────────────────────────────────────── */}
      <div className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-14 items-center justify-between px-4 gap-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard/posts")}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <span className="relative inline-flex items-center gap-1">
              <Icons.chevronLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Quay lại
              <span className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 h-[2px] bg-primary w-0 group-hover:w-full transition-[width] duration-500" />
            </span>
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
              {isPublished ? "Huỷ đăng" : "Đăng bài"}
            </Button>

            <button type="submit" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
              Lưu
            </button>
          </div>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────── */}
      <div className="container max-w-4xl px-4 py-8 pb-20 space-y-6">
        <TextareaAutosize
          autoFocus
          id="title"
          defaultValue={post.title}
          placeholder="Tiêu đề bài viết"
          className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none placeholder:text-muted-foreground/40"
          {...register("title")}
        />

        {isMounted && (
          <TiptapEditor
            content={tiptapContent}
            onChange={setTiptapContent}
          />
        )}

        <hr />

        <Accordion type="multiple" className="w-full">
          <EditorCategorySection
            categories={categories}
            selectedCategoryIds={selectedCategoryIds}
            onChange={setSelectedCategoryIds}
          />
          <EditorTagSection
            tags={availableTags}
            selectedTagIds={selectedTagIds}
            onChange={setSelectedTagIds}
            onTagCreated={(tag) => setAvailableTags((prev) => [...prev, tag])}
          />
          <EditorRelatedSection
            allPosts={allPosts}
            currentPostId={post.id}
            relatedPostIds={relatedPostIds}
            onChange={setRelatedPostIds}
          />
          <EditorBookableSection
            bookable={bookable}
            isSaving={isSavingBookable}
            onToggle={handleBookableToggle}
          />
          <EditorCtaSection
            ctaEnabled={ctaEnabled}
            ctaTitle={ctaTitle}
            ctaDesc={ctaDesc}
            ctaImage={ctaImage}
            ctaBtn2Label={ctaBtn2Label}
            ctaBtn2Url={ctaBtn2Url}
            onToggle={() => setCtaEnabled((v) => !v)}
            onTitleChange={setCtaTitle}
            onDescChange={setCtaDesc}
            onImageChange={setCtaImage}
            onBtn2LabelChange={setCtaBtn2Label}
            onBtn2UrlChange={setCtaBtn2Url}
          />
          <EditorImageSection
            imageTab={imageTab}
            imageUrl={imageUrl}
            imageAlt={imageAlt}
            imageTitle={imageTitle}
            onTabChange={setImageTab}
            onUrlChange={setImageUrl}
            onAltChange={setImageAlt}
            onTitleChange={setImageTitle}
          />
          <EditorTemplateSection
            postTemplate={postTemplate}
            onChange={setPostTemplate}
          />
          <EditorBannerSection
            bannerType={bannerType}
            bannerSlides={bannerSlides}
            bannerConfig={bannerConfig}
            isSaving={savingBanner}
            onTypeChange={setBannerType}
            onSlidesChange={setBannerSlides}
            onSave={handleBannerSave}
          />
          <EditorSeoSection
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
        </Accordion>
      </div>
    </form>
  )
}
