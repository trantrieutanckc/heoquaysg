"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { toast } from "@/components/ui/use-toast"
import { formatDate } from "@/lib/utils"

interface CommentWithPost {
  id: string
  content: string
  authorName: string
  authorEmail: string | null
  createdAt: Date
  post: { id: string; title: string }
}

export function CommentList({ comments: initialComments }: { comments: CommentWithPost[] }) {
  const router = useRouter()
  const [comments, setComments] = React.useState(initialComments)
  const [deleting, setDeleting] = React.useState<string | null>(null)

  React.useEffect(() => { setComments(initialComments) }, [initialComments])

  async function handleDelete(id: string) {
    setDeleting(id)
    const res = await fetch(`/api/comments/${id}`, { method: "DELETE" })
    setDeleting(null)
    if (!res.ok) {
      toast({ title: "Lỗi", description: "Không thể xoá bình luận.", variant: "destructive" })
      return
    }
    setComments((prev) => prev.filter((c) => c.id !== id))
    toast({ description: "Đã xoá bình luận." })
    router.refresh()
  }

  if (!comments.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border py-12 text-center">
        <p className="text-sm text-muted-foreground">Chưa có bình luận nào.</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border rounded-md border">
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start gap-4 p-4">
          <div className="h-8 w-8 shrink-0 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
            {comment.authorName[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-1">
              <span className="font-medium text-sm">{comment.authorName}</span>
              {comment.authorEmail && (
                <span className="text-xs text-muted-foreground">{comment.authorEmail}</span>
              )}
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">
                {formatDate(comment.createdAt.toISOString())}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-1 line-clamp-2">{comment.content}</p>
            <Link
              href={`/posts/${comment.post.id}`}
              className="text-xs text-blue-600 hover:underline"
              target="_blank"
            >
              {comment.post.title}
            </Link>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(comment.id)}
            disabled={deleting === comment.id}
          >
            {deleting === comment.id
              ? <Icons.spinner className="h-4 w-4 animate-spin" />
              : <Icons.trash className="h-4 w-4 text-destructive" />
            }
          </Button>
        </div>
      ))}
    </div>
  )
}
