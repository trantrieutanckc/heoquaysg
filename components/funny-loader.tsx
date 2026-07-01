"use client"

import * as React from "react"

const MESSAGES = [
  "Đang quay heo...",
  "Heo sắp chín rồi 🔥",
  "Mỡ đang chảy đây...",
  "Thơm quá trời ơi!",
  "Xin chờ một xíu...",
  "Da heo đang giòn lên...",
]

export function FunnyLoader() {
  const [msg] = React.useState(() => MESSAGES[Math.floor(Math.random() * MESSAGES.length)])

  return (
    <div className="flex items-center justify-center py-24">
      <div className="flex flex-col items-center gap-4 select-none">
        <div className="relative">
          <span className="text-7xl block animate-spin" style={{ animationDuration: "1.8s" }}>🐷</span>
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl animate-bounce">💨</span>
        </div>
        <p className="text-sm font-medium text-muted-foreground tracking-wide animate-pulse">{msg}</p>
      </div>
    </div>
  )
}
