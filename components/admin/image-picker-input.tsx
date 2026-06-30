"use client"

import * as React from "react"
import { Icons } from "@/components/icons"

interface Props {
  id: string
  value: string
  onChange: (url: string) => void
  previewClass?: string
  placeholder?: string
}

export function ImagePickerInput({ id, value, onChange, previewClass, placeholder }: Props) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleFile(file: File) {
    setError(null)
    setUploading(true)
    try {
      const form = new FormData()
      form.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: form })
      const json = await res.json()
      if (!res.ok || !json.url) throw new Error(json.error ?? "Upload thất bại")
      onChange(json.url)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      {/* Preview */}
      {value && (
        <div className="relative group w-fit">
          <img
            src={value}
            alt="preview"
            className={previewClass ?? "h-20 w-20 rounded-lg object-cover border"}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ×
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm hover:bg-muted transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <Icons.spinner className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Icons.media className="h-3.5 w-3.5" />
          )}
          {uploading ? "Đang tải..." : value ? "Đổi ảnh" : "Chọn ảnh"}
        </button>
        <span className="text-xs text-muted-foreground">hoặc</span>
        <input
          id={id}
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "https://..."}
          className="flex-1 rounded-md border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ""
        }}
      />
    </div>
  )
}
