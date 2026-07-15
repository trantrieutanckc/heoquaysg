const { PrismaClient } = require("@prisma/client")
const db = new PrismaClient()

// Tags và bài nào cần gán (dùng title keyword để match)
const TAGS = [
  { name: "Heo Quay",    slug: "heo-quay" },
  { name: "Heo Sữa",    slug: "heo-sua" },
  { name: "Gà Quay",    slug: "ga-quay" },
  { name: "Vịt Quay",   slug: "vit-quay" },
  { name: "Da Giòn",    slug: "da-gion" },
  { name: "Bí Quyết",   slug: "bi-quyet" },
  { name: "Đặt Tiệc",   slug: "dat-tiec" },
  { name: "Cúng Giỗ",   slug: "cung-gio" },
  { name: "Giao Hàng",  slug: "giao-hang" },
  { name: "Bảo Quản",   slug: "bao-quan" },
]

// Map: keyword trong title → tag slugs
const RULES = [
  // Heo quay
  { kw: "Heo Quay",        tags: ["heo-quay"] },
  { kw: "Heo Sữa",         tags: ["heo-sua", "heo-quay"] },
  { kw: "Gà Quay",         tags: ["ga-quay"] },
  { kw: "Vịt Quay",        tags: ["vit-quay"] },
  { kw: "Char Siu",        tags: ["heo-quay"] },
  { kw: "Da Giòn",         tags: ["da-gion"] },
  { kw: "Bảo Quản",        tags: ["bao-quan", "da-gion"] },
  { kw: "Bí Quyết",        tags: ["bi-quyet"] },
  { kw: "Châm Lỗ",         tags: ["bi-quyet", "heo-quay"] },
  { kw: "Tiệc",            tags: ["dat-tiec"] },
  { kw: "Cúng Giỗ",        tags: ["cung-gio", "dat-tiec"] },
  { kw: "Đầy Tháng",       tags: ["cung-gio", "heo-sua"] },
  { kw: "Giao",            tags: ["giao-hang"] },
  { kw: "Ngũ Vị",          tags: ["bi-quyet"] },
  { kw: "Mắc Mật",         tags: ["heo-quay", "bi-quyet"] },
  { kw: "Chao",            tags: ["vit-quay"] },
  { kw: "Bún",             tags: ["vit-quay"] },
  { kw: "Miền Tây",        tags: ["heo-quay"] },
  { kw: "Muối",            tags: ["ga-quay"] },
  { kw: "Mật Ong",         tags: ["ga-quay"] },
  { kw: "Lu",              tags: ["bi-quyet"] },
  { kw: "Chặt",            tags: ["bi-quyet"] },
  { kw: "Chọn Gà",         tags: ["ga-quay", "bi-quyet"] },
  { kw: "Khử Mùi",         tags: ["vit-quay", "bi-quyet"] },
  { kw: "Phân Biệt",       tags: ["bi-quyet"] },
]

async function main() {
  // Upsert all tags
  const tagMap = {}
  for (const t of TAGS) {
    const tag = await db.tag.upsert({
      where: { slug: t.slug },
      update: {},
      create: { name: t.name, slug: t.slug },
    })
    tagMap[t.slug] = tag.id
    console.log("tag:", t.name)
  }

  const posts = await db.post.findMany({ select: { id: true, title: true } })

  let linked = 0
  for (const post of posts) {
    const slugsToAdd = new Set()

    for (const rule of RULES) {
      if (post.title.includes(rule.kw)) {
        rule.tags.forEach(s => slugsToAdd.add(s))
      }
    }

    for (const slug of slugsToAdd) {
      const tagId = tagMap[slug]
      if (!tagId) continue
      await db.postTag.upsert({
        where: { postId_tagId: { postId: post.id, tagId } },
        update: {},
        create: { postId: post.id, tagId },
      })
      linked++
    }

    if (slugsToAdd.size > 0) {
      console.log("✓", post.title.slice(0, 50), "→", [...slugsToAdd].join(", "))
    }
  }

  console.log(`\n${TAGS.length} tags, ${linked} liên kết.`)
}

main().catch(console.error).finally(() => db.$disconnect())
