import "./env.mjs"

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
    domains: ["avatars.githubusercontent.com", "heoquay.com"],
  },
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["@prisma/client"],
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
