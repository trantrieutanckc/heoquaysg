"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { userAuthSchema } from "@/lib/validations/auth"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { FunnyLoader } from "@/components/funny-loader"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof userAuthSchema>

const MAX_ATTEMPTS = 5

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  })
  const [isLoading, setIsLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [failCount, setFailCount] = React.useState(0)
  const [lockedUntil, setLockedUntil] = React.useState<number | null>(null)
  const [countdown, setCountdown] = React.useState(0)
  const searchParams = useSearchParams()

  React.useEffect(() => {
    if (!lockedUntil) return
    const tick = () => {
      const secs = Math.ceil((lockedUntil - Date.now()) / 1000)
      if (secs <= 0) {
        setLockedUntil(null)
        setCountdown(0)
        setFailCount(0)
      } else {
        setCountdown(secs)
      }
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [lockedUntil])

  const isLocked = !!lockedUntil

  async function onSubmit(data: FormData) {
    if (isLocked) return
    setIsLoading(true)

    const result = await signIn("credentials", {
      email: data.email.toLowerCase(),
      password: data.password,
      redirect: false,
      callbackUrl: searchParams?.get("from") || "/dashboard",
    })

    // Server-side lockout
    if (result?.error?.startsWith("LOCKED:")) {
      const mins = parseInt(result.error.split(":")[1]) || 15
      setLockedUntil(Date.now() + mins * 60 * 1000)
      setIsLoading(false)
      toast({
        title: "Tài khoản tạm khóa",
        description: `Đăng nhập bị tạm khóa do quá nhiều lần thử sai. Thử lại sau ${mins} phút.`,
        variant: "destructive",
      })
      return
    }

    if (!result?.ok || result?.error) {
      const newCount = failCount + 1
      setFailCount(newCount)
      setIsLoading(false)

      if (newCount >= MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + 15 * 60 * 1000)
        toast({
          title: "Tài khoản tạm khóa",
          description: "Quá nhiều lần thử sai. Thử lại sau 15 phút.",
          variant: "destructive",
        })
        return
      }

      const remaining = MAX_ATTEMPTS - newCount
      return toast({
        title: "Đăng nhập thất bại",
        description: remaining <= 2
          ? `Email hoặc mật khẩu không đúng. Còn ${remaining} lần thử trước khi bị khóa.`
          : "Email hoặc mật khẩu không đúng. Vui lòng thử lại.",
        variant: "destructive",
      })
    }

    // Redirect based on role
    const sessionRes = await fetch("/api/auth/session")
    const session = await sessionRes.json()
    const role = session?.user?.role
    const raw = searchParams?.get("from") ?? ""
    const from = raw.startsWith("/") && !raw.startsWith("//") ? raw : null
    const dest = from ?? (role === "ADMIN" || role === "EDITOR" ? "/dashboard/docs" : "/")

    toast({ variant: "success", description: "Đăng nhập thành công! Đang chuyển hướng..." })
    await new Promise((r) => setTimeout(r, 900))
    window.location.href = dest
  }

  return (
    <>
    {isLoading && (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/90 backdrop-blur-sm">
        <FunnyLoader />
      </div>
    )}
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading || isLocked}
              className="focus-visible:ring-orange-400 focus-visible:border-orange-400"
              {...register("email")}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="password">Mật khẩu</Label>
            <div className="relative">
              <Input
                id="password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                disabled={isLoading || isLocked}
                className="focus-visible:ring-orange-400 focus-visible:border-orange-400"
                {...register("password")}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                disabled={isLocked}
              >
                {showPassword ? (
                  <Icons.hide className="h-4 w-4" />
                ) : (
                  <Icons.show className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors?.password && (
              <p className="px-1 text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>

          {isLocked && (
            <p className="text-center text-sm text-destructive">
              Thử lại sau{" "}
              <span className="font-semibold tabular-nums">
                {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, "0")}
              </span>
            </p>
          )}

          <button
            className={cn(
              "w-full h-10 rounded-md px-4 py-2 text-sm font-semibold text-white transition-all duration-200",
              "shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]",
              isLocked || isLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-orange-500 via-red-500 to-rose-600 hover:from-orange-600 hover:via-red-600 hover:to-rose-700"
            )}
            disabled={isLoading || isLocked}
          >
            {isLocked ? "🔒 Tài khoản tạm khóa" : "Đăng nhập →"}
          </button>

          <div className="text-center">
            <a href="/forgot-password" className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline">
              Quên mật khẩu?
            </a>
          </div>
        </div>
      </form>
    </div>
    </>
  )
}
