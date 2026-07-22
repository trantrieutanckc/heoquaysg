import { Metadata } from "next"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { UserAuthForm } from "@/components/user-auth-form"

export const metadata: Metadata = {
  title: "Đăng nhập | Heo Quay Bình Tân",
  description: "Đăng nhập vào tài khoản quản lý",
}

const features = [
  "Quản lý menu dễ dàng",
  "Đăng bài viết nhanh chóng",
  "Theo dõi nội dung hiệu quả",
]

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-orange-500 via-red-600 to-rose-700 flex-col items-center justify-center p-12 text-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-orange-400/25 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-rose-500/25 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-amber-300/15 blur-2xl" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="relative z-10 text-center max-w-sm">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/30 mx-auto mb-6 shadow-2xl ring-4 ring-white/10">
            <img
              src="/logo-new.svg"
              alt="Heo Quay Bình Tân"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-4xl font-bold mb-2 drop-shadow-lg">
            Heo Quay Bình Tân
          </h2>
          <p className="text-orange-100 text-base mb-10">
            Hương vị đậm đà · Truyền thống Việt
          </p>

          <div className="flex flex-col gap-3 text-left">
            {features.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10"
              >
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-orange-50 via-white to-rose-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute left-4 top-4 md:left-8 md:top-8 gap-1"
          )}
        >
          <Icons.chevronLeft className="h-4 w-4" />
          Quay lại
        </Link>

        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-orange-200 mx-auto mb-3 shadow-lg">
              <img
                src="/logo-new.svg"
                alt="Heo Quay Bình Tân"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-xl font-bold text-orange-700">
              Heo Quay Bình Tân
            </h1>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-orange-100 dark:border-gray-800 p-8">
            <div className="mb-5 text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Đăng nhập
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Nhập email và mật khẩu để tiếp tục
              </p>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent dark:via-orange-900" />
              <span className="text-base">🔥</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent dark:via-orange-900" />
            </div>

            <UserAuthForm />
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            © 2025 Heo Quay Bình Tân. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
