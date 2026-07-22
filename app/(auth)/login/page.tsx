import { Metadata } from "next"
import Link from "next/link"

import { Icons } from "@/components/icons"
import { UserAuthForm } from "@/components/user-auth-form"

export const metadata: Metadata = {
  title: "Đăng nhập | Heo Quay Bình Tân",
  description: "Đăng nhập vào tài khoản quản lý",
}

const slides = [
  "/images/hero.png",
  "/images/shop/heo-quay-lo-1.jpg",
  "/images/shop/heo-quay-lo-2.jpg",
  "/images/shop/heo-quay-can-1.jpg",
]

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <style>{`
        @keyframes bgSlide {
          0%   { opacity: 0; }
          8%   { opacity: 1; }
          25%  { opacity: 1; }
          33%  { opacity: 0; }
          100% { opacity: 0; }
        }
        .slide { animation: bgSlide 24s infinite; }
        .slide:nth-child(1) { animation-delay: 0s; }
        .slide:nth-child(2) { animation-delay: 6s; }
        .slide:nth-child(3) { animation-delay: 12s; }
        .slide:nth-child(4) { animation-delay: 18s; }
      `}</style>

      {/* Slideshow */}
      {slides.map((src, i) => (
        <div
          key={i}
          className="slide absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: `url('${src}')` }}
        />
      ))}

      {/* Cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-orange-950/35 to-black/75" />
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.55) 100%)" }}
      />

      {/* Back button */}
      <Link
        href="/"
        className="absolute left-4 top-4 md:left-8 md:top-8 z-20 inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
      >
        <Icons.chevronLeft className="h-4 w-4" />
        Quay lại
      </Link>

      <div className="relative z-10 w-full max-w-sm px-4">
        {/* Logo */}
        <div className="text-center mb-7">
          <div className="relative w-28 h-28 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full bg-orange-500/40 blur-2xl scale-125" />
            <div className="absolute inset-0 rounded-full bg-amber-300/20 blur-xl scale-110" />
            <div className="relative w-full h-full rounded-full overflow-hidden border-[3px] border-white/50 shadow-2xl">
              <img src="/logo-new.svg" alt="Heo Quay Bình Tân" className="w-full h-full object-cover" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-wide drop-shadow-xl">
            Heo Quay Bình Tân
          </h1>
          <p className="text-xs text-orange-200/80 mt-1.5 tracking-widest uppercase">
            Hương vị đậm đà · Truyền thống Việt
          </p>
        </div>

        {/* Glass card */}
        <div
          className="rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
          style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.18)",
          }}
        >
          <div className="h-[2px] w-full" style={{ background: "linear-gradient(90deg, transparent, #f97316, #dc2626, #be123c, transparent)" }} />

          <div className="p-8">
            <div className="flex justify-center mb-5">
              <span
                className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-200 px-3 py-1.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
              >
                🔐 Khu vực quản trị
              </span>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-white">Đăng nhập</h2>
              <p className="text-sm text-white/50 mt-1">Nhập thông tin để truy cập hệ thống</p>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.2))" }} />
              <span className="text-sm">🔥</span>
              <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, rgba(255,255,255,0.2))" }} />
            </div>

            <div className="[&_label]:text-white/70 [&_input]:bg-white/10 [&_input]:border-white/20 [&_input]:text-white [&_input]:placeholder:text-white/30 [&_input:focus-visible]:ring-orange-400 [&_input:focus-visible]:border-orange-400 [&_a]:text-white/50 [&_a:hover]:text-white/80">
              <UserAuthForm />
            </div>
          </div>

          <div className="h-[1px] w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }} />
        </div>

        <p className="text-center text-xs text-white/30 mt-5 tracking-wide">
          © 2025 Heo Quay Bình Tân · All rights reserved
        </p>
      </div>
    </div>
  )
}
