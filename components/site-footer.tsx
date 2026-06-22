import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { ModeToggle } from "@/components/mode-toggle"

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn("border-t", className)}>
      <div className="container py-8 md:py-10">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <Icons.logo />
              <span className="font-heading font-bold">Heo Quay 47</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Chuyên heo quay, vịt quay, gà quay chất lượng cao. Phục vụ tận tâm, giao hàng tận nơi.
            </p>
          </div>

          {/* Khám phá */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Khám phá</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">Trang chủ</Link></li>
              <li><Link href="/blog" className="hover:text-foreground transition-colors">Bài viết</Link></li>
              <li><Link href="/categories" className="hover:text-foreground transition-colors">Danh mục</Link></li>
            </ul>
          </div>

          {/* Về chúng tôi */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Về chúng tôi</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">Giới thiệu</Link></li>
              <li><Link href="/lien-he" className="hover:text-foreground transition-colors">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Liên hệ</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>📍 47 Đường Ẩm Thực, TP.HCM</li>
              <li>
                <a href="tel:0901234567" className="hover:text-foreground transition-colors">
                  📞 0901 234 567
                </a>
              </li>
              <li>🕐 06:00 – 20:00 hàng ngày</li>
            </ul>
          </div>
        </div>

        <hr className="my-6" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Heo Quay 47. Bảo lưu mọi quyền.
          </p>
          <ModeToggle />
        </div>
      </div>
    </footer>
  )
}
