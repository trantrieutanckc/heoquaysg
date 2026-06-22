"use client"

import * as React from "react"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

interface ImageUploaderProps {
  value?: string
  onChange: (url: string) => void
  className?: string
}

export function ImageUploader({ value, onChange, className }: ImageUploaderProps) {
  const [uploading, setUploading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [dragging, setDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  async function upload(file: File) {
    setError(null)
    setUploading(true)

    const form = new FormData()
    form.append("file", file)

    const res = await fetch("/api/upload", { method: "POST", body: form })
    const data = await res.json()

    setUploading(false)

    if (!res.ok || data.error) {
      setError(data.error ?? "Upload thất bại")
      return
    }

    onChange(data.url)
  }

  function handleFiles(files: FileList | null) {
    if (!files?.length) return
    upload(files[0])
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className={cn("grid gap-3", className)}>
      {value ? (
        <div className="relative group overflow-hidden rounded-md border aspect-video bg-muted">
          <img src={value} alt="preview" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-md bg-white/90 px-3 py-1.5 text-xs font-medium text-black hover:bg-white"
            >
              <Icons.media className="h-3.5 w-3.5" />
              Đổi ảnh
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex items-center gap-1.5 rounded-md bg-white/90 px-3 py-1.5 text-xs font-medium text-black hover:bg-white"
            >
              <Icons.trash className="h-3.5 w-3.5" />
              Xóa
            </button>
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-8 text-center cursor-pointer transition-colors",
            dragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-muted-foreground/50 hover:bg-muted/30"
          )}
        >
          {uploading ? (
            <Icons.spinner className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <Icons.media className="h-6 w-6 text-muted-foreground" />
          )}
          <div className="text-sm text-muted-foreground">
            {uploading ? (
              "Đang tải lên..."
            ) : (
              <>
                <span className="font-medium text-foreground">Nhấn để chọn</span> hoặc kéo thả ảnh vào đây
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground">PNG, JPG, WebP, GIF — tối đa 5MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
