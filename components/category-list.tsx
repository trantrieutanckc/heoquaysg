"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { SeoPanel } from "@/components/seo-panel"
import { ImageUploader } from "@/components/image-uploader"
import { CATEGORY_TEMPLATES, type CategoryTemplate } from "@/lib/templates"

interface CategoryImage {
  url: string
  alt?: string
  title?: string
}

interface Category {
  id: string
  name: string
  slug: string
  order: number
  template: string
  image?: CategoryImage | null
  seoTitle?: string | null
  seoDescription?: string | null
  seoKeywords?: string | null
  seoImage?: string | null
  _count: { posts: number }
}

function SortableRow({
  cat,
  onDelete,
  onSeo,
  onEditImage,
  onTemplate,
  deleting,
}: {
  cat: Category
  onDelete: (id: string) => void
  onSeo: (cat: Category) => void
  onEditImage: (cat: Category) => void
  onTemplate: (cat: Category) => void
  deleting: string | null
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: cat.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-4 bg-background gap-3"
    >
      <button
        {...attributes}
        {...listeners}
        type="button"
        className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
        aria-label="Kéo để sắp xếp"
      >
        <Icons.dragHandle className="h-4 w-4" />
      </button>

      <div className="flex flex-1 items-center gap-3 min-w-0">
        {/* Image thumbnail — click to edit */}
        <button
          type="button"
          onClick={() => onEditImage(cat)}
          title="Chỉnh sửa ảnh"
          className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border bg-muted hover:opacity-80 transition-opacity group"
        >
          {cat.image?.url ? (
            <>
              <img
                src={cat.image.url}
                alt={cat.image.alt ?? cat.name}
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <Icons.media className="h-3.5 w-3.5 text-white" />
              </span>
            </>
          ) : (
            <span className="flex h-full w-full items-center justify-center text-muted-foreground group-hover:text-foreground">
              <Icons.media className="h-4 w-4" />
            </span>
          )}
        </button>

        <p className="font-medium truncate">{cat.name}</p>
        <Badge variant="secondary" className="shrink-0">{cat.slug}</Badge>
        <span className="text-xs text-muted-foreground shrink-0">{cat._count.posts} bài</span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="sm" onClick={() => onTemplate(cat)} title="Template">
          <Icons.page className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onSeo(cat)} title="SEO">
          <Icons.search className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(cat.id)}
          disabled={deleting === cat.id}
        >
          {deleting === cat.id
            ? <Icons.spinner className="h-4 w-4 animate-spin" />
            : <Icons.trash className="h-4 w-4 text-destructive" />
          }
        </Button>
      </div>
    </div>
  )
}

