const { PrismaClient } = require("@prisma/client")
const db = new PrismaClient()

const SEO = [
  // Heo quay
  { t: "Da Giòn Rụm",         d: "Bí quyết làm heo quay da giòn rụm chuẩn vị tại Heo Quay Bình Tân. Hướng dẫn chi tiết từ chọn heo đến kỹ thuật quay đúng chuẩn." },
  { t: "Ngũ Vị Hương",        d: "Công thức heo quay ngũ vị hương thơm lừng, da vàng giòn đẹp. Cách ướp và quay heo đúng kỹ thuật người Hoa truyền thống." },
  { t: "Pha Nước Chấm",       d: "Cách pha nước chấm heo quay ngon đúng điệu — tương hoisin, mù tạt, mắm gừng. Bí quyết nước chấm đi kèm hoàn hảo." },
  { t: "Bí Quyết Quay",       d: "Bí quyết quay heo ngon từ thợ quay chuyên nghiệp tại Bình Tân. Nhiệt độ, thời gian và kỹ thuật quay đúng chuẩn." },
  { t: "Lá Mắc Mật",          d: "Heo quay lá mắc mật — đặc sản giao thoa ẩm thực Tây Nguyên và Nam Bộ. Hương thơm độc đáo, da giòn, thịt ngọt đặc trưng." },
  { t: "Heo Quay 47",         d: "Câu chuyện về Heo Quay 47 — thương hiệu heo quay gia truyền tại Bình Tân. Hơn 20 năm giữ lửa bếp quay truyền thống." },
  { t: "Đặt Tiệc Tại Nhà",    d: "Hướng dẫn đặt heo quay cho tiệc tại nhà: tính số lượng kg phù hợp theo số khách, lưu ý khi nhận hàng và cách bảo quản." },
  { t: "Châm Lỗ Da Heo",      d: "Kỹ thuật châm lỗ da heo trước khi quay — bước quan trọng nhất để da giòn đều. Dụng cụ và mật độ châm đúng chuẩn." },
  { t: "Heo Quay Cả Con",     d: "Hướng dẫn quay heo cả con từ A đến Z: chọn heo, ướp gia vị, xử lý da và kỹ thuật quay đúng nhiệt độ cho heo 15–20 kg." },
  // Heo quay sữa (seed cũ)
  { t: "Heo Quay Sữa — Da Mỏng", d: "Heo quay sữa da mỏng giòn tan, thịt trắng ngọt tự nhiên. Cách chọn heo sữa đúng chuẩn và kỹ thuật quay than truyền thống." },
  { t: "Char Siu",             d: "Phân biệt Char Siu và Siu Yuk — hai món heo quay kiểu Hồng Kông. Công thức Char Siu tại nhà đơn giản, da bóng ngọt đậm đà." },
  { t: "Bảo Quản Heo Quay — Giữ Da Giòn Qua Đêm", d: "Mẹo bảo quản heo quay giữ da giòn qua đêm không bị mềm. Cách hâm lại bằng lò nướng đúng cách để da giòn trở lại." },
  { t: "Bảo Quản Heo Quay — Giữ Da Giòn Cả Ngày", d: "Bí quyết giữ da heo quay giòn cả ngày — từ cách bọc, cách để đến cách hâm lại đúng kỹ thuật không làm mềm da." },
  { t: "Heo Quay Miền Tây",   d: "Heo quay miền Tây Nam Bộ — hương vị sả gừng khói than độc đáo. Cách ăn kèm bánh mì, bánh tráng đặc trưng miền Tây." },
  // Gà quay
  { t: "Gà Quay Mật Ong — Da Giòn", d: "Gà quay mật ong da giòn vàng ươm, thịt ngọt không bở. Bí quyết phết mật ong đúng cách để da bóng caramel đẹp mắt." },
  { t: "Gà Quay Ngũ Vị",      d: "Gà quay ngũ vị thơm lừng từ trong ra ngoài. Công thức ướp và kỹ thuật nướng để da giòn đều, thịt mềm ngọt chuẩn vị Á Đông." },
  { t: "Gà Quay Muối",        d: "Gà quay muối kiểu người Hoa Sài Gòn — da vàng giòn không cần lò nướng. Công thức muối tiêu chanh truyền thống ăn kèm." },
  { t: "Chọn Gà Ngon",        d: "Bí quyết chọn gà ngon cho món quay: phân biệt gà ta và gà công nghiệp, nhận biết gà tươi tại chợ và chọn đúng loại theo từng công thức." },
  { t: "Gà Quay Lu",          d: "Gà quay lu — món ăn hoài cổ của người Hoa Chợ Lớn. Kỹ thuật quay lu đất nung truyền thống cho da giòn đều và hương thơm độc đáo." },
  { t: "Gà Quay Mật Ong Tỏi Ớt", d: "Gà quay mật ong tỏi ớt — da giòn ngọt cay khó cưỡng. Công thức phết mật ong nhiều lần và bí quyết không để tỏi cháy." },
  { t: "Chặt Gà Quay",        d: "Hướng dẫn chặt gà quay đúng kiểu — đẹp mắt, không bong da, thịt không vỡ. Thứ tự chặt và mẹo giữ da nguyên vẹn." },
  // Vịt quay
  { t: "Vịt Quay Chao",       d: "Vịt quay chao đặc sản miền Nam — vị béo thơm của chao đỏ thấm vào thịt vịt. Công thức ướp và cách ăn kèm đúng điệu miền Tây." },
  { t: "Vịt Quay Quảng Đông", d: "Vịt quay Quảng Đông chuẩn vị nhà hàng người Hoa. Bí quyết nhồi gia vị bên trong và lớp áo ngoài da giòn vàng đỏ đẹp." },
  { t: "Khử Mùi Tanh",        d: "Cách khử mùi tanh của vịt trước khi quay — các bước sơ chế đúng và mẹo chọn vịt ít tanh từ đầu để món quay thơm ngon." },
  { t: "Vịt Quay Bắc Kinh",   d: "Vịt quay Bắc Kinh tại nhà — có thể làm không? Hướng dẫn phiên bản rút gọn với lò gia đình và cách ăn đúng điệu Bắc Kinh." },
  { t: "Vịt Quay Ngũ Vị",     d: "Vịt quay ngũ vị chuẩn vị người Hoa không cần ra quán. Công thức ướp, lớp áo ngoài da và kỹ thuật quay cho da vàng giòn đẹp." },
  { t: "Bún Vịt",              d: "Cách làm tô bún vịt quay thơm ngon tại nhà — nước dùng từ xương vịt quay ngọt thanh, thịt giòn da, rau ăn kèm đúng vị." },
  // Heo sữa
  { t: "Heo Quay Sữa Nguyên Con", d: "Heo quay sữa nguyên con cho tiệc cưới, đầy tháng, cúng giỗ. Kích cỡ phù hợp theo số khách và dịch vụ đặt hàng tại Bình Tân." },
  { t: "Heo Sữa Quay Lu",     d: "Heo sữa quay lu — kỹ thuật truyền thống người Hoa cho da giòn đều khắp. Quy trình quay lu đất nung và ưu điểm so với lò thông thường." },
  { t: "Phân Biệt Heo Sữa",   d: "Cách phân biệt heo sữa quay ngon và kém chất lượng: nhìn màu da, gõ nghe tiếng, cắt xem thịt. Tránh mua heo cai sữa giả heo sữa." },
  { t: "Giá Heo Sữa",         d: "Giá heo sữa quay bao nhiêu tiền? Bảng giá tham khảo, cách tính chi phí và dấu hiệu nhận biết nơi bán giá rẻ kém chất lượng." },
  { t: "Đầy Tháng",           d: "Heo sữa quay cúng đầy tháng — ý nghĩa văn hóa, cách bày mâm cúng và hướng dẫn chọn size phù hợp. Đặt hàng tại Heo Quay Bình Tân." },
]

async function main() {
  const posts = await db.post.findMany({ select: { id: true, title: true, seoDescription: true } })
  let updated = 0

  for (const post of posts) {
    if (post.seoDescription) continue // Giữ nguyên nếu đã có
    const match = SEO.find(s => post.title.includes(s.t))
    if (match) {
      await db.post.update({ where: { id: post.id }, data: { seoDescription: match.d } })
      console.log("✓", post.title.slice(0, 55))
      updated++
    } else {
      console.log("→ Chưa match:", post.title.slice(0, 55))
    }
  }

  console.log(`\nCập nhật ${updated} bài.`)
}

main().catch(console.error).finally(() => db.$disconnect())
