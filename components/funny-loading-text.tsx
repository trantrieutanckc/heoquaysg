"use client"

import { useFunnyLoading } from "@/hooks/use-funny-loading"

export function FunnyLoadingText() {
  const msg = useFunnyLoading(true)
  return (
    <p className="text-sm text-muted-foreground text-center mt-6 animate-pulse">{msg}</p>
  )
}
