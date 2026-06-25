"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

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

export function PageCreateButton() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [newTitle, setNewTitle] = React.useState("")
  const [newSlug, setNewSlug] = React.useState("")
  const [slugEdited, setSlugEdited] = React.useState(false)
  const [creating, setCreating] = React.useState(false)

  function handleOpenChange(v: boolean) {
    setOpen(v)
    if (!v) {
      setNewTitle("")
      setNewSlug("")
      setSlugEdited(false)
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle.trim() || !newSlug.trim()) return
    setCreating(true)

    const res = await fetch("/api/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle.trim(), slug: newSlug.trim() }),
    })

    setCreating(false)

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      toast({
        title: "Lỗi",
        description: data.error ?? "Không thể tạo trang.",
        variant: "destructive",
      })
      return
    }

    const page = await res.json()
    handleOpenChange(false)
    router.push(`/editor/pages/${page.id}`)
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Icons.add className="mr-2 h-4 w-4" />
        Tạo trang mới
      </Button>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo trang tĩnh mới</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="new-page-title">Tiêu đề</Label>
              <Input
                id="new-page-title"
                placeholder="Giới thiệu"
                value={newTitle}
                autoFocus
                onChange={(e) => {
                  setNewTitle(e.target.value)
                  if (!slugEdited) setNewSlug(slugify(e.target.value))
                }}
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="new-page-slug">Slug (URL)</Label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground shrink-0">/pages/</span>
                <Input
                  id="new-page-slug"
                  placeholder="gioi-thieu"
                  value={newSlug}
                  onChange={(e) => {
                    setNewSlug(e.target.value)
                    setSlugEdited(true)
                  }}
                  required
                  pattern="[a-z0-9-]+"
                  title="Chỉ chữ thường, số và dấu gạch ngang"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>
                Huỷ
              </Button>
              <Button
                type="submit"
                disabled={!newTitle.trim() || !newSlug.trim() || creating}
              >
                {creating && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Tạo và mở editor
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
