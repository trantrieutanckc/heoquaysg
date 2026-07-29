import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { env } from "@/env.mjs"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`
}

// Đảm bảo og:image luôn là absolute URL (Google yêu cầu)
export function ogUrl(url: string): string {
  if (!url) return absoluteUrl("/opengraph-image.jpg")
  if (url.startsWith("http://") || url.startsWith("https://")) return url
  return absoluteUrl(url)
}
