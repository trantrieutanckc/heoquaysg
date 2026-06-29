"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Icons } from "@/components/icons"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
}

interface PostCategoryButtonProps {
  postId: string
  allCategories: Category[]
  currentCategoryIds: string[]
}

export function PostCategoryButton({
  postId,
  allCategories,
  currentCategoryIds,
}: PostCategoryButtonProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<string[]>(currentCategoryIds)
  const [isSaving, setIsSaving] = React.useState(false)

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  async function handleSave() {
    setIsSaving(true)
    const res = await fetch(`/api/posts/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryIds: selected }),
    })
    setIsSaving(false)

    if (!res.ok) {
      return toast({
        title: "Lỗi",
        description: "Không thể lưu category.",
        variant: "destructive",
      })
    }

    toast({ description: "Đã cập nhật category." })
    setOpen(false)
    router.refresh()
  }

  const selectedNames = allCategories
    .filter((c) => selected.includes(c.id))
    .map((c) => c.name)

  return (
    <Popover open={open} onOpenChange={(v) => { setOpen(v); if (v) setSelected(currentCategoryIds) }}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" type="button">
          <Icons.post className="mr-1 h-3 w-3" />
          {selectedNames.length > 0
            ? selectedNames.join(", ")
            : "Category"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="end">
        {allCategories.length === 0 ? (
          <p className="text-sm text-muted-foreground px-2 py-1">
            Chưa có category nào.
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-0.5 mb-2">
              {allCategories.map((cat) => {
                const isSelected = selected.includes(cat.id)
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggle(cat.id)}
                    className="flex items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                  >
                    <span>{cat.name}</span>
                    {isSelected && (
                      <Icons.check className="h-4 w-4 text-primary" />
                    )}
                  </button>
                )
              })}
            </div>
            <div className="border-t pt-2">
              <Button
                size="sm"
                className="w-full"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving && (
                  <Icons.spinner className="mr-2 h-3 w-3 animate-spin" />
                )}
                Lưu
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}
