"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { toast } from "@/components/ui/use-toast"

const STATIC_PAGES = [
  { label: "Trang chủ", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
  { label: "Categories", href: "/categories" },
]

interface Category { id: string; name: string; slug: string }

export function MenuCreateButton({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [type, setType] = React.useState<"custom" | "category" | "page">("custom")
  const [title, setTitle] = React.useState("")
  const [href, setHref] = React.useState("")
  const [categoryId, setCategoryId] = React.useState("")
  const [pageHref, setPageHref] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  function handleTypeChange(t: "custom" | "category" | "page") {
    setType(t)
    setTitle("")
    setHref("")
    setCategoryId("")
    setPageHref("")
  }

  function handleCategorySelect(id: string) {
    setCategoryId(id)
    const cat = categories.find((c) => c.id === id)
    if (cat) {
      setTitle(cat.name)
      setHref(`/categories/${cat.slug}`)
    }
  }

  function handlePageSelect(h: string) {
    setPageHref(h)
    const page = STATIC_PAGES.find((p) => p.href === h)
    if (page) setTitle(page.label)
    setHref(h)
  }

  async function handleCreate() {
    const finalTitle = title.trim()
    const finalHref = type === "category" ? href : type === "page" ? pageHref : href.trim()
    if (!finalTitle || !finalHref) return

    setIsLoading(true)
    const res = await fetch("/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: finalTitle,
        href: finalHref,
        type,
        categoryId: type === "category" ? categoryId : null,
      }),
    })
    setIsLoading(false)

    if (!res.ok) {
      return toast({ title: "Lỗi", description: "Không thể tạo menu item.", variant: "destructive" })
    }

    setOpen(false)
    setTitle("")
    setHref("")
    setCategoryId("")
    setPageHref("")
    setType("custom")
    router.refresh()
  }

  const canSubmit = (() => {
    if (!title.trim()) return false
    if (type === "custom") return !!href.trim()
    if (type === "category") return !!categoryId
    if (type === "page") return !!pageHref
    return false
  })()

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Icons.add className="mr-2 h-4 w-4" />
        Thêm item
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm menu item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            {/* Loại */}
            <div className="grid gap-2">
              <Label>Loại</Label>
              <div className="flex gap-2">
                {(["custom", "category", "page"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleTypeChange(t)}
                    className={`flex-1 rounded-md border px-3 py-1.5 text-sm transition-colors ${
                      type === t
                        ? "border-primary bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                  >
                    {t === "custom" ? "Tuỳ chỉnh" : t === "category" ? "Category" : "Page"}
                  </button>
                ))}
              </div>
            </div>

            {/* Category selector */}
            {type === "category" && (
              <div className="grid gap-2">
                <Label>Chọn category</Label>
                <select
                  value={categoryId}
                  onChange={(e) => handleCategorySelect(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                >
                  <option value="">-- Chọn --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Page selector */}
            {type === "page" && (
              <div className="grid gap-2">
                <Label>Chọn trang</Label>
                <select
                  value={pageHref}
                  onChange={(e) => handlePageSelect(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                >
                  <option value="">-- Chọn --</option>
                  {STATIC_PAGES.map((p) => (
                    <option key={p.href} value={p.href}>{p.label} ({p.href})</option>
                  ))}
                </select>
              </div>
            )}

            {/* Tên hiển thị */}
            <div className="grid gap-2">
              <Label htmlFor="menu-title">Tên hiển thị</Label>
              <Input
                id="menu-title"
                placeholder="VD: Trang chủ"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Href — chỉ hiện khi custom */}
            {type === "custom" && (
              <div className="grid gap-2">
                <Label htmlFor="menu-href">Đường dẫn (href)</Label>
                <Input
                  id="menu-href"
                  placeholder="VD: /ve-chung-toi"
                  value={href}
                  onChange={(e) => setHref(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                />
              </div>
            )}

            {/* Href preview */}
            {type !== "custom" && (href || pageHref) && (
              <p className="text-xs text-muted-foreground">
                Href: <span className="font-mono">{href || pageHref}</span>
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Huỷ</Button>
            <Button onClick={handleCreate} disabled={!canSubmit || isLoading}>
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Thêm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
