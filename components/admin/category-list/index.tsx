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
  arrayMove,
} from "@dnd-kit/sortable"

import { toast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { BulkActionBar } from "@/components/admin/bulk-action-bar"
import { BannerEditor } from "@/components/admin/banner-editor"
import { type BannerConfig, parseBanner } from "@/lib/banner"

import { SortableRow, type Category } from "./sortable-row"
import { CategoryTemplateDialog, CategoryImageDialog, CategorySeoDialog } from "./dialogs"

const BULK_ACTIONS = [
  { label: "Đăng tất cả", action: "publish", variant: "default" as const },
  { label: "Huỷ đăng", action: "unpublish", variant: "outline" as const },
  { label: "Xoá", action: "delete", variant: "destructive" as const, confirm: true },
]

export function CategoryList({ categories: initialCategories }: { categories: Category[] }) {
  const router = useRouter()
  const [categories, setCategories] = React.useState(initialCategories)
  const [deleting, setDeleting] = React.useState<string | null>(null)
  const [selected, setSelected] = React.useState<Set<string>>(new Set())

  React.useEffect(() => { setCategories(initialCategories) }, [initialCategories])

  const toggle = (id: string) => setSelected((prev) => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const toggleAll = () => setSelected((prev) =>
    prev.size === categories.length ? new Set() : new Set(categories.map((c) => c.id))
  )

  const allSelected = selected.size === categories.length && categories.length > 0
  const someSelected = selected.size > 0 && selected.size < categories.length

  // Dialog state — which category is open for which dialog
  const [templateCategory, setTemplateCategory] = React.useState<Category | null>(null)
  const [imageCategory, setImageCategory] = React.useState<Category | null>(null)
  const [seoCategory, setSeoCategory] = React.useState<Category | null>(null)
  const [bannerCategory, setBannerCategory] = React.useState<Category | null>(null)
  const [savingBanner, setSavingBanner] = React.useState(false)

  async function handleBannerSave(config: BannerConfig | null) {
    if (!bannerCategory) return
    setSavingBanner(true)
    const res = await fetch(`/api/categories/${bannerCategory.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ banner: config }),
    })
    setSavingBanner(false)
    if (!res.ok) {
      toast({ title: "Lỗi", description: "Không thể lưu banner.", variant: "destructive" })
      return
    }
    setCategories((prev) =>
      prev.map((c) => c.id === bannerCategory.id ? { ...c, banner: config } : c)
    )
    toast({ variant: "success", description: "Đã lưu banner." })
    setBannerCategory(null)
    router.refresh()
  }

  // Drag & drop
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
      <div>
        <div className="flex items-center gap-3 px-4 py-2 border rounded-t-md bg-muted/40">
          <Checkbox
            checked={allSelected ? true : someSelected ? "indeterminate" : false}
            onCheckedChange={toggleAll}
            aria-label="Chọn tất cả"
          />
          <span className="text-xs text-muted-foreground">
            {selected.size > 0 ? `${selected.size} đã chọn` : "Chọn tất cả"}
          </span>
        </div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <div className="divide-y divide-border rounded-b-md border border-t-0">
              {categories.map((cat) => (
                <SortableRow
                  key={cat.id}
                  cat={cat}
                  onDelete={handleDelete}
                  onSeo={setSeoCategory}
                  onEditImage={setImageCategory}
                  onTemplate={setTemplateCategory}
                  onBanner={setBannerCategory}
                  deleting={deleting}
                  checked={selected.has(cat.id)}
                  onCheck={toggle}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <BulkActionBar
        selectedCount={selected.size}
        selectedIds={[...selected]}
        actions={BULK_ACTIONS}
        apiEndpoint="/api/categories/bulk"
        onClear={() => setSelected(new Set())}
      />

      <BannerEditor
        open={!!bannerCategory}
        onOpenChange={(open) => !open && setBannerCategory(null)}
        title={`Banner — ${bannerCategory?.name}`}
        value={parseBanner(bannerCategory?.banner)}
        onSave={handleBannerSave}
        saving={savingBanner}
      />

      <CategoryTemplateDialog
        category={templateCategory}
        onClose={() => setTemplateCategory(null)}
        onSaved={(id, template) => setCategories((prev) =>
          prev.map((c) => c.id === id ? { ...c, template } : c)
        )}
      />

      <CategoryImageDialog
        category={imageCategory}
        onClose={() => setImageCategory(null)}
        onSaved={(id, image) => setCategories((prev) =>
          prev.map((c) => c.id === id ? { ...c, image: image ?? undefined } : c)
        )}
      />

      <CategorySeoDialog
        category={seoCategory}
        onClose={() => setSeoCategory(null)}
        onSaved={() => {}}
      />
    </>
  )
}
