import "./env.mjs"

const securityHeaders = [
  // Prevent MIME type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Prevent clickjacking — blocks this site from being embedded in iframes
  { key: "X-Frame-Options", value: "DENY" },
  // Legacy XSS filter (for old browsers)
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // Don't send full referrer to external sites
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable sensors/features not needed
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js requires unsafe-inline for hydration scripts; unsafe-eval for some libs
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://static.hotjar.com https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Allow images from anywhere over HTTPS (Supabase Storage, avatars, etc.)
      "img-src 'self' data: blob: https:",
      "font-src 'self' https://fonts.gstatic.com data:",
      // API connections: Supabase Storage + common analytics endpoints
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://www.facebook.com",
      // Allow YouTube/Maps embeds in EditorJS content
      "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://maps.google.com https://www.google.com",
      // CRITICAL: prevent this site from being embedded anywhere (anti-clickjacking)
      "frame-ancestors 'none'",
      // Prevent <base> tag injection (a common redirect attack vector)
      "base-uri 'self'",
      // Form submissions must stay on this domain
      "form-action 'self'",
      "manifest-src 'self'",
      "media-src 'self' https:",
    ].join("; "),
  },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ]
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "contentlayer/generated": new URL("./lib/contentlayer-mock.mjs", import.meta.url).pathname,
    }
    return config
  },
}

export default nextConfig
