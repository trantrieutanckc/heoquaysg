import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"

interface SiteFooterProps extends React.HTMLAttributes<HTMLElement> {
  siteName?: string
  logoUrl?: string
  siteDescription?: string
  contactPhone?: string
  contactEmail?: string
  contactAddress?: string
  businessHours?: string
  socialFacebook?: string
  socialInstagram?: string
  socialYoutube?: string
  contactZalo?: string
}

export function SiteFooter({
  className,
  siteName,
  logoUrl,
  siteDescription,
  contactPhone,
  contactEmail,
  contactAddress,
  businessHours,
  socialFacebook,
  socialInstagram,
  socialYoutube,
  contactZalo,
}: SiteFooterProps) {
  const name = siteName || "Heo Quay 47"
  const description =
    siteDescription ||
    "Chuyên heo quay, vịt quay, gà quay chất lượng cao. Phục vụ tận tâm, giao hàng tận nơi."

  const hasSocial = contactZalo || socialFacebook || socialInstagram || socialYoutube
  const hasContact = contactPhone || contactEmail || contactAddress || businessHours

  return (
    <footer className={cn("border-t bg-muted/20", className)}>
      <div className="container py-10 md:py-14">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">

          {/* Brand — takes 2 of 4 columns on md */}
          <div className="space-y-4 sm:col-span-2 md:col-span-2">
            <div className="flex items-center gap-2.5">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-base select-none">
                  {name[0]}
                </div>
              )}
              <span className="font-heading text-base font-bold">{name}</span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              {description}
            </p>

            {hasSocial && (
              <div className="flex items-center gap-3 text-muted-foreground">
                {contactZalo && (
                  <a
                    href={`https://zalo.me/${contactZalo.replace(/\s/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Zalo"
                    className="hover:text-blue-500 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 13.5h-1.25v-4h1.25v4zm-2.75 0H12.5V10h1.25v5.5zm-2.75 0H9.75v-2.75H8.5V10h1.25v2.75h.25v2.75zm-2.75-5.5H7v5.5H5.75v-5.5z" />
                    </svg>
                    <span className="sr-only">Zalo</span>
                  </a>
                )}
                {socialFacebook && (
                  <a
                    href={socialFacebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Facebook"
                    className="hover:text-blue-600 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="sr-only">Facebook</span>
                  </a>
                )}
                {socialInstagram && (
                  <a
                    href={socialInstagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Instagram"
                    className="hover:text-pink-500 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span className="sr-only">Instagram</span>
                  </a>
                )}
                {socialYoutube && (
                  <a
                    href={socialYoutube}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="YouTube"
                    className="hover:text-red-600 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    <span className="sr-only">YouTube</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Khám phá */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Khám phá</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">Trang chủ</Link></li>
              <li><Link href="/blog" className="hover:text-foreground transition-colors">Bài viết</Link></li>
              <li><Link href="/categories" className="hover:text-foreground transition-colors">Danh mục</Link></li>
              <li><Link href="/about" className="hover:text-foreground transition-colors">Giới thiệu</Link></li>
              <li><Link href="/lien-he" className="hover:text-foreground transition-colors">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Liên hệ</h4>
            {hasContact ? (
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {contactPhone && (
                  <li>
                    <a
                      href={`tel:${contactPhone.replace(/\s/g, "")}`}
                      className="flex items-start gap-2 hover:text-foreground transition-colors"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                      </svg>
                      {contactPhone}
                    </a>
                  </li>
                )}
                {contactEmail && (
                  <li>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="flex items-start gap-2 hover:text-foreground transition-colors break-all"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                      </svg>
                      {contactEmail}
                    </a>
                  </li>
                )}
                {contactAddress && (
                  <li>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(contactAddress)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 hover:text-foreground transition-colors"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                      </svg>
                      {contactAddress}
                    </a>
                  </li>
                )}
                {businessHours && (
                  <li className="flex items-start gap-2">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    {businessHours}
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground/60">Đang cập nhật...</p>
            )}
          </div>
        </div>

        <hr className="my-6" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {name}. Bảo lưu mọi quyền.
          </p>
          <ModeToggle />
        </div>
      </div>
    </footer>
  )
}
