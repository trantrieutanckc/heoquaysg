import { Inter as FontSans } from "next/font/google"
import localFont from "next/font/local"
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

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

// Font files can be colocated inside of `pages`
const fontHeading = localFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
})

interface RootLayoutProps {
  children: React.ReactNode
}

export async function generateMetadata() {
  const data = await getSiteConfigData()
  const googleVerification = data.googleVerification?.trim()

  return {
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: ["Next.js", "React", "Tailwind CSS", "Server Components", "Radix UI"],
    authors: [{ name: "shadcn", url: "https://shadcn.com" }],
    creator: "shadcn",
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "white" },
      { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      title: siteConfig.name,
      description: siteConfig.description,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: siteConfig.description,
      images: [`${siteConfig.url}/og.jpg`],
      creator: "@shadcn",
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
    manifest: `${siteConfig.url}/site.webmanifest`,
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
          fontSans.variable,
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
