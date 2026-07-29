const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

function toSlug(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d").replace(/Đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120)
}

async function main() {
  const posts = await prisma.post.findMany({
    where: { OR: [{ slug: null }, { slug: "" }] },
    select: { id: true, title: true, slug: true },
  })

  if (!posts.length) {
    console.log("Tất cả bài đã có slug rồi.")
    return
  }

  console.log(`Tìm thấy ${posts.length} bài chưa có slug`)

  for (const post of posts) {
    if (!post.title) continue
    let slug = toSlug(post.title)
    // Tránh trùng slug
    const exists = await prisma.post.findUnique({ where: { slug } })
    if (exists && exists.id !== post.id) {
      slug = `${slug}-${post.id.slice(-4)}`
    }
    await prisma.post.update({ where: { id: post.id }, data: { slug } })
    console.log(`Updated: ${post.id} -> ${slug}`)
  }

  console.log("Xong!")
}

main().catch(console.error).finally(() => prisma.$disconnect())
