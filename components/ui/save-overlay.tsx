"use client"

import { Icons } from "@/components/icons"

export function SaveOverlay({ visible, text = "Đang lưu..." }: { visible: boolean; text?: string }) {
  if (!visible) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-foreground">{text}</p>
      </div>
    </div>
  )
}
