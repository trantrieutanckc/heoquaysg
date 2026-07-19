"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { parseBanner } from "@/lib/banner"
import { PublishToggle } from "@/components/admin/publish-toggle"

interface CategoryImage {
  url: string
  alt?: string
  title?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  published: boolean
  order: number
  template: string
  image?: CategoryImage | null
  banner?: unknown
  seoTitle?: string | null
  seoDescription?: string | null
  seoKeywords?: string | null
  seoImage?: string | null
  _count: { posts: number }
}

interface Props {
  cat: Category
  onDelete: (id: string) => void
  onSeo: (cat: Category) => void
  onEditImage: (cat: Category) => void
  onTemplate: (cat: Category) => void
  onBanner: (cat: Category) => void
  onDescription: (cat: Category) => void
  deleting: string | null
  checked: boolean
  onCheck: (id: string) => void
}

export function SortableRow({ cat, onDelete, onSeo, onEditImage, onTemplate, onBanner, onDescription, deleting, checked, onCheck }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cat.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-4 bg-background gap-3 hover:bg-muted/40 transition-colors"
    >
      <Checkbox
        checked={checked}
        onCheckedChange={() => onCheck(cat.id)}
        aria-label={`Chọn ${cat.name}`}
        onClick={(e) => e.stopPropagation()}
      />
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
        <Badge variant="secondary" className="shrink-0 font-mono text-xs">{cat.slug}</Badge>
        <span className="text-xs text-muted-foreground shrink-0">{cat._count.posts} bài</span>
        {cat.template && cat.template !== "standard" && (
          <Badge variant="outline" className="shrink-0 text-xs hidden sm:flex">
            {cat.template === "grid" ? "Lưới" : cat.template === "hero" ? "Hero" : cat.template}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <PublishToggle id={cat.id} published={cat.published} endpoint="categories" />
        <Button variant="ghost" size="sm" onClick={() => onBanner(cat)} title="Banner" className={parseBanner(cat.banner) ? "text-primary" : ""}>
          <Icons.media className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onTemplate(cat)} title="Template">
          <Icons.page className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDescription(cat)} title="Mô tả" className={cat.description ? "text-primary" : ""}>
          <Icons.post className="h-4 w-4" />
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
