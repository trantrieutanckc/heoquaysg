const { PrismaClient } = require("@prisma/client")
const db = new PrismaClient()

const CAT_IMAGES = {
  "heo-quay":  { url: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=1200&q=85", alt: "Heo Quay Bình Tân" },
  "ga-quay":   { url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&q=85", alt: "Gà Quay Thơm Ngon" },
  "vit-quay":  { url: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=1200&q=85", alt: "Vịt Quay Da Giòn" },
  "mon-quay":  { url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=85", alt: "Các Món Quay Đặc Sắc" },
  "cong-thuc": { url: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1200&q=85", alt: "Công Thức Nấu Ăn" },
  "meo-nau-an":{ url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=85", alt: "Mẹo Nấu Ăn Hay" },
}

// Better per-post images
const POST_IMAGES = [
  // Heo quay
  { titleContains: "Heo Quay Sữa",      url: "https://images.unsplash.com/photo-1585703900468-13785b50e4e4?w=1200&q=85", alt: "Heo Quay Sữa Da Giòn" },
  { titleContains: "Char Siu",           url: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=1200&q=85", alt: "Char Siu và Siu Yuk" },
  { titleContains: "Bảo Quản Heo Quay", url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=85", alt: "Bảo Quản Heo Quay" },
  { titleContains: "Heo Quay Miền Tây", url: "https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&q=85", alt: "Heo Quay Miền Tây Than Củi" },
  // Gà quay
  { titleContains: "Gà Quay Ngũ Vị",    url: "https://images.unsplash.com/photo-1598103442097-8b74394b95c2?w=1200&q=85", alt: "Gà Quay Ngũ Vị" },
  { titleContains: "Gà Quay Muối",       url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&q=85", alt: "Gà Quay Muối Da Vàng" },
  { titleContains: "Chọn Gà Ngon",       url: "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=1200&q=85", alt: "Chọn Gà Ngon Tươi" },
  // Vịt quay
  { titleContains: "Vịt Quay Chao",      url: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=1200&q=85", alt: "Vịt Quay Chao Miền Nam" },
  { titleContains: "Vịt Quay Quảng Đông",url: "https://images.unsplash.com/photo-1609107028023-43f0e83ee32a?w=1200&q=85", alt: "Vịt Quay Quảng Đông" },
  { titleContains: "Khử Mùi Tanh",       url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=85", alt: "Sơ Chế Vịt Đúng Cách" },
  // Các bài seed gốc (Heo Quay Giòn, etc)
  { titleContains: "Da Giòn Rụm",        url: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=1200&q=85", alt: "Heo Quay Da Giòn Rụm" },
  { titleContains: "Ngũ Vị Hương",       url: "https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&q=85", alt: "Heo Quay Ngũ Vị Hương" },
  { titleContains: "Pha Nước Chấm",      url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=85", alt: "Nước Chấm Heo Quay" },
  { titleContains: "Bí Quyết Quay",      url: "https://images.unsplash.com/photo-1585703900468-13785b50e4e4?w=1200&q=85", alt: "Bí Quyết Heo Quay Ngon" },
  { titleContains: "Công Thức",          url: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1200&q=85", alt: "Công Thức Nấu Ăn" },
  { titleContains: "Mẹo",               url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=85", alt: "Mẹo Nấu Ăn Hay" },
]

async function main() {
  // 1. Update category images
  const cats = await db.category.findMany({ select: { id: true, slug: true, name: true } })
  for (const cat of cats) {
    const img = CAT_IMAGES[cat.slug]
    if (img) {
      await db.category.update({ where: { id: cat.id }, data: { image: img } })
      console.log("✓ Category ảnh:", cat.name)
    }
  }

  // 2. Update post images
  const posts = await db.post.findMany({ select: { id: true, title: true, image: true } })
  for (const post of posts) {
    const match = POST_IMAGES.find(p => post.title.includes(p.titleContains))
    if (match) {
      await db.post.update({ where: { id: post.id }, data: { image: { url: match.url, alt: match.alt } } })
      console.log("✓ Post ảnh:", post.title.slice(0, 50))
    } else {
      console.log("→ Giữ ảnh cũ:", post.title.slice(0, 50))
    }
  }

  console.log("\nDone!")
}

main().catch(console.error).finally(() => db.$disconnect())
