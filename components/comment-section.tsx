"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { formatDate } from "@/lib/utils"

interface Comment {
  id: string
  content: string
  authorName: string
  createdAt: string
}

export function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = React.useState<Comment[]>([])
  const [loading, setLoading] = React.useState(true)
  const [submitting, setSubmitting] = React.useState(false)
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [content, setContent] = React.useState("")

  React.useEffect(() => {
    fetch(`/api/posts/${postId}/comments`)
      .then((r) => r.json())
      .then((data) => setComments(data))
      .finally(() => setLoading(false))
  }, [postId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !content.trim()) return

    setSubmitting(true)
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authorName: name.trim(), authorEmail: email.trim(), content: content.trim() }),
    })
    setSubmitting(false)

    if (!res.ok) {
      toast({ title: "Lỗi", description: "Không thể gửi bình luận.", variant: "destructive" })
      return
    }

    const newComment: Comment = await res.json()
    setComments((prev) => [...prev, newComment])
    setContent("")
    toast({ description: "Bình luận đã được gửi." })
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">
        Bình luận {comments.length > 0 && <span className="text-muted-foreground font-normal text-lg">({comments.length})</span>}
      </h2>

      {/* Comment list */}
      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
          <Icons.spinner className="h-4 w-4 animate-spin" />
          Đang tải bình luận...
        </div>
      ) : comments.length === 0 ? (
        <p className="text-muted-foreground text-sm py-4">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
      ) : (
        <div className="space-y-4 mb-8">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="h-8 w-8 shrink-0 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                {comment.authorName[0]?.toUpperCase()}
              </div>
              <div className="flex-1 rounded-lg border bg-muted/30 px-4 py-3">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-medium text-sm">{comment.authorName}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comment form */}
      <div className="rounded-lg border bg-muted/20 p-6">
        <h3 className="font-semibold mb-4">Để lại bình luận</h3>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="comment-name">Tên <span className="text-destructive">*</span></Label>
              <Input
                id="comment-name"
                placeholder="Tên của bạn"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="comment-email">Email <span className="text-muted-foreground text-xs">(tuỳ chọn)</span></Label>
              <Input
                id="comment-email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="comment-content">Nội dung <span className="text-destructive">*</span></Label>
            <textarea
              id="comment-content"
              rows={4}
              placeholder="Viết bình luận của bạn..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm resize-none outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={submitting || !name.trim() || !content.trim()}>
              {submitting && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Gửi bình luận
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}
