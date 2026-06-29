"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button, buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Icons } from "@/components/icons"
import { toast } from "@/components/ui/use-toast"
import { cn, formatDate } from "@/lib/utils"
import { BulkActionBar } from "@/components/admin/bulk-action-bar"

interface Page {
  id: string
  title: string
  slug: string
  published: boolean
  updatedAt: string
}

const BULK_ACTIONS = [
  { label: "Đăng tất cả", action: "publish", variant: "default" as const },
  { label: "Huỷ đăng", action: "unpublish", variant: "outline" as const },
  { label: "Xoá", action: "delete", variant: "destructive" as const, confirm: true },
]

export function PageList({ pages: initialPages }: { pages: Page[] }) {
  const router = useRouter()
  const [pages, setPages] = React.useState(initialPages)
  const [deleting, setDeleting] = React.useState<string | null>(null)
  const [selected, setSelected] = React.useState<Set<string>>(new Set())

  React.useEffect(() => { setPages(initialPages) }, [initialPages])

  const toggle = (id: string) => setSelected((prev) => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const toggleAll = () => setSelected((prev) =>
    prev.size === pages.length ? new Set() : new Set(pages.map((p) => p.id))
  )

  const allSelected = selected.size === pages.length && pages.length > 0
  const someSelected = selected.size > 0 && selected.size < pages.length

  async function handleDelete(id: string) {
    if (!confirm("Xoá trang này?")) return
    setDeleting(id)
    await fetch(`/api/pages/${id}`, { method: "DELETE" })
    setDeleting(null)
    setPages((prev) => prev.filter((p) => p.id !== id))
    toast({ description: "Đã xoá trang." })
    router.refresh()
  }

  if (pages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border py-12 text-center">
        <p className="text-sm text-muted-foreground">Chưa có trang nào. Tạo trang đầu tiên!</p>
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

      <div className="divide-y divide-border rounded-b-md border border-t-0">
        {pages.map((page) => (
          <div key={page.id} className="flex items-center gap-3 p-4">
            <Checkbox
              checked={selected.has(page.id)}
              onCheckedChange={() => toggle(page.id)}
              aria-label={`Chọn ${page.title}`}
            />
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
      </div>

      <BulkActionBar
        selectedCount={selected.size}
        selectedIds={[...selected]}
        actions={BULK_ACTIONS}
        apiEndpoint="/api/pages/bulk"
        onClear={() => setSelected(new Set())}
      />
    </>
  )
}
