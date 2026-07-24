import Image from "next/image"
import Link from "next/link"
import { db } from "@/lib/db"
import { cn } from "@/lib/utils"
import { BLUR_PLACEHOLDER } from "@/lib/image"
import { postUrl } from "@/lib/post-url"
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/motion-primitives"

export const dynamic = "force-dynamic"

export async function generateMetadata() {
  const row = await db.siteConfig.findUnique({ where: { id: "default" } }).catch(() => null)
  const cfg = (row?.data ?? {}) as Record<string, string>
  const siteName = cfg.siteName?.trim() || "Heo Quay Bình Tân"
  const subtitle = cfg.thucDonSubtitle?.trim() || "Heo quay · Vịt quay · Gà quay & đặc sản"
  const description = `Xem thực đơn ${subtitle} tại ${siteName}.`
  const ogImage = cfg.heroImage?.trim() || cfg.logoUrl?.trim() || null
  return {
    title: "Thực đơn",
    description,
    openGraph: {
      title: `Thực đơn | ${siteName}`,
      description,
      locale: "vi_VN",
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: siteName }] } : {}),
    },
  }
}

export default async function ThucDonPage() {
  const [groups, siteConfigRow] = await Promise.all([
    db.dishGroup.findMany({
      orderBy: { order: "asc" },
      include: { dishes: { orderBy: { order: "asc" }, include: { post: { select: { id: true, slug: true } } } } },
    }),
    db.siteConfig.findUnique({ where: { id: "default" } }).catch(() => null),
  ])

  const cfg = (siteConfigRow?.data ?? {}) as Record<string, string>
  const useSlugs = cfg.useSlugs === "true"
  const heroImage = cfg.thucDonImage?.trim() || cfg.heroImage?.trim() || "/images/shop/heo-quay-khay-1.jpg"
  const siteName = cfg.siteName?.trim() || "Heo Quay Bình Tân"
  const contactPhone = cfg.contactPhone?.trim() || null
  const thucDonSubtitle = cfg.thucDonSubtitle?.trim() || "Heo quay · Vịt quay · Gà quay & đặc sản"

  const visibleGroups = groups.filter((g) => g.dishes.length > 0)
  const totalDishes = visibleGroups.reduce((s, g) => s + g.dishes.length, 0)

  return (
    <div className="min-h-screen">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ minHeight: "460px" }}>
        <Image
          src={heroImage}
          alt={siteName}
          fill
          className="object-cover scale-105"
          sizes="100vw"
          priority
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
        {/* dot pattern */}
        <div className="absolute inset-0 opacity-[0.06]" aria-hidden>
          <svg width="100%" height="100%">
            <pattern id="thucdon-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="white" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#thucdon-dots)" />
          </svg>
        </div>

        <div className="absolute bottom-0 left-0 right-0 container px-4 sm:px-6 pb-12 pt-32">
          <FadeUp>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-orange-300 mb-3">✦ {siteName}</p>
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-none mb-3 drop-shadow-xl">
              Thực đơn
            </h1>
            <p className="text-white/60 text-sm tracking-wide mb-5">{thucDonSubtitle}</p>
            <div className="flex items-center gap-3">
              <div className="h-0.5 w-10 bg-orange-400 rounded-full" />
              <span className="text-white/40 text-xs">{totalDishes} món · {visibleGroups.length} nhóm</span>
            </div>
          </FadeUp>
        </div>
      </div>

      {/* ── Sticky category nav ───────────────────────────────── */}
      {visibleGroups.length > 1 && (
        <div className="sticky top-16 z-20 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b shadow-sm">
          <div className="container px-4 sm:px-6">
            <div className="flex gap-1 overflow-x-auto scrollbar-hide py-3">
              {visibleGroups.map((g) => (
                <a
                  key={g.id}
                  href={`#group-${g.id}`}
                  className="shrink-0 text-xs font-bold uppercase tracking-wider px-5 py-2 border-2 border-transparent text-muted-foreground hover:text-primary hover:border-primary transition-all duration-200"
                >
                  {g.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Groups ────────────────────────────────────────────── */}
      <div className="container px-4 sm:px-6 py-14 lg:py-20 max-w-6xl">
        {visibleGroups.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <span className="text-5xl block mb-4">🍽️</span>
            Đang cập nhật thực đơn...
          </div>
        ) : (
          <div className="space-y-20">
            {visibleGroups.map((group) => {
              const [featured, ...rest] = group.dishes
              return (
                <FadeUp key={group.id}>
                  <section id={`group-${group.id}`} className="scroll-mt-32">

                    {/* Group heading */}
                    <div className="flex items-center gap-4 mb-8">
                      <div className="flex items-center gap-1 shrink-0">
                        <div className="w-1.5 h-9 rounded-full bg-primary" />
                        <div className="w-0.5 h-6 rounded-full bg-primary/30" />
                      </div>
                      <h2 className="font-heading text-3xl sm:text-4xl font-bold">{group.name}</h2>
                      <div className="flex-1 h-px bg-gradient-to-r from-border via-border/40 to-transparent" />
                      <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 shrink-0">
                        {group.dishes.length} món
                      </span>
                    </div>

                    {/* Featured + grid layout */}
                    {group.dishes.length === 1 ? (
                      /* Chỉ 1 món — card rộng */
                      <DishCard dish={featured} useSlugs={useSlugs} className="max-w-sm aspect-[4/3]" />
                    ) : (
                      <div className="space-y-4">
                        {/* Hàng đầu: featured lớn + 2 nhỏ */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          <DishCard dish={featured} useSlugs={useSlugs} className="col-span-2 sm:col-span-2 aspect-[16/9] sm:aspect-[4/3]" featured />
                          {rest[0] && <DishCard dish={rest[0]} useSlugs={useSlugs} className="aspect-[3/4]" />}
                        </div>

                        {/* Hàng còn lại: 3 cột đều */}
                        {rest.length > 1 && (
                          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {rest.slice(1).map((dish) => (
                              <StaggerItem key={dish.id}>
                                <DishCard dish={dish} useSlugs={useSlugs} className="aspect-[3/4]" />
                              </StaggerItem>
                            ))}
                          </StaggerContainer>
                        )}
                      </div>
                    )}
                  </section>
                </FadeUp>
              )
            })}
          </div>
        )}

        {/* ── CTA ───────────────────────────────────────────── */}
        <FadeUp>
          <div className="mt-20 relative overflow-hidden rounded-2xl shadow-2xl">
            <div
              className="relative p-10 sm:p-16 text-center text-white"
              style={{ background: "linear-gradient(135deg, #7c2d12 0%, #c2410c 40%, #dc2626 80%, #9f1239 100%)" }}
            >
              <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "20px 20px" }} />
              <div className="absolute top-6 right-8 text-8xl opacity-[0.08] select-none rotate-12">🐷</div>
              <div className="relative z-10">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-300 mb-4">Đặt hàng ngay</p>
                <h3 className="font-heading text-3xl sm:text-4xl font-bold mb-3">Muốn đặt món?</h3>
                <p className="text-white/60 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
                  Liên hệ trực tiếp để được tư vấn và báo giá tốt nhất cho sự kiện của bạn.
                </p>
                {contactPhone && (
                  <a
                    href={`tel:${contactPhone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-3 bg-white text-orange-700 font-bold px-10 py-4 text-sm hover:bg-orange-50 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.98-1.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    {contactPhone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  )
}

/* ── DishCard component ─────────────────────────────────────── */
function DishCard({
  dish,
  useSlugs,
  className,
  featured = false,
}: {
  dish: { id: string; name: string; description: string | null; unit: string; image: string | null; available: boolean; post: { id: string; slug: string | null } | null }
  useSlugs: boolean
  className?: string
  featured?: boolean
}) {
  const Wrapper = dish.post ? Link : "div"
  const wrapperProps = dish.post ? { href: postUrl(dish.post, useSlugs) } : {}

  return (
    <Wrapper
      {...(wrapperProps as any)}
      className={cn(
        "group relative flex overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300",
        !dish.available && "opacity-50",
        className
      )}
    >
      {dish.image ? (
        <Image
          src={dish.image}
          alt={dish.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center text-6xl"
          style={{ background: "linear-gradient(135deg, #fff7ed, #fed7aa, #fdba74)" }}
        >
          🐷
        </div>
      )}

      {/* gradient overlay */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent",
        featured && "via-black/10"
      )} />

      {/* Hết hàng */}
      {!dish.available && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <span className="text-white text-xs font-bold uppercase tracking-widest bg-black/70 px-4 py-2">Hết món</span>
        </div>
      )}

      {/* Featured badge */}
      {featured && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1">
            Nổi bật
          </span>
        </div>
      )}

      {/* Arrow khi hover */}
      {dish.post && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <div className="bg-white text-primary p-1.5 shadow-lg">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      )}

      {/* Name */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className={cn(
          "text-white font-heading font-bold leading-tight",
          featured ? "text-xl sm:text-2xl" : "text-sm sm:text-base"
        )}>
          {dish.name}
        </p>
        {featured && dish.description && (
          <p className="text-white/60 text-xs mt-1 line-clamp-2">{dish.description}</p>
        )}
        <p className="text-white/40 text-[11px] mt-1 uppercase tracking-wider">{dish.unit}</p>
      </div>
    </Wrapper>
  )
}
