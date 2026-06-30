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
import { toast } from "@/components/ui/use-toast"

interface Category { id: string; name: string; slug: string }

interface MenuItem {
  id: string
  title: string
  href: string
  type: string
  order: number
  disabled: boolean
  categoryId: string | null
  category: Category | null
}

const TYPE_LABEL: Record<string, string> = {
  custom: "Tuỳ chỉnh",
  category: "Category",
  page: "Page",
}

function SortableRow({
  item,
  onEdit,
  onDelete,
  onToggle,
  deleting,
  saving,
  toggling,
  editing,
  editTitle,
  editHref,
  setEditTitle,
  setEditHref,
  onSave,
  onCancelEdit,
}: {
  item: MenuItem
  onEdit: (item: MenuItem) => void
  onDelete: (id: string) => void
  onToggle: (item: MenuItem) => void
  deleting: string | null
  saving: string | null
  toggling: string | null
  editing: string | null
  editTitle: string
  editHref: string
  setEditTitle: (v: string) => void
  setEditHref: (v: string) => void
  onSave: (item: MenuItem) => void
  onCancelEdit: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-4 gap-3 bg-background"
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        type="button"
        className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
        aria-label="Kéo để sắp xếp"
      >
        <Icons.dragHandle className="h-4 w-4" />
      </button>

      {editing === item.id ? (
        <div className="flex flex-1 items-center gap-2">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="h-8 w-36"
          />
          <Input
            value={editHref}
            onChange={(e) => setEditHref(e.target.value)}
            className="h-8 flex-1"
          />
          <Button size="sm" onClick={() => onSave(item)} disabled={saving === item.id}>
            {saving === item.id && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Lưu
          </Button>
          <Button size="sm" variant="ghost" onClick={onCancelEdit} disabled={saving === item.id}>Huỷ</Button>
        </div>
      ) : (
        <div className="flex flex-1 items-center gap-3 flex-wrap">
          <p className="font-medium">{item.title}</p>
          <Badge variant="secondary">{item.href}</Badge>
          <Badge variant="outline" className="text-xs">
            {TYPE_LABEL[item.type] ?? item.type}
            {item.category && ` · ${item.category.name}`}
          </Badge>
          {item.disabled && (
            <Badge variant="outline" className="text-muted-foreground">Ẩn</Badge>
          )}
        </div>
      )}

      {editing !== item.id && (
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="sm" onClick={() => onToggle(item)} title={item.disabled ? "Hiện" : "Ẩn"} disabled={toggling === item.id}>
            {toggling === item.id
              ? <Icons.spinner className="h-4 w-4 animate-spin" />
              : item.disabled ? <Icons.show className="h-4 w-4" /> : <Icons.hide className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
            <Icons.edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(item.id)}
            disabled={deleting === item.id}
          >
            {deleting === item.id
              ? <Icons.spinner className="h-4 w-4 animate-spin" />
              : <Icons.trash className="h-4 w-4 text-destructive" />}
          </Button>
        </div>
      )}
    </div>
  )
}

export function MenuList({ items: initialItems, categories: _categories }: { items: MenuItem[]; categories: Category[] }) {
  const router = useRouter()
  const [items, setItems] = React.useState(initialItems)
  const [deleting, setDeleting] = React.useState<string | null>(null)
  const [saving, setSaving] = React.useState<string | null>(null)
  const [toggling, setToggling] = React.useState<string | null>(null)
  const [editing, setEditing] = React.useState<string | null>(null)
  const [editTitle, setEditTitle] = React.useState("")
  const [editHref, setEditHref] = React.useState("")

  React.useEffect(() => { setItems(initialItems) }, [initialItems])

  const sensors = useSensors(useSensor(PointerSensor))

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((i) => i.id === active.id)
    const newIndex = items.findIndex((i) => i.id === over.id)
    const newItems = arrayMove(items, oldIndex, newIndex)

    setItems(newItems)

    await Promise.all(
      newItems.map((item, index) =>
        fetch(`/api/menu/${item.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...item, order: index }),
        })
      )
    )

    router.refresh()
  }

  function startEdit(item: MenuItem) {
    setEditing(item.id)
    setEditTitle(item.title)
    setEditHref(item.href)
  }

  async function handleSave(item: MenuItem) {
    setSaving(item.id)
    const res = await fetch(`/api/menu/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, href: editHref, type: item.type, order: item.order, disabled: item.disabled, categoryId: item.categoryId }),
    })
    setSaving(null)

    if (!res.ok) {
      return toast({ title: "Lỗi", description: "Không thể cập nhật.", variant: "destructive" })
    }

    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, title: editTitle, href: editHref } : i))
    setEditing(null)
    toast({ variant: "success", description: "Đã cập nhật menu item." })
    router.refresh()
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    const res = await fetch(`/api/menu/${id}`, { method: "DELETE" })
    setDeleting(null)

    if (!res.ok) {
      return toast({ title: "Lỗi", description: "Không thể xoá.", variant: "destructive" })
    }
    setItems((prev) => prev.filter((i) => i.id !== id))
    toast({ variant: "success", description: "Đã xoá menu item." })
    router.refresh()
  }

  async function toggleDisabled(item: MenuItem) {
    setToggling(item.id)
    const res = await fetch(`/api/menu/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, disabled: !item.disabled }),
    })
    setToggling(null)

    if (!res.ok) {
      return toast({ title: "Lỗi", description: "Không thể cập nhật.", variant: "destructive" })
    }
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, disabled: !i.disabled } : i))
    toast({ variant: "success", description: item.disabled ? "Đã hiện menu item." : "Đã ẩn menu item." })
    router.refresh()
  }

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border py-12 text-center">
        <p className="text-sm text-muted-foreground">Chưa có menu item nào.</p>
      </div>
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="divide-y divide-border rounded-md border">
          {items.map((item) => (
            <SortableRow
              key={item.id}
              item={item}
              onEdit={startEdit}
              onDelete={handleDelete}
              onToggle={toggleDisabled}
              deleting={deleting}
              saving={saving}
              toggling={toggling}
              editing={editing}
              editTitle={editTitle}
              editHref={editHref}
              setEditTitle={setEditTitle}
              setEditHref={setEditHref}
              onSave={handleSave}
              onCancelEdit={() => setEditing(null)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
