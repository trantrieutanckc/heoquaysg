const { PrismaClient } = require("@prisma/client")
const db = new PrismaClient()

const AUTHOR = "cmrlnetjs0000h9ri0mx0cwfp"

// Categories đã có sau seed (verify bằng slug)
const EXISTING = {
  monQuay: "mon-quay",
  congThuc: "cong-thuc",
  meoNauAn: "meo-nau-an",
}

const now = Date.now()

const NEW_CATS = [
  { name: "Heo Quay", slug: "heo-quay" },
  { name: "Gà Quay", slug: "ga-quay" },
  { name: "Vịt Quay", slug: "vit-quay" },
]

async function main() {
  // 1. Lấy IDs categories hiện có
  const existingCats = await db.category.findMany({ select: { id: true, slug: true } })
  const catMap = Object.fromEntries(existingCats.map(c => [c.slug, c.id]))

  // 2. Tạo categories thiếu
  for (const cat of NEW_CATS) {
    if (!catMap[cat.slug]) {
      const created = await db.category.create({ data: { name: cat.name, slug: cat.slug } })
      catMap[cat.slug] = created.id
      console.log("✓ Category:", cat.name)
    } else {
      console.log("→ Category đã có:", cat.name)
    }
  }

  // 3. Tạo siteConfig
  const existing = await db.siteConfig.findUnique({ where: { id: "default" } })
  if (!existing) {
    await db.siteConfig.create({
      data: {
        id: "default",
        data: {
          siteName: "Heo Quay Bình Tân",
          siteDescription: "Chuyên heo quay, gà quay, vịt quay tươi ngon tại Bình Tân, TP.HCM",
          contactPhone: "0987054231",
          contactAddress: "Bình Tân, TP.HCM",
          homeBookingLabel: "Đặt Lịch Ngay",
          homeBookingTitle: "Giao Hàng Tận Nơi / Đặt Lịch Ngay Hôm Nay",
          homeBookingDesc: "Liên hệ với chúng tôi để đặt hàng nhanh chóng. Giao hàng trong ngày, cam kết tươi ngon.",
          homeBookingBtn1Text: "Gọi đặt hàng",
          homeBookingBtn2Text: "Xem thực đơn",
          homeBookingBtn2Link: "/thuc-don",
        },
      },
    })
    console.log("✓ SiteConfig created")
  } else {
    console.log("→ SiteConfig đã có")
  }

  // 4. Posts heo quay
  const heoQuayPosts = [
    {
      title: "Heo Quay Sữa — Da Mỏng Giòn Tan, Thịt Mềm Ngọt Đặc Trưng",
      image: { url: "https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?w=800&q=80", alt: "Heo Quay Sữa" },
      cats: ["heo-quay", "mon-quay"],
      content: { time: now, blocks: [
        { type: "paragraph", data: { text: "Heo quay sữa là món ăn cao cấp dùng heo con còn đang bú mẹ, khoảng 3–5 kg. Da cực mỏng, thịt mềm ngọt tự nhiên, không có mỡ dày như heo trưởng thành — đây là lý do heo quay sữa luôn được ưa chuộng trong tiệc cưới và sự kiện quan trọng." } },
        { type: "header", data: { text: "Chọn heo sữa đúng chuẩn", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Chọn heo 3–5 kg — quá nhỏ ít thịt, quá lớn da dày khó giòn", "Da trắng hồng, mịn đều không có vết thâm", "Heo còn bú mẹ hoàn toàn — thịt mới ngọt tự nhiên", "Mua từ trại uy tín, có nguồn gốc rõ ràng"] } },
        { type: "header", data: { text: "Ướp gia vị đơn giản — để vị thịt tự nhiên lên ngôi", level: 2 } },
        { type: "paragraph", data: { text: "Khác với heo lớn cần ướp đậm, heo sữa chỉ cần ướp nhẹ để giữ vị ngọt tự nhiên của thịt. Hỗn hợp ướp bên trong: 1 thìa muối + 1/2 thìa đường + 1/4 thìa ngũ vị hương + tỏi gừng băm. Bên ngoài da chỉ cần muối và giấm." } },
        { type: "header", data: { text: "Kỹ thuật quay — lửa là tất cả", level: 2 } },
        { type: "paragraph", data: { text: "Quay heo sữa cần lửa than hồng đều, không được có ngọn lửa bùng. Giai đoạn đầu quay xa lửa 40–50 cm để thịt chín từ từ, sau đó đưa gần lửa hơn để da phồng giòn. Liên tục xoay đều tay, mỗi 5 phút một lần, tổng thời gian khoảng 60–75 phút." } },
        { type: "header", data: { text: "Cách phân biệt heo sữa quay ngon", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Da màu đỏ vàng đẹp, giòn đều không bị cháy đốm", "Dùng đũa gõ nhẹ lên da nghe tiếng cộp — đó là da giòn chuẩn", "Thịt bên trong màu trắng hồng, không bị khô hay có nước đỏ chảy ra", "Mùi thơm ngũ vị hương thoang thoảng, không bị nồng"] } },
      ]},
    },
    {
      title: "Char Siu và Siu Yuk — Hai Món Heo Quay Kiểu Hồng Kông Khác Nhau Thế Nào?",
      image: { url: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80", alt: "Heo Quay Hồng Kông" },
      cats: ["heo-quay", "mon-quay"],
      content: { time: now, blocks: [
        { type: "paragraph", data: { text: "Trong ẩm thực Quảng Đông, có hai món heo quay nổi tiếng thế giới: Char Siu và Siu Yuk. Nhiều người nhầm lẫn hai món này, nhưng thực chất chúng hoàn toàn khác nhau về nguyên liệu, kỹ thuật và hương vị." } },
        { type: "header", data: { text: "Char Siu — thịt heo xá xíu đỏ ngọt", level: 2 } },
        { type: "paragraph", data: { text: "Char Siu dùng thịt heo thăn hoặc ba chỉ, ướp với hỗn hợp đặc trưng gồm mật ong, tương hoisin, nước tương, rượu Shaoxing. Thịt được xiên que và quay trong lò đến khi có màu đỏ nâu bóng đẹp, vị ngọt đậm đà." } },
        { type: "header", data: { text: "Siu Yuk — heo quay da giòn nguyên con", level: 2 } },
        { type: "paragraph", data: { text: "Siu Yuk là heo quay nguyên con hoặc nguyên mảng, tập trung vào lớp da giòn rụm bên ngoài. Thịt ướp gia vị nhẹ hơn Char Siu, phần da được xử lý kỹ bằng cách châm lỗ và phơi khô để đạt độ giòn tối đa." } },
        { type: "header", data: { text: "So sánh nhanh", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Char Siu: thịt cắt miếng, màu đỏ ngọt, ăn với cơm trắng hoặc bún", "Siu Yuk: nguyên con hoặc mảng, da vàng giòn, dùng trong tiệc và lễ cúng", "Char Siu phổ biến ở dim sum; Siu Yuk phổ biến trong tiệc tùng"] } },
        { type: "header", data: { text: "Cách làm Char Siu tại nhà", level: 2 } },
        { type: "paragraph", data: { text: "Ướp 500g thịt ba chỉ với: 2 thìa tương hoisin + 1 thìa mật ong + 1 thìa nước tương + 1/2 thìa ngũ vị hương + 1 thìa rượu trắng + 1 thìa đường. Ướp 4 tiếng. Nướng 200°C trong 25 phút, lật và phết thêm mật ong, nướng thêm 10 phút cho bóng đẹp." } },
      ]},
    },
    {
      title: "Mẹo Bảo Quản Heo Quay — Giữ Da Giòn Qua Đêm Không Bị Mềm",
      image: { url: "https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?w=800&q=80", alt: "Bảo Quản Heo Quay" },
      cats: ["meo-nau-an", "heo-quay"],
      content: { time: now, blocks: [
        { type: "paragraph", data: { text: "Heo quay ngon nhất khi ăn trong vòng 2–3 tiếng sau khi quay xong. Nhưng nếu không dùng hết, bảo quản đúng cách vẫn có thể giữ được độ giòn và hương vị tốt." } },
        { type: "header", data: { text: "Sai lầm thường gặp khi bảo quản", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Bọc nilon kín ngay khi còn nóng — hơi nước làm da mềm nhũn trong vài tiếng", "Để trong tủ lạnh không che — da bị khô cứng, thịt mất ẩm", "Hâm lại bằng lò vi sóng — da mềm hoàn toàn không thể cứu"] } },
        { type: "header", data: { text: "Cách bảo quản đúng", level: 2 } },
        { type: "paragraph", data: { text: "Để heo quay nguội hoàn toàn ở nhiệt độ phòng trước khi cất. Tách phần da ra khỏi thịt nếu có thể, đặt phần da hướng lên trên. Bọc nhẹ bằng giấy nến (không bọc kín) rồi cho vào tủ lạnh ngăn mát." } },
        { type: "header", data: { text: "Cách làm giòn da trở lại", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Lò nướng: 220°C trong 8–10 phút, da hướng lên — hiệu quả nhất", "Chảo gang: không dầu, áp phần da xuống chảo nóng già 3–4 phút", "Nồi chiên không dầu: 200°C trong 5–7 phút — tiện nhất tại nhà", "Tuyệt đối không dùng lò vi sóng"] } },
        { type: "header", data: { text: "Thời gian bảo quản tối đa", level: 2 } },
        { type: "paragraph", data: { text: "Ngăn mát tủ lạnh: 3–4 ngày. Ngăn đá: 1–2 tháng (rã đông ngăn mát qua đêm). Sau khi làm giòn lại bằng lò nướng, heo quay sẽ đạt khoảng 80–90% so với ban đầu." } },
      ]},
    },
    {
      title: "Heo Quay Miền Tây — Hương Vị Sả Gừng Khói Than Độc Đáo",
      image: { url: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80", alt: "Heo Quay Miền Tây" },
      cats: ["heo-quay", "mon-quay"],
      content: { time: now, blocks: [
        { type: "paragraph", data: { text: "Heo quay miền Tây Nam Bộ có những nét đặc trưng riêng, khác biệt so với heo quay Sài Gòn hay phong cách Quảng Đông. Sự khác biệt đến từ nguyên liệu địa phương, kỹ thuật quay trên than củi và cách thưởng thức dân dã." } },
        { type: "header", data: { text: "Gia vị đặc trưng miền Tây", level: 2 } },
        { type: "paragraph", data: { text: "Heo quay miền Tây thường dùng sả và gừng nhiều hơn trong hỗn hợp ướp, tạo mùi thơm đặc trưng. Một số nơi còn thêm lá chanh và nghệ tươi để tạo màu vàng tự nhiên và hương thơm khác biệt so với ngũ vị hương truyền thống." } },
        { type: "header", data: { text: "Kỹ thuật quay trên than củi lộ thiên", level: 2 } },
        { type: "paragraph", data: { text: "Thay vì lò quay công nghiệp, heo quay miền Tây thường được quay trên bếp than củi ngoài trời. Hơi nhiệt lan tỏa tự nhiên, kết hợp với khói củi tạo nên mùi thơm mà lò hiện đại không thể tái tạo được." } },
        { type: "header", data: { text: "Cách ăn kèm đặc trưng", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Ăn với bánh mì — phổ biến nhất, cắt miếng to kẹp bánh mì nóng", "Cuốn bánh tráng — thêm dưa leo, rau thơm, bún tươi bên trong", "Chấm nước tương gừng — đơn giản nhưng đậm vị", "Ăn kèm dưa cải muối chua — cắt béo, giải ngán"] } },
      ]},
    },
  ]

  // 5. Posts gà quay + vịt quay
  const gaVitPosts = [
    {
      title: "Gà Quay Ngũ Vị — Thơm Lừng Từ Trong Ra Ngoài",
      image: { url: "https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=800&q=80", alt: "Gà Quay Ngũ Vị" },
      cats: ["ga-quay", "cong-thuc"],
      content: { time: now, blocks: [
        { type: "paragraph", data: { text: "Gà quay ngũ vị là công thức kinh điển của ẩm thực Á Đông, kết hợp hoàn hảo giữa hương thơm của ngũ vị hương và vị ngọt tự nhiên của gà ta. Lớp da vàng giòn, thịt mềm thấm đều gia vị — món ăn không bao giờ lỗi thời." } },
        { type: "header", data: { text: "Nguyên liệu cho 1 con gà 1.5–2 kg", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["1 con gà ta khoảng 1.5–2 kg", "1.5 thìa ngũ vị hương", "2 thìa nước tương đậm", "1 thìa dầu hào", "1 thìa mật ong", "1 thìa rượu trắng", "4 tép tỏi + 1 củ gừng nhỏ băm nhuyễn", "1 thìa đường, muối, tiêu"] } },
        { type: "header", data: { text: "Kỹ thuật nướng để da giòn đều", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Lấy gà ra khỏi tủ lạnh 30 phút trước khi nướng", "Nướng 210°C trong 20 phút đầu — da phồng và bắt đầu giòn", "Hạ xuống 175°C nướng thêm 30–35 phút", "Phết thêm mật ong pha nước tương trong 5 phút cuối", "Để nghỉ 10 phút trước khi chặt"] } },
      ]},
    },
    {
      title: "Gà Quay Muối — Công Thức Truyền Thống Người Hoa Tại Sài Gòn",
      image: { url: "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=800&q=80", alt: "Gà Quay Muối" },
      cats: ["ga-quay", "mon-quay"],
      content: { time: now, blocks: [
        { type: "paragraph", data: { text: "Gà quay muối là món gà không quá cầu kỳ nhưng đòi hỏi kỹ thuật tinh tế. Da vàng ươm, thịt mềm ngọt, chấm muối tiêu chanh — đơn giản mà không kém phần sang trọng trong ẩm thực người Hoa ở Sài Gòn." } },
        { type: "header", data: { text: "Bí quyết da vàng không cần lò nướng", level: 2 } },
        { type: "paragraph", data: { text: "Khác với gà quay thông thường, gà quay muối dùng kỹ thuật luộc rồi ngâm lạnh và chiên giòn. Gà được luộc trong nước dùng xương có gừng và hành cho chín tới, sau đó ngâm ngay vào nước đá để da căng và giòn. Bước cuối chiên ngập dầu ở 190°C cho đến khi da vàng giòn đều." } },
        { type: "header", data: { text: "Muối tiêu chanh — nước chấm không thể thiếu", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["2 thìa muối hột rang khô cho dậy mùi", "1 thìa tiêu xay thô", "1/2 thìa đường", "Trộn đều, khi ăn vắt chanh tươi vào", "Có thể thêm ớt tươi thái lát"] } },
      ]},
    },
    {
      title: "Bí Quyết Chọn Gà Ngon Cho Món Quay — Gà Ta Hay Gà Công Nghiệp?",
      image: { url: "https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=800&q=80", alt: "Chọn Gà Ngon" },
      cats: ["ga-quay", "meo-nau-an"],
      content: { time: now, blocks: [
        { type: "paragraph", data: { text: "Câu hỏi thường gặp nhất khi làm gà quay: dùng gà ta hay gà công nghiệp? Câu trả lời không đơn giản — mỗi loại có ưu nhược điểm riêng và phù hợp với từng công thức khác nhau." } },
        { type: "header", data: { text: "Gà ta (gà đồi, gà thả vườn)", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Thịt chắc, dai vừa, vị ngọt tự nhiên đậm hơn", "Da mỏng, giòn đẹp khi quay — lý tưởng cho gà quay da giòn", "Mỡ ít, thịt không bị ngấy dù ăn nhiều", "Nhược điểm: giá cao hơn, khó mua gà đồng đều kích cỡ"] } },
        { type: "header", data: { text: "Gà công nghiệp (gà thịt, gà tam hoàng)", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Thịt mềm, nhiều nước, ít dai hơn", "Da dày hơn — cần thêm kỹ thuật để đạt độ giòn", "Kích cỡ đồng đều, dễ mua số lượng lớn", "Phù hợp cho công thức ướp đậm như gà quay mật ong"] } },
        { type: "header", data: { text: "Cách nhận biết gà ta tươi ngoài chợ", level: 2 } },
        { type: "paragraph", data: { text: "Gà ta tươi có da màu vàng nhạt tự nhiên, thịt ức nhỏ so với thân gà, chân nhỏ và có vảy rõ. Khi ấn vào thịt đàn hồi ngay. Gà thả vườn thật sự thường có da đôi chỗ hơi xanh — đó là dấu hiệu tốt, không phải xấu." } },
      ]},
    },
    {
      title: "Vịt Quay Chao — Đặc Sản Miền Nam Thơm Béo Khó Quên",
      image: { url: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800&q=80", alt: "Vịt Quay Chao" },
      cats: ["vit-quay", "mon-quay"],
      content: { time: now, blocks: [
        { type: "paragraph", data: { text: "Vịt quay chao là một biến tấu độc đáo của miền Nam Việt Nam, dùng chao (đậu hũ lên men) thay cho ngũ vị hương truyền thống. Vị béo thơm đặc trưng của chao thấm vào thịt vịt tạo nên hương vị khó tìm thấy ở bất kỳ đâu." } },
        { type: "header", data: { text: "Chao — nguyên liệu đặc biệt tạo nên sự khác biệt", level: 2 } },
        { type: "paragraph", data: { text: "Chao là đậu hũ được ủ với muối và rượu trong nhiều tuần, tạo ra vị béo mặn đặc trưng. Khi ướp vịt, chao tan vào thịt tạo lớp màu vàng nâu đẹp và mùi thơm béo ngậy không lẫn vào đâu được. Nên dùng chao đỏ (chao Nam Bộ) để có màu đẹp hơn chao trắng." } },
        { type: "header", data: { text: "Công thức ướp vịt quay chao", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["3–4 miếng chao đỏ nghiền nát", "2 thìa nước tương", "1 thìa mật ong", "1 thìa ngũ vị hương", "Tỏi gừng sả băm nhuyễn", "1 thìa đường, muối, tiêu"] } },
        { type: "header", data: { text: "Ăn kèm gì ngon nhất?", level: 2 } },
        { type: "paragraph", data: { text: "Vịt quay chao ngon nhất khi ăn với bánh mì hoặc bún tươi, kèm dưa leo, rau thơm và nước tương gừng. Một số quán ở miền Tây còn phục vụ kèm dưa cải muối chua — vị chua của dưa cân bằng hoàn hảo với độ béo của chao." } },
      ]},
    },
    {
      title: "Vịt Quay Quảng Đông — Cách Làm Chuẩn Vị Nhà Hàng Tại Nhà",
      image: { url: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800&q=80", alt: "Vịt Quay Quảng Đông" },
      cats: ["vit-quay", "cong-thuc"],
      content: { time: now, blocks: [
        { type: "paragraph", data: { text: "Vịt quay Quảng Đông khác với vịt quay Bắc Kinh ở chỗ thịt được ướp gia vị nhiều hơn, da không cần mỏng như giấy nhưng vẫn đạt độ giòn và màu đỏ nâu bóng đặc trưng. Đây là phong cách phổ biến nhất ở các nhà hàng Hoa tại TP.HCM." } },
        { type: "header", data: { text: "Nhồi gia vị bên trong — bí quyết của nhà hàng", level: 2 } },
        { type: "paragraph", data: { text: "Thay vì chỉ xoa ướp, vịt quay Quảng Đông có bước nhồi gia vị lỏng vào bên trong bụng vịt rồi dùng xiên khâu kín lại. Trong quá trình quay, gia vị lỏng sôi bên trong tạo áp lực, giúp thịt chín từ trong ra ngoài và thấm gia vị đều hơn." } },
        { type: "header", data: { text: "Hỗn hợp gia vị nhồi (cho 1 con vịt 2 kg)", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["3 thìa nước tương đậm", "2 thìa dầu hào", "1 thìa ngũ vị hương", "1 thìa đường phèn", "200ml nước", "Hành tím, tỏi, gừng, sả đập dập"] } },
        { type: "header", data: { text: "Lớp áo ngoài tạo màu và độ giòn", level: 2 } },
        { type: "paragraph", data: { text: "Hỗn hợp phết ngoài da: mạch nha + giấm gạo + nước tương nhạt theo tỷ lệ 2:2:1. Sau khi trụng vịt qua nước sôi, phết ngay khi da còn nóng để hỗn hợp bám đều. Phơi quạt 4–6 tiếng cho da khô hoàn toàn trước khi quay ở 200°C khoảng 50–60 phút." } },
      ]},
    },
    {
      title: "Mẹo Khử Mùi Tanh Của Vịt — Làm Sạch Đúng Cách Trước Khi Quay",
      image: { url: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800&q=80", alt: "Sơ Chế Vịt" },
      cats: ["vit-quay", "meo-nau-an"],
      content: { time: now, blocks: [
        { type: "paragraph", data: { text: "Mùi tanh của vịt là rào cản lớn nhất khiến nhiều người ngại nấu vịt tại nhà. Thực ra, khử mùi vịt không khó nếu biết đúng cách — và đây là bước quan trọng nhất quyết định chất lượng món vịt quay." } },
        { type: "header", data: { text: "Tại sao vịt có mùi tanh?", level: 2 } },
        { type: "paragraph", data: { text: "Vịt có tuyến dầu ở đuôi (tuyến nhờn) tiết ra chất dầu để vịt bơi không bị ướt lông. Đây là nguồn gốc chính của mùi tanh. Ngoài ra, phần mỡ dưới da vịt cũng chứa nhiều axit béo tạo mùi khi gặp nhiệt." } },
        { type: "header", data: { text: "Các bước khử mùi hiệu quả", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Bước 1: Cắt bỏ tuyến nhờn ở đuôi vịt — quan trọng nhất, không được bỏ qua", "Bước 2: Chà xát toàn thân vịt với muối hột và giấm trong 5 phút, rửa sạch", "Bước 3: Chần vịt qua nước sôi có gừng đập dập và sả cây trong 3 phút", "Bước 4: Rửa lại bằng nước lạnh, để ráo", "Bước 5: Xoa gừng tươi bào vào bên trong bụng vịt trước khi ướp"] } },
        { type: "header", data: { text: "Mẹo chọn vịt ít tanh từ đầu", level: 2 } },
        { type: "paragraph", data: { text: "Vịt cỏ (vịt đồng) và vịt xiêm ít tanh hơn vịt bầu nuôi công nghiệp. Vịt trống (vịt đực) ít tanh hơn vịt mái. Vịt khoảng 2 kg là chuẩn nhất — quá già sẽ tanh và dai hơn." } },
      ]},
    },
  ]

  // 6. Insert all posts
  const allPosts = [...heoQuayPosts, ...gaVitPosts]
  for (const p of allPosts) {
    const catIds = p.cats.map(slug => catMap[slug]).filter(Boolean)
    if (catIds.length !== p.cats.length) {
      console.warn("⚠ Missing category for post:", p.title, p.cats)
    }
    const post = await db.post.create({
      data: {
        title: p.title,
        content: p.content,
        published: true,
        image: p.image,
        authorId: AUTHOR,
        categories: { create: catIds.map(catId => ({ categoryId: catId })) },
      },
    })
    console.log("✓", post.title)
  }

  const total = await db.post.count()
  console.log(`\nDone! Tổng posts hiện tại: ${total}`)
}

main().catch(console.error).finally(() => db.$disconnect())
