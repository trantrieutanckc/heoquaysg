const { PrismaClient } = require("@prisma/client")
const db = new PrismaClient()

// Ảnh thật của shop — map theo chủ đề bài viết
const IMG = {
  // Heo sữa trong hộp đẹp (nhiều hộp, nơ đỏ)
  heoSuaHop:   "/images/shop/heo-sua-hop-1.jpg",
  heoSuaHop3:  "/images/shop/heo-sua-hop-3.jpg",
  heoSuaDoi1:  "/images/shop/heo-sua-doi-1.jpg",
  heoSuaDoi3:  "/images/shop/heo-sua-doi-3.jpg",
  heoSuaXoi:   "/images/shop/heo-sua-xoi-1.jpg",
  heoSuaNho:   "/images/shop/heo-sua-nho-can.jpg",
  heoSuaCan1:  "/images/shop/heo-sua-can-1.jpg",
  // Heo quay lớn trên cân
  heoQuayCan1: "/images/shop/heo-quay-can-1.jpg",
  heoQuayCan2: "/images/shop/heo-quay-can-2.jpg",
  heoQuayKhay: "/images/shop/heo-quay-khay-1.jpg",
  // Trong lò quay
  heoQuayLo1:  "/images/shop/heo-quay-lo-1.jpg",
  heoQuayLo2:  "/images/shop/heo-quay-lo-2.jpg",
  heoQuayLo3:  "/images/shop/heo-quay-lo-3.jpg",
  // Giao hàng
  giaoHang:    "/images/shop/giao-hang-1.jpg",
}

const MAP = [
  // ── HEO SỮA ──
  { title: "Heo Quay Sữa Nguyên Con",    img: IMG.heoSuaHop,   alt: "Heo Quay Sữa Nguyên Con Heo Quay Bình Tân" },
  { title: "Heo Sữa Quay Lu",            img: IMG.heoSuaCan1,  alt: "Heo Sữa Quay Lu Da Giòn Đều" },
  { title: "Phân Biệt Heo Sữa",          img: IMG.heoSuaDoi1,  alt: "Heo Sữa Quay Chất Lượng Cao" },
  { title: "Giá Heo Sữa",                img: IMG.heoSuaNho,   alt: "Heo Sữa Quay Tươi Ngon Bình Tân" },
  { title: "Đầy Tháng",                  img: IMG.heoSuaXoi,   alt: "Heo Sữa Quay Cúng Đầy Tháng Kèm Xôi" },
  { title: "Heo Quay Sữa — Da Mỏng",    img: IMG.heoSuaDoi3,  alt: "Heo Quay Sữa Da Mỏng Giòn Tan" },

  // ── HEO QUAY (bài về quay kỹ thuật) ──
  { title: "Bí Quyết Châm Lỗ",          img: IMG.heoQuayLo1,  alt: "Kỹ Thuật Quay Heo Trong Lò" },
  { title: "Heo Quay Cả Con",            img: IMG.heoQuayCan1, alt: "Heo Quay Cả Con Tươi Ngon" },
  { title: "Da Giòn Rụm",               img: IMG.heoQuayCan2, alt: "Heo Quay Da Giòn Rụm Bình Tân" },
  { title: "Bí Quyết Quay",             img: IMG.heoQuayLo2,  alt: "Lò Quay Heo Truyền Thống" },
  { title: "7 Lỗi Thường Gặp",          img: IMG.heoQuayLo3,  alt: "Heo Quay Trong Lò Đúng Kỹ Thuật" },
  { title: "Heo Quay Miền Tây",         img: IMG.heoQuayCan2, alt: "Heo Quay Vàng Giòn Miền Tây" },
  { title: "Heo Quay 47",               img: IMG.heoQuayKhay, alt: "Heo Quay 47 Bình Tân" },
  { title: "Đặt Tiệc Tại Nhà",          img: IMG.heoSuaHop3,  alt: "Heo Quay Đóng Hộp Giao Tận Nơi" },
  { title: "Đặt Heo Quay Cúng Giỗ",    img: IMG.heoSuaDoi1,  alt: "Heo Quay Cúng Giỗ Trang Trọng" },
  { title: "Lá Mắc Mật",               img: IMG.heoQuayCan1, alt: "Heo Quay Lá Mắc Mật Thơm Ngon" },
  { title: "Bảo Quản Heo Quay — Giữ Da Giòn Cả Ngày", img: IMG.heoQuayKhay, alt: "Heo Quay Đóng Gói Bảo Quản" },
  { title: "Bảo Quản Heo Quay — Giữ Da Giòn Qua Đêm", img: IMG.heoQuayKhay, alt: "Heo Quay Bảo Quản Giữ Da Giòn" },
  { title: "Char Siu",                  img: IMG.heoQuayCan2, alt: "Heo Quay Kiểu Hoa" },
  { title: "Ngũ Vị Hương",             img: IMG.heoQuayLo1,  alt: "Heo Quay Ngũ Vị Thơm Lừng" },
  { title: "Heo Quay Sữa — Da Mỏng Giòn Tan", img: IMG.heoSuaDoi3, alt: "Heo Quay Sữa Da Mỏng" },
]

async function main() {
  const posts = await db.post.findMany({ select: { id: true, title: true } })
  let updated = 0

  for (const m of MAP) {
    const post = posts.find(p => p.title.includes(m.title))
    if (post) {
      await db.post.update({
        where: { id: post.id },
        data: { image: { url: m.img, alt: m.alt } }
      })
      console.log("✓", post.title.slice(0, 55))
      updated++
    }
  }

  // Categories — dùng ảnh shop thật
  await db.category.update({ where: { slug: "heo-quay" }, data: { image: { url: IMG.heoQuayCan1, alt: "Heo Quay Bình Tân" } } })
  await db.category.update({ where: { slug: "heo-sua"  }, data: { image: { url: IMG.heoSuaHop,  alt: "Heo Sữa Quay Bình Tân" } } })
  await db.category.update({ where: { slug: "mon-quay" }, data: { image: { url: IMG.heoSuaDoi1, alt: "Các Món Quay Bình Tân" } } })
  console.log("✓ Categories heo-quay, heo-sua, mon-quay")

  console.log(`\nCập nhật ${updated} bài + 3 categories.`)
}

main().catch(console.error).finally(() => db.$disconnect())
