import Image from "next/image"
import Link from "next/link"
import { db } from "@/lib/db"
import { PageEntrance, FadeUp, StaggerContainer, StaggerItem } from "@/components/motion-primitives"
import { BLUR_PLACEHOLDER } from "@/lib/image"

export const dynamic = "force-dynamic"

export async function generateMetadata() {
  const row = await db.siteConfig.findUnique({ where: { id: "default" } }).catch(() => null)
  const cfg = (row?.data ?? {}) as Record<string, string>
  const siteName = cfg.siteName?.trim() || "Heo Quay Bình Tân"
  const description = cfg.siteDescription?.trim() || "Chuyên cung cấp heo quay, vịt quay, gà quay chất lượng cao."
  const ogImage = cfg.heroImage?.trim() || cfg.logoUrl?.trim() || null
  return {
    title: `Về chúng tôi`,
    description,
    openGraph: {
      title: `Về chúng tôi | ${siteName}`,
      description,
      locale: "vi_VN",
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: siteName }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `Về chúng tôi | ${siteName}`,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  }
}

export default async function AboutPage() {
  const row = await db.siteConfig.findUnique({ where: { id: "default" } }).catch(() => null)
  const cfg = (row?.data ?? {}) as Record<string, string>

  const siteName = cfg.siteName?.trim() || "Heo Quay Bình Tân"
  const siteDescription = cfg.siteDescription?.trim() || "Chuyên heo quay, vịt quay, gà quay — công thức bí truyền, nguyên liệu tươi sạch."
  const heroImage = cfg.heroImage?.trim() || null
  const contactPhone = cfg.contactPhone?.trim() || null
  const contactEmail = cfg.contactEmail?.trim() || null
  const contactAddress = cfg.contactAddress?.trim() || null
  const businessHours = cfg.businessHours?.trim() || null
  const contactZalo = cfg.contactZalo?.trim() || null
  const socialFacebook = cfg.socialFacebook?.trim() || null
  const socialInstagram = cfg.socialInstagram?.trim() || null

  // About page editable content (fallback to demo content)
  const aboutStory1 = cfg.aboutStory1?.trim() || `Xuất phát từ tình yêu ẩm thực và niềm đam mê bếp núc, ${siteName} được thành lập với mong muốn mang đến những mâm cỗ heo quay, vịt quay, gà quay chuẩn vị — đậm đà như cách bà nội vẫn làm mỗi dịp lễ tết.`
  const aboutStory2 = cfg.aboutStory2?.trim() || "Mỗi con heo được chọn lọc kỹ từ các trang trại uy tín, ướp qua đêm với hơn 10 loại gia vị bí truyền, rồi quay chậm bằng than hoa để da giòn tan, thịt mềm ngọt thấm đến tận xương. Không tắt lửa, không cắt góc, chỉ là sự kiên nhẫn và tâm huyết trong từng mẻ quay."

  const aboutStats = [
    { number: cfg.aboutStat1Number?.trim() || "10+", label: cfg.aboutStat1Label?.trim() || "Năm kinh nghiệm", desc: cfg.aboutStat1Desc?.trim() || "Gắn bó với nghề hơn một thập kỷ" },
    { number: cfg.aboutStat2Number?.trim() || "1000+", label: cfg.aboutStat2Label?.trim() || "Khách hàng hài lòng", desc: cfg.aboutStat2Desc?.trim() || "Phục vụ hàng nghìn lượt khách mỗi tháng" },
    { number: cfg.aboutStat3Number?.trim() || "3", label: cfg.aboutStat3Label?.trim() || "Món đặc trưng", desc: cfg.aboutStat3Desc?.trim() || "Heo quay, Vịt quay, Gà quay" },
  ]

  const aboutSteps = [
    { step: "01", title: cfg.aboutStep1Title?.trim() || "Chọn nguyên liệu", desc: cfg.aboutStep1Desc?.trim() || "Heo, vịt, gà tươi sống từ trang trại uy tín, kiểm tra kỹ trước khi nhận." },
    { step: "02", title: cfg.aboutStep2Title?.trim() || "Ướp gia vị", desc: cfg.aboutStep2Desc?.trim() || "Hơn 10 loại gia vị bí truyền, ướp qua đêm để thấm đều từng thớ thịt." },
    { step: "03", title: cfg.aboutStep3Title?.trim() || "Quay than hoa", desc: cfg.aboutStep3Desc?.trim() || "Quay chậm bằng than hoa 3–4 giờ, xoay đều tay để da vàng giòn đều." },
    { step: "04", title: cfg.aboutStep4Title?.trim() || "Giao đến tay bạn", desc: cfg.aboutStep4Desc?.trim() || "Chặt nóng, đóng gói cẩn thận, giao tận nơi hoặc nhận trực tiếp tại cửa hàng." },
  ]

  const aboutCommitments = [
    { title: cfg.aboutCommit1Title?.trim() || "Nguyên liệu tươi sạch", desc: cfg.aboutCommit1Desc?.trim() || "Chọn lọc từ các nhà cung cấp uy tín, đảm bảo vệ sinh an toàn thực phẩm." },
    { title: cfg.aboutCommit2Title?.trim() || "Công thức gia truyền", desc: cfg.aboutCommit2Desc?.trim() || "Bí quyết ướp và nướng đặc biệt tạo nên hương vị độc đáo không đâu có." },
    { title: cfg.aboutCommit3Title?.trim() || "Giao hàng tận nơi", desc: cfg.aboutCommit3Desc?.trim() || "Phục vụ đặt hàng online, giao tận nơi nhanh chóng và đúng giờ." },
    { title: cfg.aboutCommit4Title?.trim() || "Giá cả hợp lý", desc: cfg.aboutCommit4Desc?.trim() || "Chất lượng cao với mức giá phải chăng, phù hợp với mọi nhu cầu." },
  ]

  const contactItems = [
    contactAddress && { icon: <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/><path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/></svg>, label: "Địa chỉ", value: contactAddress, href: `https://maps.google.com/?q=${encodeURIComponent(contactAddress)}` },
    contactPhone && { icon: <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"/></svg>, label: "Điện thoại", value: contactPhone, href: `tel:${contactPhone}` },
    businessHours && { icon: <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, label: "Giờ mở cửa", value: businessHours, href: null },
    contactEmail && { icon: <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"/></svg>, label: "Email", value: contactEmail, href: `mailto:${contactEmail}` },
    contactZalo && { icon: <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 13.5h-1.25v-4h1.25v4zm-2.75 0H12.5V10h1.25v5.5zm-2.75 0H9.75v-2.75H8.5V10h1.25v2.75h.25v2.75zm-2.75-5.5H7v5.5H5.75v-5.5z"/></svg>, label: "Zalo", value: contactZalo, href: `https://zalo.me/${contactZalo.replace(/\s/g, "")}` },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string; href: string | null }[]

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <PageEntrance>
        <div className="relative overflow-hidden border-b bg-card" style={{ minHeight: 260 }}>
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />
            </>
          )}
          <div className={`relative z-10 container px-4 sm:px-6 py-14 lg:py-20 ${heroImage ? "text-white" : ""}`}>
            <p className={`text-xs font-bold uppercase tracking-[0.25em] mb-2 ${heroImage ? "text-orange-200" : "text-primary"}`}>
              {siteName}
            </p>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl italic mb-3">
              Về chúng tôi
            </h1>
            <div className="flex items-center gap-1.5 mb-4">
              <div className={`h-0.5 w-10 rounded-full ${heroImage ? "bg-white/60" : "bg-primary"}`} />
              <div className={`h-0.5 w-4 rounded-full ${heroImage ? "bg-white/30" : "bg-primary/40"}`} />
            </div>
            <p className={`text-base max-w-xl leading-relaxed ${heroImage ? "text-white/80" : "text-muted-foreground"}`}>
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
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Câu chuyện của chúng tôi</p>
              <h2 className="font-heading text-2xl sm:text-3xl leading-snug italic">{siteName}</h2>
              <div className="flex items-center gap-1.5">
                <div className="h-0.5 w-10 bg-primary rounded-full" />
                <div className="h-0.5 w-4 bg-primary/40 rounded-full" />
              </div>
              <p className="leading-relaxed text-muted-foreground">{siteDescription}</p>
              <p className="leading-relaxed text-muted-foreground">{aboutStory1}</p>
              <p className="leading-relaxed text-muted-foreground">{aboutStory2}</p>
              <div className="flex gap-3 pt-2">
                <Link
                  href="/lien-he"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Liên hệ đặt hàng
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 border border-border hover:bg-muted text-foreground px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Xem thực đơn
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
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
            {aboutStats.map((stat) => (
              <StaggerItem key={stat.label} hover>
                <div className="border bg-card p-6 text-center space-y-1 h-full">
                  <div className="font-heading text-4xl font-bold text-primary">{stat.number}</div>
                  <div className="font-semibold text-sm">{stat.label}</div>
                  <p className="text-xs text-muted-foreground">{stat.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* Process */}
        <FadeUp>
          <section className="space-y-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-1.5">Bí quyết</p>
              <h2 className="font-heading text-2xl sm:text-3xl italic">Từ nguyên liệu đến bàn ăn</h2>
              <div className="flex items-center gap-1.5 mt-2.5">
                <div className="h-0.5 w-10 bg-primary rounded-full" />
                <div className="h-0.5 w-4 bg-primary/40 rounded-full" />
              </div>
            </div>
            <div className="grid gap-px bg-border sm:grid-cols-4">
              {aboutSteps.map((item) => (
                <div key={item.step} className="bg-card p-6 space-y-2">
                  <div className="font-heading text-3xl font-bold text-primary/30 italic">{item.step}</div>
                  <div className="font-semibold text-sm">{item.title}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </FadeUp>

        {/* Commitments */}
        <FadeUp>
          <section className="space-y-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-1.5">Chất lượng</p>
              <h2 className="font-heading text-2xl sm:text-3xl italic">Cam kết của chúng tôi</h2>
              <div className="flex items-center gap-1.5 mt-2.5">
                <div className="h-0.5 w-10 bg-primary rounded-full" />
                <div className="h-0.5 w-4 bg-primary/40 rounded-full" />
              </div>
            </div>
            <StaggerContainer className="grid gap-4 sm:grid-cols-2">
              {aboutCommitments.map((item) => (
                <StaggerItem key={item.title}>
                  <div className="flex gap-4 border bg-card p-5 h-full">
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
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-1.5">Liên lạc</p>
                <h2 className="font-heading text-2xl sm:text-3xl italic">Thông tin liên hệ</h2>
                <div className="flex items-center gap-1.5 mt-2.5">
                  <div className="h-0.5 w-10 bg-primary rounded-full" />
                  <div className="h-0.5 w-4 bg-primary/40 rounded-full" />
                </div>
              </div>
              <div className="border bg-card divide-y overflow-hidden">
                {contactItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-4 px-6 py-4">
                    <div className="h-8 w-8 shrink-0 bg-primary/10 border border-primary/20 flex items-center justify-center">{item.icon}</div>
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
                      className="inline-flex items-center gap-2 border border-border hover:bg-muted px-4 py-2 text-sm font-semibold transition-colors">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                      Facebook
                    </a>
                  )}
                  {socialInstagram && (
                    <a href={socialInstagram} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-border hover:bg-muted px-4 py-2 text-sm font-semibold transition-colors">
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
          <section className="border bg-card p-8 lg:p-12 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-3">Liên hệ ngay</p>
            <h2 className="font-heading text-2xl sm:text-3xl italic mb-2">Sẵn sàng thưởng thức?</h2>
            <div className="flex items-center justify-center gap-1.5 mb-5">
              <div className="h-0.5 w-8 bg-primary rounded-full" />
              <div className="h-0.5 w-4 bg-primary/40 rounded-full" />
            </div>
            <p className="text-muted-foreground mb-7 max-w-md mx-auto">Đặt hàng ngay hôm nay và trải nghiệm hương vị gia truyền đặc sắc của chúng tôi.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/lien-he"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Đặt hàng ngay
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center gap-2 border border-border hover:bg-muted text-foreground px-8 py-3 text-xs font-bold uppercase tracking-wider transition-colors"
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
