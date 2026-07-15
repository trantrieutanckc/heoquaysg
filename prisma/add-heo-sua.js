const { PrismaClient } = require("@prisma/client")
const db = new PrismaClient()
const AUTHOR = "cmrlnetjs0000h9ri0mx0cwfp"
const now = Date.now()

async function main() {
  const heoSua = await db.category.create({
    data: {
      name: "Heo Sữa",
      slug: "heo-sua",
      image: { url: "https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?w=1200&q=85", alt: "Heo Quay Sữa Da Giòn" },
      order: 1,
    }
  })
  console.log("✓ Category Heo Sữa:", heoSua.id)

  const monQuay  = await db.category.findUnique({ where: { slug: "mon-quay" } })
  const meoNauAn = await db.category.findUnique({ where: { slug: "meo-nau-an" } })
  const congThuc = await db.category.findUnique({ where: { slug: "cong-thuc" } })

  const posts = [
    {
      title: "Heo Quay Sữa Nguyên Con — Tiệc Cưới, Đầy Tháng, Cúng Giỗ",
      image: { url: "https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?w=1200&q=85", alt: "Heo Quay Sữa Nguyên Con" },
      cats: [heoSua.id, monQuay.id],
      content: { time: now, blocks: [
        { type: "paragraph", data: { text: "Heo quay sữa nguyên con là lựa chọn không thể thiếu trong các bữa tiệc quan trọng: cưới hỏi, đầy tháng, cúng giỗ hay tân gia. Heo sữa từ 3–6 kg với da mỏng vàng giòn, thịt trắng mềm ngọt là món sang trọng mà không phải nơi nào cũng làm được đúng chuẩn." } },
        { type: "header", data: { text: "Tại sao chọn heo sữa cho tiệc?", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Da mỏng giòn rụm hơn heo lớn — ăn một miếng là nhớ mãi", "Thịt trắng hồng, không mỡ dày — phù hợp mọi lứa tuổi", "Trình bày đẹp nguyên con trên mâm — sang trọng, có ý nghĩa", "Phần ăn vừa đủ cho 8–12 người một con"] } },
        { type: "header", data: { text: "Kích cỡ phù hợp theo số khách", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["3–4 kg: tiệc nhỏ 6–8 người, ăn kèm các món khác", "4–5 kg: 10–12 người, lý tưởng cho đầy tháng", "5–6 kg: 12–15 người, phổ biến trong tiệc cưới", "Trên 6 kg: đặt hàng trước 2 ngày, phục vụ tiệc lớn"] } },
        { type: "header", data: { text: "Dịch vụ đặt heo sữa tại Heo Quay Bình Tân", level: 2 } },
        { type: "paragraph", data: { text: "Chúng tôi nhận đặt heo sữa nguyên con giao tận nơi hoặc khách tự đến lấy. Heo được chọn lọc kỹ, quay trong ngày, giao trong vòng 2 tiếng sau khi quay xong để đảm bảo da còn giòn. Đặt trước tối thiểu 1 ngày, tiệc lớn đặt trước 2–3 ngày." } },
        { type: "header", data: { text: "Cách thưởng thức đúng điệu", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Chặt ngay khi vừa nhận — da giòn nhất trong 1–2 tiếng đầu", "Ăn kèm bánh mì hoặc xôi gấc đỏ trong tiệc cúng", "Nước chấm: tương hoisin pha mù tạt hoặc mắm gừng", "Phần da nên ăn trước, để lâu da mềm dần"] } },
      ]},
    },
    {
      title: "Heo Sữa Quay Lu — Kỹ Thuật Truyền Thống Cho Da Giòn Đều Khắp",
      image: { url: "https://images.unsplash.com/photo-1585703900468-13785b50e4e4?w=1200&q=85", alt: "Heo Sữa Quay Lu" },
      cats: [heoSua.id, congThuc.id],
      content: { time: now, blocks: [
        { type: "paragraph", data: { text: "Quay lu là kỹ thuật đặt con heo vào trong chiếc lu đất nung nóng, quay bằng nhiệt bức xạ từ thành lu thay vì tiếp xúc trực tiếp với lửa. Đây là phương pháp truyền thống của người Hoa mang lại độ giòn đều và màu sắc vàng đẹp không thể tìm thấy ở phương pháp nào khác." } },
        { type: "header", data: { text: "Lu đất — công cụ đặc biệt", level: 2 } },
        { type: "paragraph", data: { text: "Lu dùng để quay heo là loại lu đất nung chuyên dụng, cao khoảng 80–100 cm, đường kính 50–60 cm. Thành lu dày giữ nhiệt đều, không bị điểm nóng cục bộ như lò quay thông thường. Trước khi dùng, lu được nung nóng bằng than hoa trong khoảng 30 phút." } },
        { type: "header", data: { text: "Quy trình quay lu heo sữa", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Bước 1: Ướp heo sữa 4–6 tiếng với ngũ vị hương, muối, đường, tỏi gừng", "Bước 2: Phơi ngoài không khí 1 tiếng cho da khô hoàn toàn", "Bước 3: Nung lu bằng than hoa đến khi thành lu đỏ ửng", "Bước 4: Treo heo vào trong lu, đậy miệng lu bằng nắp đất", "Bước 5: Quay 45–60 phút, mở kiểm tra và xoay heo giữa chừng", "Bước 6: Phết mật ong trong 10 phút cuối để da bóng đẹp"] } },
        { type: "header", data: { text: "Ưu điểm so với quay than thông thường", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Da giòn đều 100% bề mặt, không có điểm cháy hay còn sống", "Màu vàng đỏ đẹp tự nhiên, không cần phẩm màu", "Thịt giữ ẩm tốt hơn vì nhiệt bao quanh đều", "Mùi thơm đặc trưng từ đất nung — không lò nào thay thế được"] } },
      ]},
    },
    {
      title: "Phân Biệt Heo Sữa Quay Ngon và Heo Sữa Kém Chất Lượng",
      image: { url: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=1200&q=85", alt: "Heo Sữa Quay Chất Lượng" },
      cats: [heoSua.id, meoNauAn.id],
      content: { time: now, blocks: [
        { type: "paragraph", data: { text: "Trên thị trường có rất nhiều nơi bán heo sữa quay, nhưng chất lượng chênh lệch rất lớn. Biết cách phân biệt sẽ giúp bạn không bị mua phải hàng kém, đặc biệt trong các dịp tiệc quan trọng." } },
        { type: "header", data: { text: "Nhìn — màu sắc nói lên tất cả", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Tốt: da màu đỏ vàng đẹp, đều, không có đốm cháy đen", "Tốt: bề mặt bóng nhẹ tự nhiên, không bóng loáng quá mức (dấu hiệu phẩm màu)", "Kém: màu đỏ gắt bất thường — dùng phẩm màu hoặc xi-rô đậm", "Kém: có vùng trắng nhợt chưa chín hoặc đen cháy không đều"] } },
        { type: "header", data: { text: "Gõ — nghe tiếng da", level: 2 } },
        { type: "paragraph", data: { text: "Dùng đũa gõ nhẹ lên da: nghe tiếng gõ giòn rỗng là da đạt chuẩn. Tiếng gõ đặc bịch là da còn mềm hoặc đã mềm do để lâu. Đây là test nhanh nhất và chính xác nhất bạn có thể làm tại chỗ." } },
        { type: "header", data: { text: "Cắt — xem thịt bên trong", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Tốt: thịt màu trắng hồng đều, không có nước đỏ chảy ra", "Tốt: lớp mỡ mỏng dưới da, không dày quá 5mm", "Kém: thịt còn hồng đỏ bên xương — chưa chín kỹ", "Kém: mỡ dày và nhão — heo quá lớn bị bán nhầm là heo sữa"] } },
        { type: "header", data: { text: "Heo sữa thật vs heo nhỏ giả sữa", level: 2 } },
        { type: "paragraph", data: { text: "Heo sữa thật phải còn đang bú mẹ, dưới 21 ngày tuổi, nặng tối đa 6 kg. Một số nơi dùng heo con đã cai sữa (4–5 tuần, 7–10 kg) để bán với giá heo sữa. Cách phân biệt: heo sữa thật thịt trắng muốt, không mùi; heo cai sữa thịt hồng đậm hơn và có mùi heo nhẹ." } },
      ]},
    },
  ]

  for (const p of posts) {
    const post = await db.post.create({
      data: {
        title: p.title,
        content: p.content,
        published: true,
        image: p.image,
        authorId: AUTHOR,
        categories: { create: p.cats.map(id => ({ categoryId: id })) },
      }
    })
    console.log("✓", post.title.slice(0, 60))
  }

  const total = await db.post.count()
  console.log("\nTổng posts:", total)
}

main().catch(console.error).finally(() => db.$disconnect())
