import Image from "next/image"
import Link from "next/link"
import { db } from "@/lib/db"
import { PageEntrance, FadeUp, StaggerContainer, StaggerItem } from "@/components/motion-primitives"
import { BLUR_PLACEHOLDER } from "@/lib/image"

export const dynamic = "force-dynamic"

export async function generateMetadata() {
  const row = await db.siteConfig.findUnique({ where: { id: "default" } }).catch(() => null)
  const cfg = (row?.data ?? {}) as Record<string, string>
  return {
    title: `Về chúng tôi — ${cfg.siteName ?? "Heo Quay 47"}`,
    description: cfg.siteDescription ?? "Chuyên cung cấp heo quay, vịt quay, gà quay chất lượng cao.",
  }
}

export default async function AboutPage() {
  const row = await db.siteConfig.findUnique({ where: { id: "default" } }).catch(() => null)
  const cfg = (row?.data ?? {}) as Record<string, string>

  const siteName = cfg.siteName?.trim() || "Heo Quay 47"
  const siteDescription = cfg.siteDescription?.trim() || "Chuyên heo quay, vịt quay, gà quay — công thức bí truyền, nguyên liệu tươi sạch."
  const heroImage = cfg.heroImage?.trim() || null
  const contactPhone = cfg.contactPhone?.trim() || null
  const contactEmail = cfg.contactEmail?.trim() || null
  const contactAddress = cfg.contactAddress?.trim() || null
  const businessHours = cfg.businessHours?.trim() || null
  const contactZalo = cfg.contactZalo?.trim() || null
  const socialFacebook = cfg.socialFacebook?.trim() || null
  const socialInstagram = cfg.socialInstagram?.trim() || null

  const contactItems = [
    contactAddress && { icon: "📍", label: "Địa chỉ", value: contactAddress, href: `https://maps.google.com/?q=${encodeURIComponent(contactAddress)}` },
    contactPhone && { icon: "📞", label: "Điện thoại", value: contactPhone, href: `tel:${contactPhone}` },
    businessHours && { icon: "🕐", label: "Giờ mở cửa", value: businessHours, href: null },
    contactEmail && { icon: "✉️", label: "Email", value: contactEmail, href: `mailto:${contactEmail}` },
    contactZalo && { icon: "💬", label: "Zalo", value: contactZalo, href: `https://zalo.me/${contactZalo.replace(/\s/g, "")}` },
  ].filter(Boolean) as { icon: string; label: string; value: string; href: string | null }[]

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <PageEntrance>
        <div className="relative overflow-hidden border-b bg-muted/30" style={{ minHeight: 260 }}>
          {heroImage && (
            <>
              <Image
                src={heroImage}
                alt={siteName}
                fill
                sizes="100vw"
                className="object-cover"
                priority
                placeholder="blur"
                blurDataURL={BLUR_PLACEHOLDER}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            </>
          )}
          <div className={`relative z-10 container px-4 sm:px-6 py-14 lg:py-20 ${heroImage ? "text-white" : ""}`}>
            <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${heroImage ? "text-orange-300" : "text-orange-500"}`}>
              {siteName}
            </p>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-3">
              Về chúng tôi
            </h1>
            <p className={`text-lg max-w-xl ${heroImage ? "text-white/80" : "text-muted-foreground"}`}>
              {siteDescription}
            </p>
          </div>
        </div>
      </PageEntrance>

      <div className="container px-4 sm:px-6 py-10 lg:py-14 space-y-14">

        {/* Story */}
        <FadeUp>
          <section className="grid md:grid-cols-2 gap-8 lg:gap-14 items-center">
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-orange-500">Câu chuyện của chúng tôi</p>
              <h2 className="font-heading text-2xl sm:text-3xl leading-snug">{siteName}</h2>
              <p className="leading-relaxed text-muted-foreground">{siteDescription}</p>
              <p className="leading-relaxed text-muted-foreground">
                Với nhiều năm kinh nghiệm trong nghề, đội ngũ của chúng tôi luôn tận tâm chọn lọc
                nguyên liệu tươi ngon nhất, kết hợp với bí quyết ướp gia vị độc đáo để tạo nên
                những món ăn hoàn hảo — giữ trọn hương vị gia truyền qua từng thế hệ.
              </p>
              <div className="flex gap-3 pt-2">
                <Link
                  href="/lien-he"
                  className="inline-flex items-center gap-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 text-sm font-semibold transition-colors"
                >
                  Liên hệ đặt hàng
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/50 px-6 py-2.5 text-sm font-semibold transition-colors"
                >
                  Xem thực đơn →
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt={siteName}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL={BLUR_PLACEHOLDER}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-orange-200 via-amber-100 to-orange-300 dark:from-orange-900 dark:via-amber-950 dark:to-orange-800 flex items-center justify-center">
                  <span className="text-8xl drop-shadow-sm select-none">🐷</span>
                </div>
              )}
            </div>
          </section>
        </FadeUp>

        {/* Stats */}
        <section>
          <StaggerContainer className="grid gap-4 sm:grid-cols-3">
            {[
              { number: "10+", label: "Năm kinh nghiệm", desc: "Gắn bó với nghề hơn một thập kỷ" },
              { number: "1000+", label: "Khách hàng hài lòng", desc: "Phục vụ hàng nghìn lượt khách mỗi tháng" },
              { number: "3", label: "Món đặc trưng", desc: "Heo quay, Vịt quay, Gà quay" },
            ].map((stat) => (
              <StaggerItem key={stat.label} hover>
                <div className="rounded-2xl border bg-card p-6 text-center space-y-1 h-full">
                  <div className="font-heading text-4xl font-bold text-primary">{stat.number}</div>
                  <div className="font-semibold text-sm">{stat.label}</div>
                  <p className="text-xs text-muted-foreground">{stat.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* Commitments */}
        <FadeUp>
          <section className="space-y-5">
            <h2 className="font-heading text-2xl">Cam kết của chúng tôi</h2>
            <StaggerContainer className="grid gap-4 sm:grid-cols-2">
              {[
                { title: "Nguyên liệu tươi sạch", desc: "Chọn lọc từ các nhà cung cấp uy tín, đảm bảo vệ sinh an toàn thực phẩm." },
                { title: "Công thức gia truyền", desc: "Bí quyết ướp và nướng đặc biệt tạo nên hương vị độc đáo không đâu có." },
                { title: "Giao hàng tận nơi", desc: "Phục vụ đặt hàng online, giao tận nơi nhanh chóng và đúng giờ." },
                { title: "Giá cả hợp lý", desc: "Chất lượng cao với mức giá phải chăng, phù hợp với mọi nhu cầu." },
              ].map((item) => (
                <StaggerItem key={item.title}>
                  <div className="flex gap-4 rounded-2xl border bg-card p-5 h-full">
                    <div className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-sm mb-1">{item.title}</div>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        </FadeUp>

        {/* Contact info from siteConfig */}
        {contactItems.length > 0 && (
          <FadeUp>
            <section className="space-y-5">
              <h2 className="font-heading text-2xl">Thông tin liên hệ</h2>
              <div className="rounded-2xl border bg-card divide-y overflow-hidden">
                {contactItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-4 px-6 py-4">
                    <span className="text-xl shrink-0">{item.icon}</span>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 min-w-0">
                      <span className="text-sm font-semibold shrink-0">{item.label}:</span>
                      {item.href ? (
                        <a href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors truncate" target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                          {item.value}
                        </a>
                      ) : (
                        <span className="text-sm text-muted-foreground">{item.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social links */}
              {(socialFacebook || socialInstagram) && (
                <div className="flex gap-3 pt-1">
                  {socialFacebook && (
                    <a href={socialFacebook} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                      Facebook
                    </a>
                  )}
                  {socialInstagram && (
                    <a href={socialInstagram} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                      Instagram
                    </a>
                  )}
                </div>
              )}
            </section>
          </FadeUp>
        )}

        {/* CTA */}
        <FadeUp>
          <section className="rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-100 dark:border-orange-900/30 p-8 lg:p-12 text-center">
            <h2 className="font-heading text-2xl sm:text-3xl mb-3">Sẵn sàng thưởng thức?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">Đặt hàng ngay hôm nay và trải nghiệm hương vị gia truyền đặc sắc của chúng tôi.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/lien-he"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 font-semibold transition-colors shadow-lg"
              >
                Đặt hàng ngay
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-950/50 px-8 py-3 font-semibold transition-colors"
              >
                Xem thực đơn
              </Link>
            </div>
          </section>
        </FadeUp>

      </div>
    </div>
  )
}
