import { Playfair_Display } from "next/font/google"
import Script from "next/script"
import { cache } from "react"

import "@/styles/globals.css"
import { siteConfig } from "@/config/site"
import { absoluteUrl, cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@/components/analytics"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"
import { db } from "@/lib/db"

// Deduplicate DB call — cả generateMetadata và RootLayout đều dùng chung 1 query/request
const getSiteConfigData = cache(async (): Promise<Record<string, string>> => {
  const config = await db.siteConfig.findUnique({ where: { id: "default" } }).catch(() => null)
  return (config?.data ?? {}) as Record<string, string>
})

const fontHeading = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
})

interface RootLayoutProps {
  children: React.ReactNode
}

export async function generateMetadata() {
  const data = await getSiteConfigData()
  const googleVerification = data.googleVerification?.trim()
  const siteName = data.siteName?.trim() || siteConfig.name
  const description = data.siteDescription?.trim() || siteConfig.description
  const ogImage = data.heroImage?.trim() || data.logoUrl?.trim() || null
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
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: siteName }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
    manifest: `${appUrl}/site.webmanifest`,
    ...(googleVerification ? { verification: { google: googleVerification } } : {}),
  }
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const data = await getSiteConfigData()
  const trackingCode = data.trackingCode?.trim() ?? ""
  const scriptContent = trackingCode
    .replace(/<script[^>]*>/gi, "")
    .replace(/<\/script>/gi, "")
    .trim()

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
          {children}
          <Analytics />
          <Toaster />
          <TailwindIndicator />
        </ThemeProvider>
        {scriptContent && (
          <Script
            id="site-tracking"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: scriptContent }}
          />
        )}
      </body>
    </html>
  )
}
