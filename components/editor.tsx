"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import EditorJS from "@editorjs/editorjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { Post } from "@prisma/client"
import { useForm} from "react-hook-form"
import TextareaAutosize from "react-textarea-autosize"
import * as z from "zod"

import "@/styles/editor.css"
import { cn } from "@/lib/utils"
import { postPatchSchema } from "@/lib/validations/post"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { CategorySelector } from "@/components/category-selector"
import { SeoPanel } from "@/components/seo-panel"
import { ImageUploader } from "@/components/image-uploader"

interface Category {
  id: string
  name: string
  slug: string
}

interface EditorProps {
  post: Pick<Post, "id" | "title" | "content" | "published" | "image" | "seoTitle" | "seoDescription" | "seoKeywords" | "seoImage">
  categories: Category[]
  postCategoryIds: string[]
}

type FormData = z.infer<typeof postPatchSchema>

export function Editor({ post, categories, postCategoryIds }: EditorProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(postPatchSchema),
    defaultValues: {
      title: post.title,
      content: post.content,
      image: (post.image as { url?: string; alt?: string; title?: string } | null) || null,
    },
  })
  const ref = React.useRef<EditorJS>()
  const router = useRouter()
  const [isSaving, setIsSaving] = React.useState<boolean>(false)
  const [isMounted, setIsMounted] = React.useState<boolean>(false)
  const [imageDialogOpen, setImageDialogOpen] = React.useState(false)
  const [imageTab, setImageTab] = React.useState<"upload" | "url">("upload")
  const [seoDialogOpen, setSeoDialogOpen] = React.useState(false)
  const [seoTitle, setSeoTitle] = React.useState((post.seoTitle as string) || "")
  const [seoDescription, setSeoDescription] = React.useState((post.seoDescription as string) || "")
  const [seoKeywords, setSeoKeywords] = React.useState((post.seoKeywords as string) || "")
  const [seoImage, setSeoImage] = React.useState((post.seoImage as string) || "")
  const [selectedCategoryIds, setSelectedCategoryIds] = React.useState<string[]>(postCategoryIds)
  const [imageUrlInput, setImageUrlInput] = React.useState(
    (post.image as { url?: string } | null)?.url || ""
  )
  const [imageAltInput, setImageAltInput] = React.useState(
    (post.image as { alt?: string } | null)?.alt || ""
  )
  const [imageTitleInput, setImageTitleInput] = React.useState(
    (post.image as { title?: string } | null)?.title || ""
  )
  const currentImageUrl = (watch("image") as { url?: string } | null)?.url

  const initializeEditor = React.useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default
    const Header = (await import("@editorjs/header")).default
    const Embed = (await import("@editorjs/embed")).default
    const Table = (await import("@editorjs/table")).default
    const List = (await import("@editorjs/list")).default
    const Code = (await import("@editorjs/code")).default
    const LinkTool = (await import("@editorjs/link")).default
    const InlineCode = (await import("@editorjs/inline-code")).default
    const ImageTool = (await import("@editorjs/image")).default

    const body = postPatchSchema.parse(post)
    const editorData = typeof post.content === "string" 
  ? JSON.parse(body.content) 
  : (body.content || { blocks: [] })

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor
        },
        placeholder: "Type here to write your post...",
        inlineToolbar: true,
        data: editorData,
        tools: {
          header: Header,
          linkTool: LinkTool,
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const form = new FormData()
                  form.append("file", file)
                  const res = await fetch("/api/upload", { method: "POST", body: form })
                  return res.json()
                },
                async uploadByUrl(url: string) {
                  return { success: 1, file: { url } }
                },
              },
            },
          },
        },
      })
    }
  }, [post])

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true)
    }
  }, [])

  React.useEffect(() => {
    if (isMounted) {
      initializeEditor()

      return () => {
        ref.current?.destroy()
        ref.current = undefined
      }
    }
  }, [isMounted, initializeEditor])

  function handleImageSave() {
    setValue("image", imageUrlInput ? { url: imageUrlInput, alt: imageAltInput, title: imageTitleInput } : null)
    setImageDialogOpen(false)
  }

  async function onSubmit(data: FormData) {
    setIsSaving(true)

    const blocks = await ref.current?.save()

    const response = await fetch(`/api/posts/${post.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        content: blocks,
        image: data.image,
        categoryIds: selectedCategoryIds,
        seoTitle: seoTitle || undefined,
        seoDescription: seoDescription || undefined,
        seoKeywords: seoKeywords || undefined,
        seoImage: seoImage || undefined,
      }),
    })

    setIsSaving(false)

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your post was not saved. Please try again.",
        variant: "destructive",
      })
    }

    router.refresh()

    return toast({
      description: "Your post has been saved.",
    })
  }

  if (!isMounted) {
    return null
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid w-full gap-10">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center space-x-10">
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              <>
                <Icons.chevronLeft className="mr-2 h-4 w-4" />
                Back
              </>
            </Link>
            <p className="text-sm text-muted-foreground">
              {post.published ? "Published" : "Draft"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CategorySelector
              categories={categories}
              selected={selectedCategoryIds}
              onChange={setSelectedCategoryIds}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setImageDialogOpen(true)}
            >
              <Icons.media className="mr-2 h-4 w-4" />
              {currentImageUrl ? "Edit Image" : "Add Image"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSeoDialogOpen(true)}
            >
              SEO
            </Button>
            <button type="submit" className={cn(buttonVariants())}>
              {isSaving && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              <span>Save</span>
            </button>
          </div>
        </div>
        <div className="prose prose-stone mx-auto w-[800px] dark:prose-invert">
          <TextareaAutosize
            autoFocus
            id="title"
            defaultValue={post.title}
            placeholder="Post title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
            {...register("title")}
          />
          <div id="editor" className="min-h-[500px]" />
          <p className="text-sm text-gray-500">
            Use{" "}
            <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
              Tab
            </kbd>{" "}
            to open the command menu.
          </p>
        </div>
      </div>
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{currentImageUrl ? "Chỉnh sửa ảnh bìa" : "Thêm ảnh bìa"}</DialogTitle>
          </DialogHeader>

          {/* Tabs */}
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

          <div className="grid gap-4 py-1">
            {imageTab === "upload" ? (
              <ImageUploader
                value={imageUrlInput}
                onChange={(url) => setImageUrlInput(url)}
              />
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="editor-image-url">URL ảnh</Label>
                <Input
                  id="editor-image-url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="editor-image-alt">Alt text</Label>
                <Input
                  id="editor-image-alt"
                  placeholder="Mô tả ảnh"
                  value={imageAltInput}
                  onChange={(e) => setImageAltInput(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editor-image-title">Title</Label>
                <Input
                  id="editor-image-title"
                  placeholder="Tiêu đề ảnh"
                  value={imageTitleInput}
                  onChange={(e) => setImageTitleInput(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setImageDialogOpen(false)}>Huỷ</Button>
            <Button onClick={handleImageSave} disabled={!imageUrlInput}>Xác nhận</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SEO Dialog */}
      <Dialog open={seoDialogOpen} onOpenChange={setSeoDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Cài đặt SEO</DialogTitle>
          </DialogHeader>
          <div className="py-2">
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
          </div>
          <DialogFooter>
            <Button onClick={() => setSeoDialogOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  )
}
