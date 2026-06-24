"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import EditorJS from "@editorjs/editorjs"
import TextareaAutosize from "react-textarea-autosize"

import "@/styles/editor.css"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { toast } from "@/components/ui/use-toast"

interface PageEditorProps {
  page: {
    id: string
    title: string
    slug: string
    content: unknown
    published: boolean
  }
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export function PageEditor({ page }: PageEditorProps) {
  const router = useRouter()
  const editorRef = React.useRef<EditorJS>()
  const [isMounted, setIsMounted] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [title, setTitle] = React.useState(page.title)
  const [slug, setSlug] = React.useState(page.slug)
  const [published, setPublished] = React.useState(page.published)
  const [slugEdited, setSlugEdited] = React.useState(false)

  React.useEffect(() => setIsMounted(true), [])

  React.useEffect(() => {
    if (!isMounted) return
    const init = async () => {
      const { default: EditorJSClass } = await import("@editorjs/editorjs")
      const { default: Header } = await import("@editorjs/header")
      const { default: List } = await import("@editorjs/list")
      const { default: Paragraph } = await import("@editorjs/paragraph")
      const { default: Table } = await import("@editorjs/table")
      const { default: Code } = await import("@editorjs/code")
      const { default: InlineCode } = await import("@editorjs/inline-code")
      const { default: Embed } = await import("@editorjs/embed")

      if (!editorRef.current) {
        editorRef.current = new EditorJSClass({
          holder: "page-editor",
          placeholder: "Viết nội dung trang...",
          inlineToolbar: true,
          data: (page.content as any) ?? { blocks: [] },
          tools: {
            header: { class: Header as any, config: { levels: [2, 3, 4], defaultLevel: 2 } },
            list: List as any,
            paragraph: { class: Paragraph as any, inlineToolbar: true },
            table: Table as any,
            code: Code as any,
            inlineCode: { class: InlineCode as any, shortcut: "CMD+SHIFT+M" },
            embed: Embed as any,
          },
        })
      }
    }
    init()
    return () => {
      if (editorRef.current?.destroy) {
        editorRef.current.destroy()
        editorRef.current = undefined
      }
    }
  }, [isMounted])

  async function handleSave() {
    if (!editorRef.current) return
    const content = await editorRef.current.save()
    setIsSaving(true)

    const res = await fetch(`/api/pages/${page.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, content, published }),
    })

    setIsSaving(false)

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      toast({ title: "Lỗi", description: data.error ?? "Không thể lưu trang.", variant: "destructive" })
      return
    }

    toast({ description: "Đã lưu trang." })
    router.refresh()
  }

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
            {/* Published toggle */}
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

            <button
              onClick={handleSave}
              disabled={isSaving}
              className={cn(buttonVariants({ size: "sm" }))}
            >
              {isSaving ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : null}
              Lưu
            </button>
          </div>
        </div>
      </div>

      {/* ── Editor body ────────────────────────────────────── */}
      <div className="container max-w-4xl px-4 py-8 space-y-6">
        {/* Title */}
        <TextareaAutosize
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (!slugEdited) setSlug(slugify(e.target.value))
          }}
          placeholder="Tiêu đề trang"
          className="w-full resize-none appearance-none overflow-hidden bg-transparent text-4xl font-bold leading-tight focus:outline-none placeholder:text-muted-foreground/50"
        />

        {/* Slug */}
        <div className="flex items-center gap-2 text-sm">
          <Label className="shrink-0 text-muted-foreground">URL:</Label>
          <span className="text-muted-foreground">/pages/</span>
          <Input
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setSlugEdited(true) }}
            className="h-7 text-sm px-2 w-auto min-w-[160px]"
            placeholder="ten-trang"
          />
        </div>

        <hr />

        {/* EditorJS */}
        {isMounted && (
          <div id="page-editor" className="prose prose-stone dark:prose-invert max-w-none min-h-[400px]" />
        )}
      </div>
    </div>
  )
}
