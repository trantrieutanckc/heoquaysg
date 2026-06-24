"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/utils"

interface Page {
  id: string
  title: string
  slug: string
  published: boolean
  updatedAt: string
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

export default function PagesPage() {
  const router = useRouter()
  const [pages, setPages] = React.useState<Page[]>([])
  const [loading, setLoading] = React.useState(true)
  const [creating, setCreating] = React.useState(false)
  const [deleting, setDeleting] = React.useState<string | null>(null)
  const [showForm, setShowForm] = React.useState(false)
  const [newTitle, setNewTitle] = React.useState("")
  const [newSlug, setNewSlug] = React.useState("")
  const [slugEdited, setSlugEdited] = React.useState(false)

  React.useEffect(() => {
    fetch("/api/pages")
      .then((r) => r.json())
      .then(setPages)
      .catch(() => toast({ title: "Lỗi", description: "Không thể tải danh sách trang.", variant: "destructive" }))
      .finally(() => setLoading(false))
  }, [])

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
      toast({ title: "Lỗi", description: data.error ?? "Không thể tạo trang.", variant: "destructive" })
      return
    }

    const page = await res.json()
    setShowForm(false)
    setNewTitle("")
    setNewSlug("")
    setSlugEdited(false)
    router.push(`/editor/pages/${page.id}`)
  }

  async function handleDelete(id: string) {
    if (!confirm("Xoá trang này?")) return
    setDeleting(id)
    await fetch(`/api/pages/${id}`, { method: "DELETE" })
    setDeleting(null)
    setPages((prev) => prev.filter((p) => p.id !== id))
    toast({ description: "Đã xoá trang." })
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Trang tĩnh" text={`${pages.length} trang`}>
        <Button size="sm" onClick={() => setShowForm((v) => !v)}>
          <Icons.add className="mr-2 h-4 w-4" />
          Tạo trang mới
        </Button>
      </DashboardHeader>

      {/* Create form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-lg border bg-muted/30 p-4 grid gap-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="new-title">Tiêu đề</Label>
              <Input
                id="new-title"
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
              <Label htmlFor="new-slug">Slug (URL)</Label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground shrink-0">/pages/</span>
                <Input
                  id="new-slug"
                  placeholder="gioi-thieu"
                  value={newSlug}
                  onChange={(e) => { setNewSlug(e.target.value); setSlugEdited(true) }}
                  required
                  pattern="[a-z0-9-]+"
                  title="Chỉ chữ thường, số và dấu gạch ngang"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={creating}>
              {creating && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Tạo và mở editor
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => { setShowForm(false); setNewTitle(""); setNewSlug("") }}>
              Huỷ
            </Button>
          </div>
        </form>
      )}

      {/* Pages list */}
      {loading ? (
        <div className="divide-y divide-border rounded-md border">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-4">
              <div className="h-4 w-48 animate-pulse rounded bg-muted" />
              <div className="ml-auto h-4 w-20 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : pages.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-md border py-12 text-center">
          <p className="text-sm text-muted-foreground">Chưa có trang nào. Tạo trang đầu tiên!</p>
        </div>
      ) : (
        <div className="divide-y divide-border rounded-md border">
          {pages.map((page) => (
            <div key={page.id} className="flex items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm truncate">{page.title}</span>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      page.published
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {page.published ? "Đã đăng" : "Nháp"}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-muted-foreground">/pages/{page.slug}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{formatDate(page.updatedAt)}</span>
                  {page.published && (
                    <>
                      <span className="text-xs text-muted-foreground">·</span>
                      <Link
                        href={`/pages/${page.slug}`}
                        target="_blank"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Xem trang ↗
                      </Link>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Link
                  href={`/editor/pages/${page.id}`}
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-8 w-8 p-0")}
                  title="Chỉnh sửa"
                >
                  <Icons.edit className="h-4 w-4" />
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Xoá"
                  disabled={deleting === page.id}
                  onClick={() => handleDelete(page.id)}
                >
                  {deleting === page.id
                    ? <Icons.spinner className="h-4 w-4 animate-spin" />
                    : <Icons.trash className="h-4 w-4 text-destructive" />
                  }
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}
