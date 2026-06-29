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
  rating: number | null
  createdAt: string
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = React.useState(0)
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const star = i + 1
        const active = hovered ? star <= hovered : star <= value
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(value === star ? 0 : star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="focus:outline-none"
            aria-label={`${star} sao`}
          >
            <svg
              viewBox="0 0 24 24"
              className={`h-7 w-7 transition-colors ${active ? "fill-amber-400 stroke-amber-400" : "fill-transparent stroke-amber-300 hover:stroke-amber-400"}`}
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
            </svg>
          </button>
        )
      })}
      {value > 0 && (
        <button
          type="button"
          onClick={() => onChange(0)}
          className="ml-1 text-xs text-muted-foreground hover:text-foreground"
          title="Bỏ đánh giá"
        >
          ✕
        </button>
      )}
    </div>
  )
}

function InlineStars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`h-3 w-3 ${i < rating ? "fill-amber-400 stroke-amber-400" : "fill-transparent stroke-amber-300"}`}
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
      ))}
    </span>
  )
}

export function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = React.useState<Comment[]>([])
  const [loading, setLoading] = React.useState(true)
  const [submitting, setSubmitting] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [content, setContent] = React.useState("")
  const [rating, setRating] = React.useState(0)
  const [hp, setHp] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    fetch(`/api/posts/${postId}/comments`)
      .then((r) => {
        if (!r.ok) throw new Error("fetch failed")
        return r.json()
      })
      .then((data) => setComments(data))
      .catch(() =>
        toast({ title: "Lỗi", description: "Không thể tải bình luận.", variant: "destructive" })
      )
      .finally(() => setLoading(false))
  }, [postId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!name.trim() || !content.trim()) return

    setSubmitting(true)
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        authorName: name.trim(),
        authorEmail: email.trim(),
        content: content.trim(),
        rating: rating > 0 ? rating : undefined,
        _hp: hp,
      }),
    })
    setSubmitting(false)

    if (res.status === 429) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? "Quá nhiều bình luận. Vui lòng thử lại sau.")
      return
    }
    if (res.status === 422) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? "Bình luận không hợp lệ.")
      return
    }
    if (!res.ok) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.")
      return
    }

    setSubmitted(true)
    setName("")
    setEmail("")
    setContent("")
    setRating(0)
  }

  const ratingComments = comments.filter((c) => c.rating != null)
  const avgRating =
    ratingComments.length > 0
      ? ratingComments.reduce((sum, c) => sum + (c.rating ?? 0), 0) / ratingComments.length
      : null

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-2">
        Đánh giá & Bình luận{" "}
        {comments.length > 0 && (
          <span className="text-muted-foreground font-normal text-lg">({comments.length})</span>
        )}
      </h2>

      {/* Average rating summary */}
      {avgRating != null && (
        <div className="flex items-center gap-3 mb-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
          <span className="text-4xl font-bold text-amber-600">{avgRating.toFixed(1)}</span>
          <div>
            <div className="flex gap-0.5 mb-0.5">
              {Array.from({ length: 5 }).map((_, i) => {
                const fill = Math.max(0, Math.min(1, avgRating - i))
                return (
                  <svg key={i} viewBox="0 0 24 24" className="h-5 w-5" strokeWidth={1.5}>
                    <defs>
                      <linearGradient id={`sg-${i}`} x1="0" x2="1" y1="0" y2="0">
                        <stop offset={`${fill * 100}%`} stopColor="#fbbf24" />
                        <stop offset={`${fill * 100}%`} stopColor="transparent" />
                      </linearGradient>
                    </defs>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      stroke="#fbbf24"
                      fill={`url(#sg-${i})`}
                      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                    />
                  </svg>
                )
              })}
            </div>
            <p className="text-xs text-muted-foreground">{ratingComments.length} đánh giá</p>
          </div>
        </div>
      )}

      {/* Comment list */}
      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
          <Icons.spinner className="h-4 w-4 animate-spin" />
          Đang tải bình luận...
        </div>
      ) : comments.length === 0 ? (
        <p className="text-muted-foreground text-sm py-4">
          Chưa có đánh giá nào. Hãy là người đầu tiên!
        </p>
      ) : (
        <div className="space-y-4 mb-8">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="h-8 w-8 shrink-0 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                {comment.authorName[0]?.toUpperCase()}
              </div>
              <div className="flex-1 rounded-lg border bg-muted/30 px-4 py-3">
                <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                  <span className="font-medium text-sm">{comment.authorName}</span>
                  {comment.rating != null && <InlineStars rating={comment.rating} />}
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
        <h3 className="font-semibold mb-4">Để lại đánh giá</h3>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <p className="font-medium">Cảm ơn bạn đã đánh giá!</p>
            <p className="text-sm text-muted-foreground">
              Đánh giá của bạn đang chờ kiểm duyệt và sẽ hiện sau khi được duyệt.
            </p>
            <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
              Viết thêm đánh giá
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4">
            {/* Star rating */}
            <div className="grid gap-2">
              <Label>Đánh giá sao <span className="text-muted-foreground text-xs">(tuỳ chọn)</span></Label>
              <StarPicker value={rating} onChange={setRating} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="comment-name">
                  Tên <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="comment-name"
                  placeholder="Tên của bạn"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="comment-email">
                  Email{" "}
                  <span className="text-muted-foreground text-xs">(tuỳ chọn)</span>
                </Label>
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
              <Label htmlFor="comment-content">
                Nội dung <span className="text-destructive">*</span>
              </Label>
              <textarea
                id="comment-content"
                rows={4}
                placeholder="Chia sẻ trải nghiệm của bạn... (không chứa link)"
                value={content}
                onChange={(e) => { setContent(e.target.value); setError(null) }}
                required
                maxLength={2000}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm resize-none outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="text-xs text-muted-foreground text-right">
                {content.length}/2000
              </p>
            </div>

            {/* Honeypot */}
            <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }}>
              <label htmlFor="_hp_field">Website</label>
              <input
                id="_hp_field"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={submitting || !name.trim() || !content.trim()}
              >
                {submitting && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Gửi đánh giá
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
