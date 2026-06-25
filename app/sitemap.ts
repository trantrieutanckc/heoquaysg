import { MetadataRoute } from "next"
import { db } from "@/lib/db"
import { env } from "@/env.mjs"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

  const [posts, categories] = await Promise.all([
    db.post.findMany({
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    }),
    db.category.findMany({
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    }),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/lien-he`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ]

  const postPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${baseUrl}/posts/${p.id}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }))

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/categories/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  return [...staticPages, ...categoryPages, ...postPages]
}
