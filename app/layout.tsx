import { Nunito } from "next/font/google"
import { cache, Suspense } from "react"

import "@/styles/globals.css"
import { siteConfig } from "@/config/site"
import { absoluteUrl, cn, ogUrl } from "@/lib/utils"
import NextTopLoader from "nextjs-toploader"
import { NavigationLoader } from "@/components/navigation-loader"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@/components/analytics"
import { TrackingScripts } from "@/components/tracking-scripts"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import { db } from "@/lib/db"

// Deduplicate DB call — cả generateMetadata và RootLayout đều dùng chung 1 query/request
const getSiteConfigData = cache(async (): Promise<Record<string, string>> => {
  const config = await db.siteConfig.findUnique({ where: { id: "default" } }).catch(() => null)
  return (config?.data ?? {}) as Record<string, string>
})

const fontHeading = Nunito({
  subsets: ["latin", "vietnamese"],
  variable: "--font-heading",
  weight: ["300", "400", "500", "600"],
})

interface RootLayoutProps {
  children: React.ReactNode
}

export async function generateMetadata() {
  const data = await getSiteConfigData()
  const googleVerification = data.googleVerification?.trim()
  const siteName = data.siteName?.trim() || siteConfig.name
  const description = data.siteDescription?.trim() || siteConfig.description
  const ogImage = ogUrl(data.heroImage?.trim() || data.logoUrl?.trim() || "/opengraph-image.jpg")
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace("http://localhost:3000", siteConfig.url) || siteConfig.url

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description,
    keywords: ["heo quay", "vịt quay", "gà quay", "heo quay TP.HCM", "đặt heo quay", "heo quay gia truyền", siteName],
    authors: [{ name: siteName }],
    creator: siteName,
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "white" },
      { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
    openGraph: {
      type: "website",
      locale: "vi_VN",
      url: appUrl,
      title: siteName,
      description,
      siteName,
      images: [{ url: ogImage, width: 1200, height: 630, alt: siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
      images: [ogImage],
    },
    robots: {
      index: data.robotsIndex === "true",
      follow: data.robotsIndex === "true",
    },
    icons: {
      icon: [
        { url: "/favicons/favicon.svg", type: "image/svg+xml" },
        { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicons/favicon.ico", type: "image/x-icon" },
      ],
      shortcut: "/favicons/favicon.ico",
      apple: "/favicons/apple-touch-icon.png",
    },
    manifest: "/favicons/site.webmanifest",
    ...(googleVerification ? { verification: { google: googleVerification } } : {}),
  }
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const data = await getSiteConfigData()
  const trackingCode = data.trackingCode?.trim() ?? ""

  return (
    <html lang="vi" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontHeading.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextTopLoader color="hsl(22 82% 40%)" height={3} showSpinner={false} />
          <NavigationLoader />
          {children}
          <Suspense fallback={null}><Analytics /></Suspense>
          <Toaster />
          <TailwindIndicator />
        </ThemeProvider>
        <TrackingScripts code={trackingCode} />
      </body>
    </html>
  )
}