export function CategoryList({ categories: initialCategories }: { categories: Category[] }) {
  const router = useRouter()
  const [categories, setCategories] = React.useState(initialCategories)
  const [deleting, setDeleting] = React.useState<string | null>(null)

  // Template dialog
  const [templateCategory, setTemplateCategory] = React.useState<Category | null>(null)
  const [selectedTemplate, setSelectedTemplate] = React.useState<CategoryTemplate>("standard")
  const [savingTemplate, setSavingTemplate] = React.useState(false)

  function openTemplate(cat: Category) {
    setTemplateCategory(cat)
    setSelectedTemplate((cat.template ?? "standard") as CategoryTemplate)
  }

  async function handleTemplateSave() {
    if (!templateCategory) return
    setSavingTemplate(true)
    await fetch(`/api/categories/${templateCategory.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template: selectedTemplate }),
    })
    setSavingTemplate(false)
    setCategories((prev) =>
      prev.map((c) => c.id === templateCategory.id ? { ...c, template: selectedTemplate } : c)
    )
    setTemplateCategory(null)
    router.refresh()
  }

  // SEO dialog
  const [seoCategory, setSeoCategory] = React.useState<Category | null>(null)
  const [seoTitle, setSeoTitle] = React.useState("")
  const [seoDescription, setSeoDescription] = React.useState("")
  const [seoKeywords, setSeoKeywords] = React.useState("")
  const [seoImage, setSeoImage] = React.useState("")
  const [savingSeo, setSavingSeo] = React.useState(false)

  // Image edit dialog
  const [imageCategory, setImageCategory] = React.useState<Category | null>(null)
  const [imageUrl, setImageUrl] = React.useState("")
  const [imageAlt, setImageAlt] = React.useState("")
  const [imageTitle, setImageTitle] = React.useState("")
  const [savingImage, setSavingImage] = React.useState(false)

  React.useEffect(() => { setCategories(initialCategories) }, [initialCategories])

  // ── SEO ──────────────────────────────────────────────
  function openSeo(cat: Category) {
    setSeoCategory(cat)
    setSeoTitle(cat.seoTitle ?? "")
    setSeoDescription(cat.seoDescription ?? "")
    setSeoKeywords(cat.seoKeywords ?? "")
    setSeoImage(cat.seoImage ?? "")
  }

  async function handleSeoSave() {
    if (!seoCategory) return
    setSavingSeo(true)
    await fetch(`/api/categories/${seoCategory.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seoTitle, seoDescription, seoKeywords, seoImage: seoImage || undefined }),
    })
    setSavingSeo(false)
    setSeoCategory(null)
    router.refresh()
  }

  // ── Image edit ────────────────────────────────────────
  function openImageEdit(cat: Category) {
    setImageCategory(cat)
    setImageUrl(cat.image?.url ?? "")
    setImageAlt(cat.image?.alt ?? "")
    setImageTitle(cat.image?.title ?? "")
  }

  async function handleImageSave() {
    if (!imageCategory) return
    setSavingImage(true)

    const image = imageUrl.trim()
      ? { url: imageUrl.trim(), alt: imageAlt.trim(), title: imageTitle.trim() }
      : null

    const res = await fetch(`/api/categories/${imageCategory.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image }),
    })

    setSavingImage(false)

    if (!res.ok) {
      toast({ title: "Lỗi", description: "Không thể lưu ảnh.", variant: "destructive" })
      return
    }

    // Update local state
    setCategories((prev) =>
      prev.map((c) =>
        c.id === imageCategory.id ? { ...c, image: image ?? undefined } : c
      )
    )

    toast({ description: "Đã cập nhật ảnh category." })
    setImageCategory(null)
    router.refresh()
  }

  // ── Drag & drop ───────────────────────────────────────
  const sensors = useSensors(useSensor(PointerSensor))

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = categories.findIndex((c) => c.id === active.id)
    const newIndex = categories.findIndex((c) => c.id === over.id)
    const newCategories = arrayMove(categories, oldIndex, newIndex)
    setCategories(newCategories)

    await Promise.all(
      newCategories.map((cat, index) =>
        fetch(`/api/categories/${cat.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: index }),
        })
      )
    )
    router.refresh()
  }

  // ── Delete ────────────────────────────────────────────
  async function handleDelete(id: string) {
    setDeleting(id)
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" })
    setDeleting(null)
    if (!res.ok) {
      return toast({ title: "Lỗi", description: "Không thể xoá.", variant: "destructive" })
    }
    setCategories((prev) => prev.filter((c) => c.id !== id))
    router.refresh()
  }

  if (!categories.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border py-12 text-center">
        <p className="text-sm text-muted-foreground">Chưa có category nào.</p>
      </div>
    )
  }

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          <div className="divide-y divide-border rounded-md border">
            {categories.map((cat) => (
              <SortableRow
                key={cat.id}
                cat={cat}
                onDelete={handleDelete}
                onSeo={openSeo}
                onEditImage={openImageEdit}
                onTemplate={openTemplate}
                deleting={deleting}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Template dialog */}
      <Dialog open={!!templateCategory} onOpenChange={(open) => !open && setTemplateCategory(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Template — {templateCategory?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            {CATEGORY_TEMPLATES.map((tpl) => (
              <button
                key={tpl.value}
                type="button"
                onClick={() => setSelectedTemplate(tpl.value)}
                className={`flex flex-col gap-0.5 rounded-lg border p-4 text-left transition-colors ${
                  selectedTemplate === tpl.value
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted"
                }`}
              >
                <span className="font-medium">{tpl.label}</span>
                <span className="text-sm text-muted-foreground">{tpl.description}</span>
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setTemplateCategory(null)}>Huỷ</Button>
            <Button onClick={handleTemplateSave} disabled={savingTemplate}>
              {savingTemplate && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image edit dialog */}
      <Dialog open={!!imageCategory} onOpenChange={(open) => !open && setImageCategory(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ảnh — {imageCategory?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <ImageUploader value={imageUrl} onChange={setImageUrl} />
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="cat-image-alt">Alt text</Label>
                <Input
                  id="cat-image-alt"
                  placeholder="Mô tả ảnh"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cat-image-title">Title</Label>
                <Input
                  id="cat-image-title"
                  placeholder="Tiêu đề ảnh"
                  value={imageTitle}
                  onChange={(e) => setImageTitle(e.target.value)}
                />
              </div>
            </div>
            {imageUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive w-fit"
                onClick={() => setImageUrl("")}
              >
                <Icons.trash className="mr-2 h-3.5 w-3.5" />
                Xóa ảnh
              </Button>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setImageCategory(null)}>Huỷ</Button>
            <Button onClick={handleImageSave} disabled={savingImage}>
              {savingImage && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SEO dialog */}
      <Dialog open={!!seoCategory} onOpenChange={(open) => !open && setSeoCategory(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>SEO — {seoCategory?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <SeoPanel
              seoTitle={seoTitle}
              seoDescription={seoDescription}
              seoKeywords={seoKeywords}
              seoImage={seoImage}
              previewTitle={seoCategory?.name}
              onChange={(field, value) => {
                if (field === "seoTitle") setSeoTitle(value)
                if (field === "seoDescription") setSeoDescription(value)
                if (field === "seoKeywords") setSeoKeywords(value)
                if (field === "seoImage") setSeoImage(value)
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSeoCategory(null)}>Huỷ</Button>
            <Button onClick={handleSeoSave} disabled={savingSeo}>
              {savingSeo && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Lưu SEO
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
