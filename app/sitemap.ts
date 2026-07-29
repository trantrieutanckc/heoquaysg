import { MetadataRoute } from "next"
import { db } from "@/lib/db"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "")

  const [posts, categories, tags, pages] = await Promise.all([
    db.post.findMany({
      where: { published: true },
      select: { id: true, slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    }),
    db.category.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    }),
    db.tag.findMany({
      select: { slug: true, createdAt: true },
    }),
    db.page.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl,                         lastModified: new Date(), changeFrequency: "daily",   priority: 1 },
    { url: `${baseUrl}/blog`,               lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${baseUrl}/thuc-don`,           lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${baseUrl}/dat-lich`,           lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/categories`,         lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${baseUrl}/about`,              lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/lien-he`,            lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ]

  const postPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${baseUrl}/posts/${p.slug || p.id}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/categories/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  const tagPages: MetadataRoute.Sitemap = tags.map((t) => ({
    url: `${baseUrl}/tags/${t.slug}`,
    lastModified: t.createdAt,
    changeFrequency: "weekly",
    priority: 0.5,
  }))

  const pageRoutes: MetadataRoute.Sitemap = pages.map((p) => ({
    url: `${baseUrl}/pages/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.5,
  }))

  return [...staticPages, ...categoryPages, ...postPages, ...tagPages, ...pageRoutes]
}
