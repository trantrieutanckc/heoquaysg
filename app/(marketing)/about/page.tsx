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
  const aboutImage = cfg.aboutImage?.trim() || heroImage
  const contactPhone = cfg.contactPhone?.trim() || null
  const contactEmail = cfg.contactEmail?.trim() || null
  const contactAddress = cfg.contactAddress?.trim() || null
  const contactZalo = cfg.contactZalo?.trim() || null
  const socialFacebook = cfg.socialFacebook?.trim() || null
  const socialInstagram = cfg.socialInstagram?.trim() || null

  const aboutStory1 = cfg.aboutStory1?.trim() || `Xuất phát từ tình yêu ẩm thực và niềm đam mê bếp núc, ${siteName} được thành lập với mong muốn mang đến những mâm cỗ heo quay, vịt quay, gà quay chuẩn vị — đậm đà như cách bà nội vẫn làm mỗi dịp lễ tết.`
  const aboutStory2 = cfg.aboutStory2?.trim() || "Mỗi con heo được chọn lọc kỹ từ các trang trại uy tín, ướp qua đêm với hơn 10 loại gia vị bí truyền, rồi quay chậm bằng than hoa để da giòn tan, thịt mềm ngọt thấm đến tận xương. Không tắt lửa, không cắt góc, chỉ là sự kiên nhẫn và tâm huyết trong từng mẻ quay."

  const aboutStats = [
    { number: cfg.aboutStat1Number?.trim() || "10+", label: cfg.aboutStat1Label?.trim() || "Năm kinh nghiệm", desc: cfg.aboutStat1Desc?.trim() || "Gắn bó với nghề hơn một thập kỷ", icon: "🔥" },
    { number: cfg.aboutStat2Number?.trim() || "1000+", label: cfg.aboutStat2Label?.trim() || "Khách hàng hài lòng", desc: cfg.aboutStat2Desc?.trim() || "Phục vụ hàng nghìn lượt khách mỗi tháng", icon: "❤️" },
    { number: cfg.aboutStat3Number?.trim() || "3", label: cfg.aboutStat3Label?.trim() || "Món đặc trưng", desc: cfg.aboutStat3Desc?.trim() || "Heo quay, Vịt quay, Gà quay", icon: "🍖" },
  ]

  const aboutSteps = [
    { step: "01", title: cfg.aboutStep1Title?.trim() || "Chọn nguyên liệu", desc: cfg.aboutStep1Desc?.trim() || "Heo, vịt, gà tươi sống từ trang trại uy tín, kiểm tra kỹ trước khi nhận.", color: "from-orange-500 to-amber-500" },
    { step: "02", title: cfg.aboutStep2Title?.trim() || "Ướp gia vị", desc: cfg.aboutStep2Desc?.trim() || "Hơn 10 loại gia vị bí truyền, ướp qua đêm để thấm đều từng thớ thịt.", color: "from-amber-500 to-yellow-500" },
    { step: "03", title: cfg.aboutStep3Title?.trim() || "Quay than hoa", desc: cfg.aboutStep3Desc?.trim() || "Quay chậm bằng than hoa 3–4 giờ, xoay đều tay để da vàng giòn đều.", color: "from-red-500 to-orange-500" },
    { step: "04", title: cfg.aboutStep4Title?.trim() || "Giao đến tay bạn", desc: cfg.aboutStep4Desc?.trim() || "Chặt nóng, đóng gói cẩn thận, giao tận nơi hoặc nhận trực tiếp tại cửa hàng.", color: "from-orange-600 to-red-500" },
  ]

  const aboutCommitments = [
    { title: cfg.aboutCommit1Title?.trim() || "Nguyên liệu tươi sạch", desc: cfg.aboutCommit1Desc?.trim() || "Chọn lọc từ các nhà cung cấp uy tín, đảm bảo vệ sinh an toàn thực phẩm.", icon: "🌿" },
    { title: cfg.aboutCommit2Title?.trim() || "Công thức gia truyền", desc: cfg.aboutCommit2Desc?.trim() || "Bí quyết ướp và nướng đặc biệt tạo nên hương vị độc đáo không đâu có.", icon: "📜" },
    { title: cfg.aboutCommit3Title?.trim() || "Giao hàng tận nơi", desc: cfg.aboutCommit3Desc?.trim() || "Phục vụ đặt hàng online, giao tận nơi nhanh chóng và đúng giờ.", icon: "🚚" },
    { title: cfg.aboutCommit4Title?.trim() || "Giá cả hợp lý", desc: cfg.aboutCommit4Desc?.trim() || "Chất lượng cao với mức giá phải chăng, phù hợp với mọi nhu cầu.", icon: "💰" },
  ]

  const contactItems = [
    contactAddress && { icon: <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/><path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/></svg>, label: "Địa chỉ", value: contactAddress, href: `https://maps.google.com/?q=${encodeURIComponent(contactAddress)}` },
    contactPhone && { icon: <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"/></svg>, label: "Điện thoại", value: contactPhone, href: `tel:${contactPhone}` },
    contactEmail && { icon: <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"/></svg>, label: "Email", value: contactEmail, href: `mailto:${contactEmail}` },
    contactZalo && { icon: <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 13.5h-1.25v-4h1.25v4zm-2.75 0H12.5V10h1.25v5.5zm-2.75 0H9.75v-2.75H8.5V10h1.25v2.75h.25v2.75zm-2.75-5.5H7v5.5H5.75v-5.5z"/></svg>, label: "Zalo", value: contactZalo, href: `https://zalo.me/${contactZalo.replace(/\s/g, "")}` },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string; href: string | null }[]

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <PageEntrance>
        <div className="relative overflow-hidden" style={{ minHeight: 320 }}>
          {heroImage ? (
            <>
              <Image src={heroImage} alt={siteName} fill sizes="100vw" className="object-cover" priority placeholder="blur" blurDataURL={BLUR_PLACEHOLDER} />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-amber-500 to-orange-400" />
          )}
          {/* dot pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden>
            <svg width="100%" height="100%">
              <pattern id="about-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="white" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#about-dots)" />
            </svg>
          </div>
          <div className="relative z-10 container px-4 sm:px-6 py-16 lg:py-24 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3 text-orange-200">{siteName}</p>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl mb-4 drop-shadow-sm">Về chúng tôi</h1>
            <div className="flex items-center gap-2 mb-5">
              <div className="h-1 w-12 rounded-full bg-orange-400" />
              <div className="h-1 w-5 rounded-full bg-orange-300/50" />
            </div>
            <p className="text-base sm:text-lg max-w-xl leading-relaxed text-white/85">{siteDescription}</p>
          </div>
        </div>
      </PageEntrance>

      <div className="container px-4 sm:px-6 py-12 lg:py-16 space-y-16">

        {/* Story */}
        <FadeUp>
          <section className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="space-y-5">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Câu chuyện của chúng tôi</p>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl leading-snug">{siteName}</h2>
              <div className="flex items-center gap-2">
                <div className="h-1 w-12 bg-primary rounded-full" />
                <div className="h-1 w-5 bg-primary/30 rounded-full" />
              </div>
              <p className="leading-relaxed text-muted-foreground">{siteDescription}</p>
              <p className="leading-relaxed text-muted-foreground">{aboutStory1}</p>
              <p className="leading-relaxed text-muted-foreground">{aboutStory2}</p>
              <div className="flex flex-wrap gap-3 pt-2">
                {contactPhone && (
                  <a href={`tel:${contactPhone}`} className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors rounded-none">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.98-1.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    Liên hệ đặt hàng
                  </a>
                )}
                <Link href="/thuc-don" className="inline-flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors rounded-none">
                  Xem thực đơn
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
                {aboutImage ? (
                  <Image src={aboutImage} alt={siteName} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" placeholder="blur" blurDataURL={BLUR_PLACEHOLDER} />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-200 via-amber-100 to-orange-300 flex items-center justify-center">
                    <span className="text-9xl drop-shadow-sm select-none">🐷</span>
                  </div>
                )}
              </div>
              {/* Decorative badge */}
              <div className="absolute -bottom-4 -left-4 bg-primary text-primary-foreground px-5 py-3 shadow-xl">
                <div className="font-heading text-2xl font-bold leading-none">10+</div>
                <div className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/80">Năm kinh nghiệm</div>
              </div>
            </div>
          </section>
        </FadeUp>

        {/* Stats */}
        <section>
          <StaggerContainer className="grid gap-4 sm:grid-cols-3">
            {aboutStats.map((stat, i) => (
              <StaggerItem key={stat.label} hover>
                <div className={`relative overflow-hidden p-7 text-center space-y-2 h-full text-white ${i === 0 ? "bg-gradient-to-br from-orange-500 to-amber-500" : i === 1 ? "bg-gradient-to-br from-red-500 to-orange-500" : "bg-gradient-to-br from-amber-600 to-orange-600"}`}>
                  <div className="text-3xl mb-1">{stat.icon}</div>
                  <div className="font-heading text-4xl font-bold drop-shadow-sm">{stat.number}</div>
                  <div className="font-semibold text-sm text-white/90">{stat.label}</div>
                  <p className="text-xs text-white/70 leading-relaxed">{stat.desc}</p>
                  {/* bg decoration */}
                  <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10" />
                  <div className="absolute -left-3 -bottom-3 h-14 w-14 rounded-full bg-white/10" />
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* Process */}
        <FadeUp>
          <section className="space-y-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-1.5">Bí quyết</p>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl">Từ nguyên liệu đến bàn ăn</h2>
              <div className="flex items-center gap-2 mt-3">
                <div className="h-1 w-12 bg-primary rounded-full" />
                <div className="h-1 w-5 bg-primary/30 rounded-full" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {aboutSteps.map((item) => (
                <div key={item.step} className="relative group overflow-hidden rounded-xl border bg-card p-6 space-y-3 hover:shadow-lg transition-shadow">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white font-heading text-lg font-bold shadow-md`}>
                    {item.step}
                  </div>
                  <div className="font-semibold text-sm">{item.title}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${item.color} opacity-60`} />
                </div>
              ))}
            </div>
          </section>
        </FadeUp>

        {/* Commitments */}
        <FadeUp>
          <section className="rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 p-8 lg:p-12 space-y-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-1.5">Chất lượng</p>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl">Cam kết của chúng tôi</h2>
              <div className="flex items-center gap-2 mt-3">
                <div className="h-1 w-12 bg-primary rounded-full" />
                <div className="h-1 w-5 bg-primary/30 rounded-full" />
              </div>
            </div>
            <StaggerContainer className="grid gap-4 sm:grid-cols-2">
              {aboutCommitments.map((item) => (
                <StaggerItem key={item.title}>
                  <div className="flex gap-4 bg-white dark:bg-card rounded-xl p-5 h-full shadow-sm hover:shadow-md transition-shadow">
                    <div className="mt-0.5 h-11 w-11 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-sm mb-1">{item.title}</div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        </FadeUp>

        {/* Contact info */}
        {contactItems.length > 0 && (
          <FadeUp>
            <section className="space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-1.5">Liên lạc</p>
                <h2 className="font-heading text-2xl sm:text-3xl">Thông tin liên hệ</h2>
                <div className="flex items-center gap-2 mt-3">
                  <div className="h-1 w-12 bg-primary rounded-full" />
                  <div className="h-1 w-5 bg-primary/30 rounded-full" />
                </div>
              </div>
              <div className="rounded-xl border bg-card overflow-hidden divide-y shadow-sm">
                {contactItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/40 transition-colors">
                    <div className="h-9 w-9 shrink-0 bg-primary/10 rounded-lg flex items-center justify-center">{item.icon}</div>
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

              {(socialFacebook || socialInstagram) && (
                <div className="flex gap-3 pt-1">
                  {socialFacebook && (
                    <a href={socialFacebook} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-border hover:bg-muted px-4 py-2 text-sm font-semibold transition-colors rounded-lg">
                      <svg className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                      Facebook
                    </a>
                  )}
                  {socialInstagram && (
                    <a href={socialInstagram} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-border hover:bg-muted px-4 py-2 text-sm font-semibold transition-colors rounded-lg">
                      <svg className="h-4 w-4 text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
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
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-orange-500 to-amber-500 text-white p-10 lg:p-14 text-center">
            <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden>
              <svg width="100%" height="100%">
                <pattern id="about-cta-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.2" fill="white" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#about-cta-dots)" />
              </svg>
            </div>
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-100 mb-3">Liên hệ ngay</p>
              <h2 className="font-heading text-3xl sm:text-4xl mb-3 drop-shadow-sm">Sẵn sàng thưởng thức?</h2>
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="h-1 w-10 rounded-full bg-white/60" />
                <div className="h-1 w-5 rounded-full bg-white/30" />
              </div>
              <p className="text-white/80 mb-8 max-w-md mx-auto leading-relaxed">Đặt hàng ngay hôm nay và trải nghiệm hương vị gia truyền đặc sắc của chúng tôi.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {contactPhone && (
                  <a href={`tel:${contactPhone}`} className="inline-flex items-center justify-center gap-2 bg-white text-primary hover:bg-orange-50 px-8 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors rounded-full shadow-lg">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.98-1.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    Đặt hàng ngay
                  </a>
                )}
                <Link href="/thuc-don" className="inline-flex items-center justify-center gap-2 border-2 border-white/60 hover:bg-white/10 text-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors rounded-full">
                  Xem thực đơn
                </Link>
              </div>
            </div>
          </section>
        </FadeUp>

      </div>
    </div>
  )
}
