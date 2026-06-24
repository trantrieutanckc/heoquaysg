"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [sent, setSent] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    setIsLoading(false)

    if (res.status === 422) {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? "Email không hợp lệ.")
      return
    }

    setSent(true)
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }), "absolute left-4 top-4 md:left-8 md:top-8")}>
        <Icons.chevronLeft className="mr-2 h-4 w-4" />
        Đăng nhập
      </Link>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]">
        {sent ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="h-14 w-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-7 w-7 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold">Kiểm tra email của bạn</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Nếu tài khoản tồn tại, chúng tôi đã gửi link đặt lại mật khẩu đến{" "}
                <span className="font-medium">{email}</span>. Link có hiệu lực trong 1 giờ.
              </p>
            </div>
            <Link href="/login" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
              Quay lại đăng nhập
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Quên mật khẩu?</h1>
              <p className="text-sm text-muted-foreground">
                Nhập email tài khoản của bạn, chúng tôi sẽ gửi link đặt lại mật khẩu.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@heoquay.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-sm text-destructive border border-destructive/30 bg-destructive/5 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading || !email}
                className={cn(buttonVariants(), "w-full")}
              >
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Gửi link đặt lại mật khẩu
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
