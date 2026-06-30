"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { SeoPanel } from "@/components/admin/seo-panel"
import { ImageUploader } from "@/components/admin/image-uploader"
import { CATEGORY_TEMPLATES, type CategoryTemplate } from "@/lib/templates"
import { type Category } from "./sortable-row"

// ── Template Dialog ──────────────────────────────────────────────────

interface TemplateDialogProps {
  category: Category | null
  onClose: () => void
  onSaved: (id: string, template: string) => void
}

export function CategoryTemplateDialog({ category, onClose, onSaved }: TemplateDialogProps) {
  const router = useRouter()
  const [selected, setSelected] = React.useState<CategoryTemplate>("standard")
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    if (category) setSelected((category.template ?? "standard") as CategoryTemplate)
  }, [category])

  async function handleSave() {
    if (!category) return
    setSaving(true)
    await fetch(`/api/categories/${category.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template: selected }),
    })
    setSaving(false)
    onSaved(category.id, selected)
    onClose()
    router.refresh()
  }

  return (
    <Dialog open={!!category} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Template — {category?.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          {CATEGORY_TEMPLATES.map((tpl) => (
            <button
              key={tpl.value}
              type="button"
              onClick={() => setSelected(tpl.value)}
              className={`flex flex-col gap-0.5 rounded-lg border p-4 text-left transition-colors ${
                selected === tpl.value ? "border-primary bg-primary/5" : "hover:bg-muted"
              }`}
            >
              <span className="font-medium">{tpl.label}</span>
              <span className="text-sm text-muted-foreground">{tpl.description}</span>
            </button>
          ))}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Huỷ</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Image Dialog ─────────────────────────────────────────────────────

interface ImageDialogProps {
  category: Category | null
  onClose: () => void
  onSaved: (id: string, image: { url: string; alt?: string; title?: string } | null) => void
}

export function CategoryImageDialog({ category, onClose, onSaved }: ImageDialogProps) {
  const [imageUrl, setImageUrl] = React.useState("")
  const [imageAlt, setImageAlt] = React.useState("")
  const [imageTitle, setImageTitle] = React.useState("")
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    if (category) {
      setImageUrl(category.image?.url ?? "")
      setImageAlt(category.image?.alt ?? "")
      setImageTitle(category.image?.title ?? "")
    }
  }, [category])

  async function handleSave() {
    if (!category) return
    setSaving(true)
    const image = imageUrl.trim()
      ? { url: imageUrl.trim(), alt: imageAlt.trim(), title: imageTitle.trim() }
      : null
    const res = await fetch(`/api/categories/${category.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image }),
    })
    setSaving(false)
    if (!res.ok) {
      toast({ title: "Lỗi", description: "Không thể lưu ảnh.", variant: "destructive" })
      return
    }
    toast({ variant: "success", description: "Đã cập nhật ảnh category." })
    onSaved(category.id, image)
    onClose()
  }

  return (
    <Dialog open={!!category} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ảnh — {category?.name}</DialogTitle>
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
          <Button variant="ghost" onClick={onClose}>Huỷ</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── SEO Dialog ───────────────────────────────────────────────────────

interface SeoDialogProps {
  category: Category | null
  onClose: () => void
  onSaved: () => void
}

export function CategorySeoDialog({ category, onClose, onSaved }: SeoDialogProps) {
  const router = useRouter()
  const [seoTitle, setSeoTitle] = React.useState("")
  const [seoDescription, setSeoDescription] = React.useState("")
  const [seoKeywords, setSeoKeywords] = React.useState("")
  const [seoImage, setSeoImage] = React.useState("")
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    if (category) {
      setSeoTitle(category.seoTitle ?? "")
      setSeoDescription(category.seoDescription ?? "")
      setSeoKeywords(category.seoKeywords ?? "")
      setSeoImage(category.seoImage ?? "")
    }
  }, [category])

  async function handleSave() {
    if (!category) return
    setSaving(true)
    await fetch(`/api/categories/${category.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seoTitle, seoDescription, seoKeywords, seoImage: seoImage || undefined }),
    })
    setSaving(false)
    onSaved()
    onClose()
    router.refresh()
  }

  return (
    <Dialog open={!!category} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>SEO — {category?.name}</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <SeoPanel
            seoTitle={seoTitle}
            seoDescription={seoDescription}
            seoKeywords={seoKeywords}
            seoImage={seoImage}
            previewTitle={category?.name}
            onChange={(field, value) => {
              if (field === "seoTitle") setSeoTitle(value)
              if (field === "seoDescription") setSeoDescription(value)
              if (field === "seoKeywords") setSeoKeywords(value)
              if (field === "seoImage") setSeoImage(value)
            }}
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Huỷ</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Lưu SEO
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
