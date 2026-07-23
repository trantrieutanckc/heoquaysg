import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

async function main() {
  const posts = await db.post.findMany({
    where: { slug: null },
    select: { id: true, title: true },
  })

  console.log(`Tìm thấy ${posts.length} bài chưa có slug`)

  const usedSlugs = new Set(
    (await db.post.findMany({ where: { slug: { not: null } }, select: { slug: true } }))
      .map((p) => p.slug)
  )

  let updated = 0
  let skipped = 0

  for (const post of posts) {
    let base = slugify(post.title)
    if (!base) {
      console.log(`  SKIP (title rỗng): ${post.id}`)
      skipped++
      continue
    }

    let slug = base
    let i = 2
    while (usedSlugs.has(slug)) {
      slug = `${base}-${i++}`
    }
    usedSlugs.add(slug)

    await db.post.update({ where: { id: post.id }, data: { slug } })
    console.log(`  ✓ "${post.title}" → /posts/${slug}`)
    updated++
  }

  console.log(`\nXong: ${updated} bài đã sinh slug, ${skipped} bỏ qua.`)
}

main().catch(console.error).finally(() => db.$disconnect())
