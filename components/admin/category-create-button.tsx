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
import { ImageUploader } from "@/components/admin/image-uploader"

export function CategoryCreateButton() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")
  const [imageUrl, setImageUrl] = React.useState("")
  const [imageAlt, setImageAlt] = React.useState("")
  const [imageTitle, setImageTitle] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  function toSlug(str: string) {
    return str
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
  }

  async function handleCreate() {
    if (!name.trim()) return
    setIsLoading(true)

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        slug: toSlug(name),
        image: imageUrl.trim()
          ? { url: imageUrl.trim(), alt: imageAlt.trim(), title: imageTitle.trim() }
          : null,
      }),
    })

    setIsLoading(false)

    if (!res.ok) {
      return toast({
        title: "Lỗi",
        description: "Không thể tạo category. Tên có thể đã tồn tại.",
        variant: "destructive",
      })
    }

    setOpen(false)
    setName("")
    setImageUrl("")
    setImageAlt("")
    setImageTitle("")
    router.refresh()
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Icons.add className="mr-2 h-4 w-4" />
        Tạo Category
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo category mới</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-2">
              <Label htmlFor="category-name">Tên category</Label>
              <Input
                id="category-name"
                placeholder="VD: Công nghệ"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />
            </div>
            <div className="grid gap-2">
              <Label>Ảnh category</Label>
              <ImageUploader value={imageUrl} onChange={setImageUrl} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="image-alt">Alt text</Label>
                <Input
                  id="image-alt"
                  placeholder="Mô tả ảnh"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image-title">Title</Label>
                <Input
                  id="image-title"
                  placeholder="Tiêu đề ảnh"
                  value={imageTitle}
                  onChange={(e) => setImageTitle(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Huỷ</Button>
            <Button onClick={handleCreate} disabled={!name.trim() || isLoading}>
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Tạo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
