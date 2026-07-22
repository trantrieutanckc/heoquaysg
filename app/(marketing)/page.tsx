export const dynamic = "force-dynamic"

import { db as metaDb } from "@/lib/db"
import { siteConfig } from "@/config/site"

export async function generateMetadata() {
  const row = await metaDb.siteConfig.findUnique({ where: { id: "default" } }).catch(() => null)
  const cfg = (row?.data ?? {}) as Record<string, string>
  const siteName = cfg.siteName?.trim() || siteConfig.name
  const description = cfg.siteDescription?.trim() || siteConfig.description
  const ogImage = cfg.heroImage?.trim() || cfg.logoUrl?.trim() || null
  return {
    title: { absolute: siteName },
    description,
    openGraph: {
      title: siteName,
      description,
      locale: "vi_VN",
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: siteName }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  }
}

import { db } from "@/lib/db"
import React from "react"
import { tiptapToHtml } from "@/lib/tiptap-html"
import {
  HeroSection,
  FeaturedSection,
  CategoriesSection,
  AboutSection,
  LatestPostsSection,
  BookingCtaSection,
  MapSection,
  ThucDonSection,
} from "./_components/home-sections"

const POST_SELECT = {
  id: true, title: true, createdAt: true, image: true, content: true,
  avgRating: true, ratingCount: true, seoDescription: true,
  author: { select: { name: true, image: true } },
  categories: { select: { category: { select: { name: true, slug: true } } } },
} as const

export default async function IndexPage() {
  const siteConfigRow = await db.siteConfig.findUnique({ where: { id: "default" } }).catch(() => null)
  const cfg = (siteConfigRow?.data ?? {}) as Record<string, string>
  const homePostsCount = Math.max(2, parseInt(cfg.homePostsCount ?? "8") || 8)

  const [featuredPost, posts, categories, dishGroups] = await Promise.all([
    db.post.findFirst({
      where: { published: true, featured: true },
      select: POST_SELECT,
    }),
    db.post.findMany({
      where: {
        published: true,
        categories: { some: { category: { slug: "heo-quay" } } },
      },
      select: POST_SELECT,
      orderBy: { createdAt: "desc" },
      take: homePostsCount,
    }),
    db.category.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: 7,
      include: { _count: { select: { posts: true } } },
    }),
    db.dishGroup.findMany({
      orderBy: { order: "asc" },
      include: { dishes: { orderBy: { order: "asc" } } },
    }),
  ])
  const aboutContentHtml = tiptapToHtml(cfg.homeAboutContent)
  const heroImage = cfg.heroImage?.trim() || "/images/shop/heo-quay-khay-1.jpg"
  const siteName = cfg.siteName?.trim() || "Heo Quay Bình Tân"
  const siteTagline = cfg.siteTagline?.trim() || "Hương vị gia truyền, đậm đà qua nhiều thế hệ"
  const siteDescription = cfg.siteDescription?.trim() || "Chuyên heo quay, vịt quay, gà quay — công thức bí truyền, nguyên liệu tươi sạch, phục vụ hàng ngày."

  function sectionStyle(colorKey: string, imageKey: string): React.CSSProperties {
    const image = cfg[imageKey]?.trim()
    const color = cfg[colorKey]?.trim()
    if (image) return { backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" }
    if (color) return { backgroundColor: color }
    return {}
  }

  const featured = featuredPost ?? posts[0] ?? null
  const others = posts.filter((p) => p.id !== featured?.id)

  return (
    <div className="min-h-screen">
      <HeroSection
        heroImage={heroImage}
        siteName={siteName}
        siteTagline={siteTagline}
        siteDescription={siteDescription}
        contactPhone={cfg.contactPhone}
      />

      {featured && (
        <FeaturedSection
          post={featured}
          bgStyle={sectionStyle("homeFeaturedBgColor", "homeFeaturedBgImage")}
          label={cfg.homeFeaturedLabel}
          title={cfg.homeFeaturedTitle}
        />
      )}

      {categories.length > 0 && (
        <CategoriesSection
          categories={categories.slice(0, 6)}
          showViewAll={categories.length >= 6}
          bgStyle={sectionStyle("homeCategoriesBgColor", "homeCategoriesBgImage")}
          label={cfg.homeCategoriesLabel}
          title={cfg.homeCategoriesTitle}
        />
      )}

      {(cfg.contactAddress || cfg.contactPhone || aboutContentHtml) && (
        <AboutSection
          siteName={siteName}
          siteDescription={siteDescription}
          aboutImage={cfg.aboutImage?.trim() || heroImage}
          contactAddress={cfg.contactAddress}
          contactPhone={cfg.contactPhone}
          label={cfg.homeAboutLabel}
          bgStyle={sectionStyle("homeAboutBgColor", "homeAboutBgImage")}
          aboutContentHtml={aboutContentHtml}
        />
      )}

      {others.length > 0 && (
        <LatestPostsSection
          posts={others}
          bgStyle={sectionStyle("homePostsBgColor", "homePostsBgImage")}
          label={cfg.homePostsLabel}
          title={cfg.homePostsTitle}
          maxShow={homePostsCount}
        />
      )}

      <ThucDonSection groups={
        (() => {
          const names = (cfg.homeDishGroupNames ?? "Heo Quay|Heo Sữa Quay|Heo Cúng")
            .split("|").map((s) => s.trim()).filter(Boolean)
          return dishGroups.filter((g) => names.includes(g.name))
        })()
      } />

      <BookingCtaSection
        bgStyle={sectionStyle("homeBookingBgColor", "homeBookingBgImage")}
        label={cfg.homeBookingLabel}
        title={cfg.homeBookingTitle}
        desc={cfg.homeBookingDesc}
        contactPhone={cfg.contactPhone}
        btn1Text={cfg.homeBookingBtn1Text}
        btn1Link={cfg.homeBookingBtn1Link}
        btn2Text={cfg.homeBookingBtn2Text}
        btn2Link={cfg.homeBookingBtn2Link}
      />

      {cfg.contactAddress && (
        <MapSection
          contactAddress={cfg.contactAddress}
          contactPhone={cfg.contactPhone}
          bgStyle={sectionStyle("homeMapBgColor", "homeMapBgImage")}
        />
      )}
    </div>
  )
}
