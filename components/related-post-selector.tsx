"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface PostOption {
  id: string
  title: string
}

interface RelatedPostSelectorProps {
  allPosts: PostOption[]
  currentPostId: string
  selected: string[]
  onChange: (ids: string[]) => void
}

const MAX = 4

export function RelatedPostSelector({ allPosts, currentPostId, selected, onChange }: RelatedPostSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [draft, setDraft] = React.useState<string[]>(selected)

  const filtered = allPosts.filter(
    (p) => p.id !== currentPostId && p.title.toLowerCase().includes(search.toLowerCase())
  )

  function toggle(id: string) {
    setDraft((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < MAX ? [...prev, id] : prev
    )
  }

  function handleOpen() {
    setDraft(selected)
    setSearch("")
    setOpen(true)
  }

  function handleSave() {
    onChange(draft)
    setOpen(false)
  }

  return (
    <>
      <Button type="button" variant={selected.length ? "secondary" : "outline"} size="sm" onClick={handleOpen}>
        Related {selected.length ? `(${selected.length})` : ""}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chọn bài viết liên quan</DialogTitle>
          </DialogHeader>

          <p className="text-xs text-muted-foreground -mt-1">
            Chọn tối đa {MAX} bài. Nếu không chọn, hệ thống tự hiển thị bài cùng danh mục.
          </p>

          <Input
            placeholder="Tìm bài viết..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="max-h-64 overflow-y-auto space-y-1 border rounded-md p-2">
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Không tìm thấy bài viết</p>
            )}
            {filtered.map((post) => {
              const checked = draft.includes(post.id)
              const disabled = !checked && draft.length >= MAX
              return (
                <label
                  key={post.id}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 cursor-pointer transition-colors ${
                    checked ? "bg-primary/10" : disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-muted"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={() => toggle(post.id)}
                    className="h-4 w-4 rounded"
                  />
                  <span className="text-sm line-clamp-2">{post.title}</span>
                </label>
              )
            })}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Huỷ</Button>
            {draft.length > 0 && (
              <Button variant="ghost" onClick={() => setDraft([])}>Xoá hết</Button>
            )}
            <Button onClick={handleSave}>Lưu ({draft.length}/{MAX})</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
