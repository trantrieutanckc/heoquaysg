"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Icons } from "@/components/icons"
import { toast } from "@/components/ui/use-toast"
import { formatDate } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { BulkActionBar } from "@/components/admin/bulk-action-bar"

interface CommentWithPost {
  id: string
  content: string
  authorName: string
  authorEmail: string | null
  approved: boolean
  rating: number | null
  createdAt: Date
  post: { id: string; title: string }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" title={`${rating}/5 sao`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`h-3 w-3 ${i < rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`}
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span className="text-[11px] text-muted-foreground ml-0.5">{rating}/5</span>
    </span>
  )
}

const BULK_ACTIONS = [
  { label: "Duyệt tất cả", action: "approve", variant: "default" as const },
  { label: "Bỏ duyệt", action: "reject", variant: "outline" as const },
  { label: "Xoá", action: "delete", variant: "destructive" as const, confirm: true },
]

export function CommentList({ comments: initialComments }: { comments: CommentWithPost[] }) {
  const router = useRouter()
  const [comments, setComments] = React.useState(initialComments)
  const [deleting, setDeleting] = React.useState<string | null>(null)
  const [approving, setApproving] = React.useState<string | null>(null)
  const [selected, setSelected] = React.useState<Set<string>>(new Set())

  React.useEffect(() => { setComments(initialComments) }, [initialComments])

  const toggle = (id: string) => setSelected((prev) => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const toggleAll = () => setSelected((prev) =>
    prev.size === comments.length ? new Set() : new Set(comments.map((c) => c.id))
  )

  async function handleDelete(id: string) {
    setDeleting(id)
    const res = await fetch(`/api/comments/${id}`, { method: "DELETE" })
    setDeleting(null)
    if (!res.ok) {
      toast({ title: "Lỗi", description: "Không thể xoá bình luận.", variant: "destructive" })
      return
    }
    setComments((prev) => prev.filter((c) => c.id !== id))
    toast({ variant: "success", description: "Đã xoá bình luận." })
    router.refresh()
  }

  async function handleApprove(id: string, approved: boolean) {
    setApproving(id)
    const res = await fetch(`/api/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved }),
    })
    setApproving(null)
    if (!res.ok) {
      toast({ title: "Lỗi", description: "Không thể cập nhật bình luận.", variant: "destructive" })
      return
    }
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, approved } : c)))
    toast({ variant: "success", description: approved ? "Đã duyệt bình luận." : "Đã bỏ duyệt bình luận." })
    router.refresh()
  }

  if (!comments.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border py-12 text-center">
        <p className="text-sm text-muted-foreground">Không có bình luận nào.</p>
      </div>
    )
  }

  const allSelected = selected.size === comments.length && comments.length > 0
  const someSelected = selected.size > 0 && selected.size < comments.length

  return (
    <>
      <div>
      {/* Header row with select all */}
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
        {comments.map((comment) => (
          <div
            key={comment.id}
            className={cn(
              "flex items-start gap-3 p-4 transition-colors",
              !comment.approved && "bg-amber-50/50 dark:bg-amber-950/20"
            )}
          >
            <Checkbox
              className="mt-1 shrink-0"
              checked={selected.has(comment.id)}
              onCheckedChange={() => toggle(comment.id)}
            />

            {/* Avatar */}
            <div className="h-8 w-8 shrink-0 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
              {comment.authorName[0]?.toUpperCase()}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-1">
                <span className="font-medium text-sm">{comment.authorName}</span>
                {comment.authorEmail && (
                  <span className="text-xs text-muted-foreground">{comment.authorEmail}</span>
                )}
                {comment.rating != null && <StarRating rating={comment.rating} />}
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(comment.createdAt.toISOString())}
                </span>
                {!comment.approved && (
                  <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                    Chờ duyệt
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-1 break-all line-clamp-3">
                {comment.content}
              </p>
              <Link
                href={`/posts/${comment.post.id}`}
                className="text-xs text-blue-600 hover:underline"
                target="_blank"
              >
                {comment.post.title}
              </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              {!comment.approved ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-700 border-green-200 hover:bg-green-50 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-950/40 h-8 px-2 text-xs"
                  onClick={() => handleApprove(comment.id, true)}
                  disabled={approving === comment.id}
                  title="Duyệt bình luận"
                >
                  {approving === comment.id ? (
                    <Icons.spinner className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                  <span className="ml-1">Duyệt</span>
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground h-8 px-2 text-xs"
                  onClick={() => handleApprove(comment.id, false)}
                  disabled={approving === comment.id}
                  title="Bỏ duyệt"
                >
                  {approving === comment.id ? (
                    <Icons.spinner className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  )}
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleDelete(comment.id)}
                disabled={deleting === comment.id}
                title="Xoá"
              >
                {deleting === comment.id
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
        apiEndpoint="/api/comments/bulk"
        onClear={() => setSelected(new Set())}
      />
    </>
  )
}
