import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

const AUTHOR = "clgshfksd000008l2h7a3aaaa"
const CATS = {
  monQuay:  "cmqoymb9p0000h9wge6z2q2zv",
  congThuc: "cmqoymbkv0002h9wg2q62wtmu",
  meoNauAn: "cmqoymbsq0004h9wgfzk4398z",
  gaQuay:   "cmqo07n8i0003h98k2da9q3ts",
  vitQuay:  "cmqo07gdb0002h98k5nrfayza",
}
const now = Date.now()

const posts = [
  // ── GÀ QUAY ────────────────────────────────────────────────
  {
    title: "Gà Quay Ngũ Vị — Thơm Lừng Từ Trong Ra Ngoài",
    image: { url: "https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=800&q=80", alt: "Gà Quay Ngũ Vị" },
    cats: [CATS.gaQuay, CATS.congThuc],
    content: { time: now, blocks: [
      { type: "paragraph", data: { text: "Gà quay ngũ vị là công thức kinh điển của ẩm thực Á Đông, kết hợp hoàn hảo giữa hương thơm của ngũ vị hương và vị ngọt tự nhiên của gà ta. Lớp da vàng giòn, thịt mềm thấm đều gia vị — món ăn không bao giờ lỗi thời." } },
      { type: "header", data: { text: "Nguyên liệu cho 1 con gà 1.5–2 kg", level: 2 } },
      { type: "list", data: { style: "unordered", items: ["1 con gà ta khoảng 1.5–2 kg", "1.5 thìa ngũ vị hương", "2 thìa nước tương đậm", "1 thìa dầu hào", "1 thìa mật ong", "1 thìa rượu trắng", "4 tép tỏi + 1 củ gừng nhỏ băm nhuyễn", "1 thìa đường, muối, tiêu"] } },
      { type: "header", data: { text: "Quy trình ướp chuẩn", level: 2 } },
      { type: "paragraph", data: { text: "Trộn tất cả gia vị thành hỗn hợp sệt. Xoa đều vào bên trong bụng gà và nhét phần tỏi gừng còn lại vào trong. Phết đều bên ngoài da, massage nhẹ cho gia vị thấm. Bọc kín và ướp trong tủ lạnh tối thiểu 6 tiếng, tốt nhất là qua đêm 12 tiếng." } },
      { type: "header", data: { text: "Kỹ thuật nướng để da giòn đều", level: 2 } },
      { type: "list", data: { style: "unordered", items: ["Lấy gà ra khỏi tủ lạnh 30 phút trước khi nướng cho về nhiệt độ phòng", "Nướng 210°C trong 20 phút đầu — da phồng và bắt đầu giòn", "Hạ xuống 175°C nướng thêm 30–35 phút cho thịt chín đều bên trong", "Phết thêm mật ong pha nước tương trong 5 phút cuối để da bóng đẹp", "Để nghỉ 10 phút trước khi chặt — thịt giữ nước, không bị khô"] } },
    ]},
  },
  {
    title: "Gà Quay Muối — Công Thức Truyền Thống Người Hoa Tại Sài Gòn",
    image: { url: "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=800&q=80", alt: "Gà Quay Muối" },
    cats: [CATS.gaQuay, CATS.monQuay],
    content: { time: now, blocks: [
      { type: "paragraph", data: { text: "Gà quay muối (白切鸡 biến thể) là món gà không quá cầu kỳ nhưng đòi hỏi kỹ thuật tinh tế. Da vàng ươm, thịt mềm ngọt, chấm muối tiêu chanh — đơn giản mà không kém phần sang trọng trong ẩm thực người Hoa ở Sài Gòn." } },
      { type: "header", data: { text: "Bí quyết da vàng không cần lò nướng", level: 2 } },
      { type: "paragraph", data: { text: "Khác với gà quay thông thường, gà quay muối dùng kỹ thuật luộc rồi ngâm lạnh và chiên giòn. Gà được luộc trong nước dùng xương có gừng và hành cho chín tới, sau đó ngâm ngay vào nước đá để da căng và giòn. Bước cuối chiên ngập dầu ở 190°C cho đến khi da vàng giòn đều." } },
      { type: "header", data: { text: "Muối tiêu chanh — nước chấm không thể thiếu", level: 2 } },
      { type: "list", data: { style: "unordered", items: ["2 thìa muối hột rang khô cho dậy mùi", "1 thìa tiêu xay thô", "1/2 thìa đường", "Trộn đều, khi ăn vắt chanh tươi vào", "Có thể thêm ớt tươi thái lát"] } },
      { type: "header", data: { text: "Cách chặt gà đúng kiểu Hoa", level: 2 } },
      { type: "paragraph", data: { text: "Gà quay muối được chặt theo kiểu Quảng Đông: tách đùi, cánh riêng; ức chặt ngang thành từng miếng dày khoảng 2 cm; bày ra dĩa theo hình con gà. Xếp đẹp mắt, rưới một chút dầu hành lên trên và rắc ngò rí là có dĩa gà nhìn rất hấp dẫn." } },
    ]},
  },
  {
    title: "Bí Quyết Chọn Gà Ngon Cho Món Quay — Gà Ta Hay Gà Công Nghiệp?",
    image: { url: "https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=800&q=80", alt: "Chọn Gà Ngon" },
    cats: [CATS.gaQuay, CATS.meoNauAn],
    content: { time: now, blocks: [
      { type: "paragraph", data: { text: "Câu hỏi thường gặp nhất khi làm gà quay: dùng gà ta hay gà công nghiệp? Câu trả lời không đơn giản — mỗi loại có ưu nhược điểm riêng và phù hợp với từng công thức khác nhau." } },
      { type: "header", data: { text: "Gà ta (gà đồi, gà thả vườn)", level: 2 } },
      { type: "list", data: { style: "unordered", items: ["Thịt chắc, dai vừa, vị ngọt tự nhiên đậm hơn", "Da mỏng, giòn đẹp khi quay — lý tưởng cho gà quay da giòn", "Mỡ ít, thịt không bị ngấy dù ăn nhiều", "Nhược điểm: giá cao hơn, khó mua gà đồng đều kích cỡ"] } },
      { type: "header", data: { text: "Gà công nghiệp (gà thịt, gà tam hoàng)", level: 2 } },
      { type: "list", data: { style: "unordered", items: ["Thịt mềm, nhiều nước, ít dai hơn", "Da dày hơn — cần thêm kỹ thuật để đạt độ giòn", "Kích cỡ đồng đều, dễ mua số lượng lớn", "Phù hợp cho công thức ướp đậm như gà quay mật ong, gà quay lu"] } },
      { type: "header", data: { text: "Khuyến nghị theo từng món", level: 2 } },
      { type: "list", data: { style: "unordered", items: ["Gà quay da giòn kiểu Hoa: dùng gà ta hoặc gà tam hoàng", "Gà quay mật ong: gà công nghiệp cũng ngon, tiết kiệm chi phí", "Gà quay lu: gà ta cho vị thơm ngon hơn hẳn", "Gà quay muối: bắt buộc dùng gà ta — gà công nghiệp thịt nhão không đạt yêu cầu"] } },
      { type: "header", data: { text: "Cách nhận biết gà ta tươi ngoài chợ", level: 2 } },
      { type: "paragraph", data: { text: "Gà ta tươi có da màu vàng nhạt tự nhiên (không quá vàng), thịt ức nhỏ so với thân gà, chân nhỏ và có vảy rõ. Khi ấn vào thịt đàn hồi ngay. Gà thả vườn thật sự thường có da đôi chỗ hơi xanh hoặc không đều màu — đó là dấu hiệu tốt, không phải xấu." } },
    ]},
  },
  // ── VỊT QUAY ───────────────────────────────────────────────
  {
    title: "Vịt Quay Chao — Đặc Sản Miền Nam Thơm Béo Khó Quên",
    image: { url: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800&q=80", alt: "Vịt Quay Chao" },
    cats: [CATS.vitQuay, CATS.monQuay],
    content: { time: now, blocks: [
      { type: "paragraph", data: { text: "Vịt quay chao là một biến tấu độc đáo của miền Nam Việt Nam, dùng chao (đậu hũ lên men) thay cho ngũ vị hương truyền thống. Vị béo thơm đặc trưng của chao thấm vào thịt vịt tạo nên hương vị khó tìm thấy ở bất kỳ đâu." } },
      { type: "header", data: { text: "Chao — nguyên liệu đặc biệt tạo nên sự khác biệt", level: 2 } },
      { type: "paragraph", data: { text: "Chao là đậu hũ được ủ với muối và rượu trong nhiều tuần, tạo ra vị béo mặn đặc trưng. Khi ướp vịt, chao tan vào thịt tạo lớp màu vàng nâu đẹp và mùi thơm béo ngậy không lẫn vào đâu được. Nên dùng chao đỏ (chao Nam Bộ) để có màu đẹp hơn chao trắng." } },
      { type: "header", data: { text: "Công thức ướp vịt quay chao", level: 2 } },
      { type: "list", data: { style: "unordered", items: ["3–4 miếng chao đỏ nghiền nát", "2 thìa nước tương", "1 thìa mật ong", "1 thìa ngũ vị hương", "Tỏi gừng sả băm nhuyễn", "1 thìa đường, muối, tiêu"] } },
      { type: "paragraph", data: { text: "Trộn đều, xoa kỹ vào trong và ngoài vịt. Ướp tối thiểu 8 tiếng trong tủ lạnh. Trước khi quay, trụng vịt qua nước sôi và phết hỗn hợp mật ong giấm lên da, phơi trong tủ lạnh thêm 2 tiếng cho da khô." } },
      { type: "header", data: { text: "Ăn kèm gì ngon nhất?", level: 2 } },
      { type: "paragraph", data: { text: "Vịt quay chao ngon nhất khi ăn với bánh mì hoặc bún tươi, kèm dưa leo, rau thơm và nước tương gừng. Một số quán ở miền Tây còn phục vụ kèm dưa cải muối chua — vị chua của dưa cân bằng hoàn hảo với độ béo của chao." } },
    ]},
  },
  {
    title: "Vịt Quay Quảng Đông — Cách Làm Chuẩn Vị Nhà Hàng Tại Nhà",
    image: { url: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800&q=80", alt: "Vịt Quay Quảng Đông" },
    cats: [CATS.vitQuay, CATS.congThuc],
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
    cats: [CATS.vitQuay, CATS.meoNauAn],
    content: { time: now, blocks: [
      { type: "paragraph", data: { text: "Mùi tanh của vịt là rào cản lớn nhất khiến nhiều người ngại nấu vịt tại nhà. Thực ra, khử mùi vịt không khó nếu biết đúng cách — và đây là bước quan trọng nhất quyết định chất lượng món vịt quay." } },
      { type: "header", data: { text: "Tại sao vịt có mùi tanh?", level: 2 } },
      { type: "paragraph", data: { text: "Vịt có tuyến dầu ở đuôi (tuyến nhờn) tiết ra chất dầu để vịt bơi không bị ướt lông. Đây là nguồn gốc chính của mùi tanh. Ngoài ra, phần mỡ dưới da vịt cũng chứa nhiều axit béo tạo mùi khi gặp nhiệt." } },
      { type: "header", data: { text: "Các bước khử mùi hiệu quả", level: 2 } },
      { type: "list", data: { style: "unordered", items: ["Bước 1: Cắt bỏ tuyến nhờn ở đuôi vịt — quan trọng nhất, không được bỏ qua", "Bước 2: Chà xát toàn thân vịt với muối hột và giấm trong 5 phút, rửa sạch", "Bước 3: Chần vịt qua nước sôi có gừng đập dập và sả cây trong 3 phút", "Bước 4: Rửa lại bằng nước lạnh, để ráo", "Bước 5: Xoa gừng tươi bào vào bên trong bụng vịt trước khi ướp"] } },
      { type: "header", data: { text: "Mẹo chọn vịt ít tanh từ đầu", level: 2 } },
      { type: "paragraph", data: { text: "Vịt cỏ (vịt đồng) và vịt xiêm ít tanh hơn vịt bầu nuôi công nghiệp. Vịt trống (vịt đực) ít tanh hơn vịt mái. Vịt khoảng 2 kg là chuẩn nhất — quá già sẽ tanh và dai hơn." } },
      { type: "header", data: { text: "Gia vị áp đảo mùi tanh trong khi quay", level: 2 } },
      { type: "paragraph", data: { text: "Ngũ vị hương, húng lìu, sả và gừng không chỉ tạo hương thơm mà còn giúp át mùi tanh còn sót lại trong quá trình quay. Ướp càng lâu thì gia vị thấm càng sâu, mùi tanh càng giảm." } },
    ]},
  },
]

async function main() {
  for (const p of posts) {
    const post = await db.post.create({
      data: {
        title: p.title,
        content: p.content,
        published: true,
        image: p.image,
        authorId: AUTHOR,
        categories: { create: p.cats.map(catId => ({ categoryId: catId })) },
      },
    })
    console.log("✓", post.title)
  }
  console.log("\nDone!")
}

main().catch(console.error).finally(() => db.$disconnect())
