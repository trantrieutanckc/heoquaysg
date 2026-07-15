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
import { Icons } from "@/components/icons"
import { toast } from "@/components/ui/use-toast"
import { ImagePickerInput } from "@/components/admin/image-picker-input"

interface PostAddImageButtonProps {
  postId: string
}

export function PostAddImageButton({ postId }: PostAddImageButtonProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [url, setUrl] = React.useState("")
  const [isSaving, setIsSaving] = React.useState(false)

  async function handleSave() {
    if (!url) return
    setIsSaving(true)

    const res = await fetch(`/api/posts/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: { url, alt: "", title: "" } }),
    })

    setIsSaving(false)

    if (!res.ok) {
      return toast({
        title: "Lỗi",
        description: "Không thể lưu ảnh. Vui lòng thử lại.",
        variant: "destructive",
      })
    }

    setOpen(false)
    setUrl("")
    router.refresh()
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Icons.media className="mr-2 h-4 w-4" />
        Add Image
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm ảnh cho bài viết</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <ImagePickerInput
              id="post-image"
              value={url}
              onChange={setUrl}
              previewClass="h-32 w-full rounded-lg object-cover border"
              placeholder="https://..."
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Huỷ</Button>
            <Button onClick={handleSave} disabled={!url || isSaving}>
              {isSaving && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
