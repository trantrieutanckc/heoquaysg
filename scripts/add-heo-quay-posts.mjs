import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

const AUTHOR = "clgshfksd000008l2h7a3aaaa"
const CATS = {
  monQuay:  "cmqoymb9p0000h9wge6z2q2zv",
  congThuc: "cmqoymbkv0002h9wg2q62wtmu",
  meoNauAn: "cmqoymbsq0004h9wgfzk4398z",
  heoQuay:  "cmqo078ob0001h98kx7r3e5e5",
}
const now = Date.now()

const posts = [
  {
    title: "Heo Quay Sữa — Da Mỏng Giòn Tan, Thịt Mềm Ngọt Đặc Trưng",
    image: { url: "https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?w=800&q=80", alt: "Heo Quay Sữa" },
    cats: [CATS.heoQuay, CATS.monQuay],
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
    cats: [CATS.heoQuay, CATS.monQuay],
    content: { time: now, blocks: [
      { type: "paragraph", data: { text: "Trong ẩm thực Quảng Đông, có hai món heo quay nổi tiếng thế giới: Char Siu và Siu Yuk. Nhiều người nhầm lẫn hai món này, nhưng thực chất chúng hoàn toàn khác nhau về nguyên liệu, kỹ thuật và hương vị." } },
      { type: "header", data: { text: "Char Siu — thịt heo xá xíu đỏ ngọt", level: 2 } },
      { type: "paragraph", data: { text: "Char Siu dùng thịt heo thăn hoặc ba chỉ, ướp với hỗn hợp đặc trưng gồm mật ong, tương hoisin, nước tương, rượu Shaoxing. Thịt được xiên que và quay trong lò đến khi có màu đỏ nâu bóng đẹp, vị ngọt đậm đà." } },
      { type: "header", data: { text: "Siu Yuk — heo quay da giòn nguyên con", level: 2 } },
      { type: "paragraph", data: { text: "Siu Yuk là heo quay nguyên con hoặc nguyên mảng, tập trung vào lớp da giòn rụm bên ngoài. Thịt ướp gia vị nhẹ hơn Char Siu, phần da được xử lý kỹ bằng cách châm lỗ và phơi khô để đạt độ giòn tối đa. Đây là món người Việt thường gọi là heo quay." } },
      { type: "header", data: { text: "So sánh nhanh", level: 2 } },
      { type: "list", data: { style: "unordered", items: ["Char Siu: thịt cắt miếng, màu đỏ ngọt, ăn với cơm trắng hoặc bún", "Siu Yuk: nguyên con hoặc mảng, da vàng giòn, dùng trong tiệc và lễ cúng", "Char Siu phổ biến ở dim sum; Siu Yuk phổ biến trong tiệc tùng"] } },
      { type: "header", data: { text: "Cách làm Char Siu tại nhà", level: 2 } },
      { type: "paragraph", data: { text: "Ướp 500g thịt ba chỉ với: 2 thìa tương hoisin + 1 thìa mật ong + 1 thìa nước tương + 1/2 thìa ngũ vị hương + 1 thìa rượu trắng + 1 thìa đường. Ướp 4 tiếng. Nướng 200°C trong 25 phút, lật và phết thêm mật ong, nướng thêm 10 phút cho bóng đẹp." } },
    ]},
  },
  {
    title: "Mẹo Bảo Quản Heo Quay — Giữ Da Giòn Qua Đêm Không Bị Mềm",
    image: { url: "https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?w=800&q=80", alt: "Bảo Quản Heo Quay" },
    cats: [CATS.meoNauAn, CATS.heoQuay],
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
    cats: [CATS.heoQuay, CATS.monQuay],
    content: { time: now, blocks: [
      { type: "paragraph", data: { text: "Heo quay miền Tây Nam Bộ có những nét đặc trưng riêng, khác biệt so với heo quay Sài Gòn hay phong cách Quảng Đông. Sự khác biệt đến từ nguyên liệu địa phương, kỹ thuật quay trên than củi và cách thưởng thức dân dã." } },
      { type: "header", data: { text: "Gia vị đặc trưng miền Tây", level: 2 } },
      { type: "paragraph", data: { text: "Heo quay miền Tây thường dùng sả và gừng nhiều hơn trong hỗn hợp ướp, tạo mùi thơm đặc trưng. Một số nơi còn thêm lá chanh và nghệ tươi để tạo màu vàng tự nhiên và hương thơm khác biệt so với ngũ vị hương truyền thống." } },
      { type: "header", data: { text: "Kỹ thuật quay trên than củi lộ thiên", level: 2 } },
      { type: "paragraph", data: { text: "Thay vì lò quay công nghiệp, heo quay miền Tây thường được quay trên bếp than củi ngoài trời. Hơi nhiệt lan tỏa tự nhiên, kết hợp với khói củi tạo nên mùi thơm mà lò hiện đại không thể tái tạo được — đây là lý do heo quay dọc đường ở miền Tây thường ngon hơn nhà hàng." } },
      { type: "header", data: { text: "Cách ăn kèm đặc trưng", level: 2 } },
      { type: "list", data: { style: "unordered", items: ["Ăn với bánh mì — phổ biến nhất, cắt miếng to kẹp bánh mì nóng", "Cuốn bánh tráng — thêm dưa leo, rau thơm, bún tươi bên trong", "Chấm nước tương gừng — đơn giản nhưng đậm vị", "Ăn kèm dưa cải muối chua — cắt béo, giải ngán"] } },
      { type: "header", data: { text: "Điểm giống và khác với heo quay Sài Gòn", level: 2 } },
      { type: "paragraph", data: { text: "Cả hai đều hướng đến lớp da giòn rụm — tiêu chí không thể thỏa hiệp. Heo quay Sài Gòn thiên về ngũ vị hương đậm đà kiểu Hoa kiều, trong khi miền Tây thiên về sả gừng tươi và khói than tự nhiên." } },
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
