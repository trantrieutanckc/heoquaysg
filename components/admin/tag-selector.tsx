"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Icons } from "@/components/icons"
import { toast } from "@/components/ui/use-toast"

interface Tag {
  id: string
  name: string
  slug: string
}

interface TagSelectorProps {
  tags: Tag[]
  selected: string[]
  onChange: (ids: string[]) => void
  onTagCreated?: (tag: Tag) => void
}

export function TagSelector({ tags, selected, onChange, onTagCreated }: TagSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const [newName, setNewName] = React.useState("")
  const [isCreating, setIsCreating] = React.useState(false)

  function toggle(id: string) {
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id])
  }

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
      onTagCreated?.(tag)
      onChange([...selected, tag.id])
      setNewName("")
      toast({ variant: "success", description: `Đã tạo tag "${tag.name}".` })
    } catch {
      toast({ title: "Lỗi", description: "Không thể tạo tag.", variant: "destructive" })
    } finally {
      setIsCreating(false)
    }
  }

  const selectedNames = tags.filter((t) => selected.includes(t.id)).map((t) => t.name)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" type="button">
          <Icons.page className="mr-2 h-4 w-4" />
          {selectedNames.length > 0 ? selectedNames.join(", ") : "Chọn tags"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-2">
        <div className="flex flex-col gap-1 max-h-48 overflow-y-auto mb-2">
          {tags.length === 0 ? (
            <p className="text-sm text-muted-foreground px-2 py-1">Chưa có tag.</p>
          ) : (
            tags.map((tag) => {
              const isSelected = selected.includes(tag.id)
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggle(tag.id)}
                  className="flex items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                >
                  <span>{tag.name}</span>
                  {isSelected && <Icons.check className="h-4 w-4" />}
                </button>
              )
            })
          )}
        </div>
        <div className="border-t pt-2 flex gap-1">
          <Input
            placeholder="Tạo tag mới..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleCreate())}
            className="h-7 text-sm"
          />
          <Button
            type="button"
            size="sm"
            className="h-7 px-2"
            onClick={handleCreate}
            disabled={!newName.trim() || isCreating}
          >
            {isCreating ? <Icons.spinner className="h-3 w-3 animate-spin" /> : "+"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
