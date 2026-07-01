"use client"

import * as React from "react"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { DashboardHeader } from "@/components/admin/header"
import { DashboardShell } from "@/components/admin/shell"

interface Tag {
  id: string
  name: string
  slug: string
  _count: { posts: number }
}

export default function TagsPage() {
  const [tags, setTags] = React.useState<Tag[]>([])
  const [loading, setLoading] = React.useState(true)
  const [newName, setNewName] = React.useState("")
  const [isCreating, setIsCreating] = React.useState(false)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  React.useEffect(() => {
    fetch("/api/tags")
      .then((r) => r.json())
      .then(setTags)
      .finally(() => setLoading(false))
  }, [])

  async function handleCreate() {
    const name = newName.trim()
    if (!name) return
    setIsCreating(true)
    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) throw new Error()
      const tag: Tag = await res.json()
      setTags((prev) => [...prev, { ...tag, _count: { posts: 0 } }].sort((a, b) => a.name.localeCompare(b.name)))
      setNewName("")
      toast({ variant: "success", description: `Đã tạo tag "${tag.name}".` })
    } catch {
      toast({ title: "Lỗi", description: "Không thể tạo tag.", variant: "destructive" })
    } finally {
      setIsCreating(false)
    }
  }

  async function handleDelete(id: string, name: string) {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/tags/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setTags((prev) => prev.filter((t) => t.id !== id))
      toast({ variant: "success", description: `Đã xoá tag "${name}".` })
    } catch {
      toast({ title: "Lỗi", description: "Không thể xoá tag.", variant: "destructive" })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Tags" text="Quản lý tags bài viết." />

      <div className="flex gap-2 max-w-sm">
        <Input
          placeholder="Tên tag mới..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
        />
        <Button onClick={handleCreate} disabled={!newName.trim() || isCreating}>
          {isCreating && <Icons.spinner className="mr-1.5 h-4 w-4 animate-spin" />}
          Thêm
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Icons.spinner className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : tags.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">Chưa có tag nào.</p>
      ) : (
        <div className="rounded-md border divide-y">
          {tags.map((tag) => (
            <div key={tag.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <span className="font-medium">{tag.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">/{tag.slug}</span>
                <span className="ml-3 text-xs text-muted-foreground">{tag._count.posts} bài</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                disabled={deletingId === tag.id}
                onClick={() => handleDelete(tag.id, tag.name)}
              >
                {deletingId === tag.id ? (
                  <Icons.spinner className="h-4 w-4 animate-spin" />
                ) : (
                  <Icons.trash className="h-4 w-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}
