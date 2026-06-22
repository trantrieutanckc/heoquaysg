const { PrismaClient } = require("@prisma/client")
const db = new PrismaClient()

const ADMIN_ID = "cmqowl0w40000h98etnodtd00"

const content = JSON.stringify({
  time: Date.now(),
  blocks: [
    {
      type: "paragraph",
      data: {
        text: "Heo quay là món ăn truyền thống đặc sắc của ẩm thực Việt Nam và Hoa. Với lớp da vàng ươm giòn rụm và thịt mềm thơm ngậy, heo quay từ lâu đã trở thành món không thể thiếu trong các dịp lễ, cúng giỗ, và tiệc tùng.",
      },
    },
    {
      type: "header",
      data: { text: "Bí quyết để da heo quay giòn", level: 2 },
    },
    {
      type: "list",
      data: {
        style: "ordered",
        items: [
          "Chọn heo tươi, da mỏng đều",
          "Ướp gia vị ít nhất 4 tiếng trước khi quay",
          "Phơi da cho khô hoàn toàn trước khi vào lò",
          "Quay ở nhiệt độ cao 220°C trong 20 phút đầu",
          "Hạ nhiệt xuống 180°C cho đến khi chín đều",
        ],
      },
    },
    {
      type: "paragraph",
      data: {
        text: "Quá trình quay đòi hỏi kinh nghiệm và sự kiên nhẫn. Nhiệt độ và thời gian là hai yếu tố quyết định độ giòn của da và độ mềm của thịt.",
      },
    },
    {
      type: "header",
      data: { text: "Cách phục vụ", level: 2 },
    },
    {
      type: "paragraph",
      data: {
        text: "Heo quay ngon nhất khi dùng nóng, chặt miếng vừa ăn, kèm theo tương hoisin, dưa leo thái lát và bánh mì hoặc cơm trắng.",
      },
    },
  ],
  version: "2.26.5",
})

async function main() {
  // Tạo categories nếu chưa có
  const cats = [
    { name: "Món Quay", slug: "mon-quay", template: "hero" },
    { name: "Công Thức", slug: "cong-thuc", template: "grid" },
    { name: "Mẹo Nấu Ăn", slug: "meo-nau-an", template: "standard" },
  ]

  const createdCats = {}
  for (const cat of cats) {
    const existing = await db.category.findUnique({ where: { slug: cat.slug } })
    if (existing) {
      await db.category.update({ where: { slug: cat.slug }, data: { template: cat.template } })
      createdCats[cat.slug] = existing.id
      console.log(`Updated category: ${cat.name} (template: ${cat.template})`)
    } else {
      const created = await db.category.create({ data: cat })
      createdCats[cat.slug] = created.id
      console.log(`Created category: ${cat.name} (template: ${cat.template})`)
    }
  }

  // Tạo bài viết với 3 template khác nhau
  const posts = [
    {
      title: "Heo Quay Da Giòn — Công Thức Gia Truyền",
      template: "standard",
      published: true,
      image: { url: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80", alt: "Heo quay da giòn" },
      categorySlug: "mon-quay",
    },
    {
      title: "Vịt Quay Bắc Kinh — Bí Quyết Da Mỏng Giòn",
      template: "wide",
      published: true,
      image: { url: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=800&q=80", alt: "Vịt quay Bắc Kinh" },
      categorySlug: "cong-thuc",
    },
    {
      title: "5 Mẹo Chọn Heo Tươi Cho Món Quay Ngon",
      template: "minimal",
      published: true,
      image: { url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80", alt: "Chọn heo tươi" },
      categorySlug: "meo-nau-an",
    },
  ]

  for (const p of posts) {
    const existing = await db.post.findFirst({ where: { title: p.title } })
    if (existing) {
      await db.post.delete({ where: { id: existing.id } })
    }

    const post = await db.post.create({
      data: {
        title: p.title,
        content: JSON.parse(content),
        template: p.template,
        published: p.published,
        image: p.image,
        authorId: ADMIN_ID,
        categories: {
          create: [{ categoryId: createdCats[p.categorySlug] }],
        },
      },
    })
    console.log(`Created post: "${p.title}" (template: ${p.template}) → /posts/${post.id}`)
  }
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
