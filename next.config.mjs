import { withContentlayer } from "next-contentlayer"

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
    config.externals.push({ "markdown-wasm/dist/markdown.node.js": "commonjs markdown-wasm/dist/markdown.node.js" })
    return config
  },
}

export default withContentlayer(nextConfig)
