"use client"

import { FunnyLoader } from "@/components/funny-loader"

export function SaveOverlay({ visible, text }: { visible: boolean; text?: string }) {
  if (!visible) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">
      <FunnyLoader />
    </div>
  )
}
