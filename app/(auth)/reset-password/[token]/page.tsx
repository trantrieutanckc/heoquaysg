"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"

export default function ResetPasswordPage({
  params,
}: {
  params: { token: string }
}) {
  const router = useRouter()
  const [password, setPassword] = React.useState("")
  const [confirm, setConfirm] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [done, setDone] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError("Mật khẩu xác nhận không khớp.")
      return
    }

    setIsLoading(true)
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: params.token, password }),
    })
    setIsLoading(false)

    if (res.ok) {
      setDone(true)
      setTimeout(() => router.push("/login"), 3000)
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? "Có lỗi xảy ra. Vui lòng thử lại.")
    }
  }

  if (done) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col items-center justify-center space-y-4 sm:w-[380px] text-center">
          <div className="h-14 w-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-7 w-7 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold">Mật khẩu đã được đặt lại!</h1>
          <p className="text-sm text-muted-foreground">Đang chuyển về trang đăng nhập...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }), "absolute left-4 top-4 md:left-8 md:top-8")}>
        <Icons.chevronLeft className="mr-2 h-4 w-4" />
        Đăng nhập
      </Link>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Đặt lại mật khẩu</h1>
          <p className="text-sm text-muted-foreground">Nhập mật khẩu mới cho tài khoản của bạn.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="password">Mật khẩu mới</Label>
            <Input
              id="password"
              type="password"
              placeholder="Ít nhất 8 ký tự, 1 chữ hoa, 1 số"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirm">Xác nhận mật khẩu</Label>
            <Input
              id="confirm"
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-destructive border border-destructive/30 bg-destructive/5 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading || !password || !confirm}
            className={cn(buttonVariants(), "w-full")}
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Đặt lại mật khẩu
          </button>
        </form>
      </div>
    </div>
  )
}
