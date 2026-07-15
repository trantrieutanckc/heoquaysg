const { PrismaClient } = require("@prisma/client")
const db = new PrismaClient()
const AUTHOR = "cmrlnetjs0000h9ri0mx0cwfp"
const now = Date.now()

async function main() {
  const cats = await db.category.findMany({ select: { id: true, slug: true } })
  const C = Object.fromEntries(cats.map(c => [c.slug, c.id]))

  const posts = [
    // ── HEO QUAY ─────────────────────────────────────────────────
    {
      title: "Heo Quay Da Giòn Đặt Tiệc Tại Nhà — Đặt Bao Nhiêu Là Đủ?",
      image: { url: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=1200&q=85", alt: "Heo Quay Tiệc Tại Nhà" },
      cats: ["heo-quay", "mon-quay"],
      content: { time: now, blocks: [
        { type: "paragraph", data: { text: "Câu hỏi phổ biến nhất khi đặt heo quay cho tiệc: cần bao nhiêu kg cho bao nhiêu người? Tính sai sẽ không đủ ăn hoặc lãng phí. Bài viết này giúp bạn tính đúng ngay từ đầu." } },
        { type: "header", data: { text: "Tỷ lệ tính chuẩn", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Bữa chính, ăn no: 300–350g heo sống / người", "Bữa tiệc có nhiều món phụ: 200–250g / người", "Tiệc cúng (có xôi, canh, rau): 150–200g / người", "Trẻ em dưới 10 tuổi tính bằng nửa người lớn"] } },
        { type: "header", data: { text: "Ví dụ cụ thể", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["20 người ăn bữa chính: đặt 6–7 kg heo quay", "30 người tiệc có nhiều món: đặt 7–8 kg", "50 người tiệc cưới đủ món: đặt 10–12 kg (2 con)", "100 người: đặt 4–5 con heo, mỗi con 5–6 kg"] } },
        { type: "header", data: { text: "Nên đặt trước bao lâu?", level: 2 } },
        { type: "paragraph", data: { text: "Tiệc nhỏ dưới 30 người: đặt trước 1 ngày. Tiệc 30–100 người: đặt trước 2–3 ngày. Tiệc cưới hoặc sự kiện lớn: đặt trước 1 tuần để đảm bảo có hàng đúng ngày. Liên hệ Heo Quay Bình Tân: 0987 054 231." } },
        { type: "header", data: { text: "Mẹo nhận hàng đúng chuẩn", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Nhận hàng 1–2 tiếng trước khi tiệc bắt đầu", "Không để heo quay trong hộp kín khi còn nóng — da sẽ mềm", "Chặt ra ngay khi khách bắt đầu ăn", "Phần da nên ăn trong vòng 1 tiếng đầu"] } },
      ]},
    },
    {
      title: "Bí Quyết Châm Lỗ Da Heo Trước Khi Quay — Bước Quan Trọng Nhất",
      image: { url: "https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&q=85", alt: "Châm Lỗ Da Heo Quay" },
      cats: ["heo-quay", "cong-thuc"],
      content: { time: now, blocks: [
        { type: "paragraph", data: { text: "Trong tất cả các bước làm heo quay, châm lỗ da là bước nhiều người bỏ qua hoặc làm sai nhất. Đây chính là lý do da heo không giòn dù đã quay đúng nhiệt độ và thời gian." } },
        { type: "header", data: { text: "Tại sao phải châm lỗ?", level: 2 } },
        { type: "paragraph", data: { text: "Khi quay ở nhiệt độ cao, mỡ dưới da tan chảy và cần thoát ra ngoài. Nếu da không có lỗ, mỡ bị giữ lại bên dưới làm da phồng không đều, có chỗ cứng chỗ mềm. Các lỗ nhỏ cho phép mỡ thoát ra, hơi nước bay đi, tạo lớp da giòn đều khắp." } },
        { type: "header", data: { text: "Dụng cụ châm lỗ", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Kim châm chuyên dụng (nhiều mũi) — nhanh và đều nhất", "Nĩa inox — dùng được nhưng chậm và lỗ to", "Kim khâu hoặc tăm nhọn — cho lỗ nhỏ nhất, phù hợp heo sữa", "Không dùng vật sắc quá to — lỗ lớn làm da bị rách khi phồng"] } },
        { type: "header", data: { text: "Kỹ thuật châm đúng cách", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Châm vuông góc với mặt da, không xiên — tránh xé da", "Mật độ: khoảng 20–30 lỗ trên mỗi 100cm² da", "Châm đều khắp, chú ý vùng dày như vai và mông nhiều hơn", "Không châm sâu quá 2–3mm — chỉ cần xuyên qua da, không vào thịt", "Sau khi châm, xoa muối trắng lên toàn bộ da để rút ẩm"] } },
        { type: "header", data: { text: "Sai lầm thường gặp", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Châm quá ít lỗ — mỡ không thoát được, da bị phồng to không giòn", "Châm quá sâu vào thịt — thịt mất nước, bị khô khi quay", "Không phơi da sau khi châm — da còn ẩm, quay ra không giòn", "Dùng dầu thoa lên da trước khi quay — làm da mềm thay vì giòn"] } },
      ]},
    },
    {
      title: "Heo Quay Cả Con — Từ Chọn Heo Đến Khi Lên Mâm",
      image: { url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=85", alt: "Heo Quay Cả Con" },
      cats: ["heo-quay", "cong-thuc"],
      content: { time: now, blocks: [
        { type: "paragraph", data: { text: "Quay heo cả con là kỹ thuật đòi hỏi kinh nghiệm, nhưng nếu nắm đúng từng bước thì hoàn toàn có thể thực hiện được. Bài viết này tổng hợp toàn bộ quy trình từ A đến Z." } },
        { type: "header", data: { text: "Chọn heo", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Heo 15–20 kg là kích cỡ lý tưởng cho quay cả con", "Da trắng hồng, không bầm, lông đã cạo sạch", "Heo đã mổ sạch, bỏ nội tạng, rửa kỹ bên trong", "Mua từ lò mổ uy tín, có kiểm dịch"] } },
        { type: "header", data: { text: "Ướp gia vị", level: 2 } },
        { type: "paragraph", data: { text: "Hỗn hợp ướp bên trong (cho heo 15–20 kg): 100g muối + 50g đường + 30g ngũ vị hương + 20g bột tỏi + 20g bột gừng + 100ml rượu trắng. Trộn đều, xoa kỹ vào toàn bộ bên trong bụng heo. Ướp tối thiểu 6 tiếng, tốt nhất 12 tiếng." } },
        { type: "header", data: { text: "Xử lý da trước khi quay", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Châm lỗ toàn bộ da bằng kim chuyên dụng", "Xoa hỗn hợp giấm trắng + muối lên da, để 15 phút", "Rửa sạch, lau khô bằng khăn sạch", "Phơi ngoài không khí tối thiểu 2 tiếng, tốt nhất qua đêm trong tủ lạnh không che"] } },
        { type: "header", data: { text: "Quy trình quay", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Nhiệt độ ban đầu 200–220°C trong 30 phút để da phồng", "Hạ xuống 170–180°C quay tiếp 60–90 phút tùy trọng lượng", "Phết hỗn hợp mật ong + nước tương trong 15 phút cuối", "Tổng thời gian: khoảng 2–2.5 tiếng cho heo 15–20 kg", "Kiểm tra bằng cách xiên vào phần dày nhất — không có nước hồng chảy ra là chín"] } },
      ]},
    },

    // ── GÀ QUAY ──────────────────────────────────────────────────
    {
      title: "Gà Quay Lu — Món Ăn Hoài Cổ Của Người Hoa Chợ Lớn",
      image: { url: "https://images.unsplash.com/photo-1598103442097-8b74394b95c2?w=1200&q=85", alt: "Gà Quay Lu Chợ Lớn" },
      cats: ["ga-quay", "mon-quay"],
      content: { time: now, blocks: [
        { type: "paragraph", data: { text: "Gà quay lu là món ăn gắn liền với ký ức của nhiều thế hệ người Hoa ở Chợ Lớn, Sài Gòn. Được quay trong chiếc lu đất nung theo kỹ thuật truyền thống hàng trăm năm tuổi, gà quay lu có hương vị và độ giòn hoàn toàn khác biệt so với bất kỳ phương pháp nào khác." } },
        { type: "header", data: { text: "Lu đất — linh hồn của món ăn", level: 2 } },
        { type: "paragraph", data: { text: "Lu dùng để quay gà là lu đất nung dày, giữ nhiệt cực tốt. Trước khi quay, lu được nung bằng than hoa từ 30–45 phút. Nhiệt từ thành lu tỏa ra đều từ mọi phía, tạo lớp da giòn đồng đều mà lò nướng điện không thể làm được." } },
        { type: "header", data: { text: "Ướp gà đúng cách cho quay lu", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["2 thìa ngũ vị hương", "3 thìa nước tương đậm", "1 thìa dầu hào", "1 thìa đường phèn tán nhỏ", "1 thìa mật ong", "Tỏi gừng sả băm nhuyễn", "Ướp tối thiểu 8 tiếng — tốt nhất 24 tiếng"] } },
        { type: "header", data: { text: "Bí quyết da giòn của lò lu", level: 2 } },
        { type: "paragraph", data: { text: "Sau khi ướp, gà được treo trong lu bằng móc sắt, không tiếp xúc trực tiếp với lửa. Nhiệt bức xạ từ thành lu làm chín gà từ từ trong khoảng 35–45 phút. Gần xong, thợ quay sẽ phết thêm mật ong lên da và đưa gà lại gần lửa than 5 phút để da bóng vàng đẹp." } },
        { type: "header", data: { text: "Ăn gà quay lu đúng điệu", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Chặt theo kiểu Quảng Đông: tách đùi, cánh, ức thành miếng vuông", "Nước chấm truyền thống: xì dầu ngọt pha gừng bào", "Ăn kèm cơm trắng hoặc bún tươi", "Rau ăn kèm: dưa leo, ngò rí, hành phi"] } },
      ]},
    },
    {
      title: "Gà Quay Mật Ong Tỏi Ớt — Da Giòn Ngọt Cay Khó Cưỡng",
      image: { url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&q=85", alt: "Gà Quay Mật Ong Tỏi Ớt" },
      cats: ["ga-quay", "cong-thuc"],
      content: { time: now, blocks: [
        { type: "paragraph", data: { text: "Biến tấu từ gà quay mật ong cổ điển, phiên bản tỏi ớt thêm vào một chiều hương vị mới: ngọt thanh của mật ong, cay nồng của ớt, thơm nức của tỏi phi vàng. Đây là công thức được nhiều gia đình trẻ ưa chuộng nhất hiện nay." } },
        { type: "header", data: { text: "Nguyên liệu ướp", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["3 thìa mật ong", "2 thìa nước tương", "1 thìa dầu hào", "1 thìa tương ớt Sriracha (hoặc ớt bột Hàn Quốc)", "6 tép tỏi băm nhuyễn", "2 thìa dầu mè", "1 thìa đường nâu", "Muối tiêu vừa đủ"] } },
        { type: "header", data: { text: "Kỹ thuật phết mật ong nhiều lần", level: 2 } },
        { type: "paragraph", data: { text: "Bí quyết tạo lớp da bóng đẹp của công thức này là phết mật ong ít nhất 3 lần trong quá trình quay. Lần 1 khi bắt đầu quay. Lần 2 sau 20 phút. Lần 3 trong 5 phút cuối cùng với lửa cao. Mỗi lần phết, lật gà để mặt kia tiếp lửa. Kết quả là lớp áo mật ong caramel hóa đẹp, giòn và thơm." } },
        { type: "header", data: { text: "Lưu ý khi dùng tỏi ớt", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Ướp tỏi sống vào thịt — tỏi thấm sâu tạo hương thơm", "Khi quay, tỏi trên da dễ cháy — dùng giấy bạc che phần tỏi nếu thấy quá đen", "Ớt bột Hàn Quốc cho màu đỏ đẹp và ít cay hơn ớt Việt", "Sau khi ra lò, rắc thêm tỏi phi vàng để tăng mùi thơm"] } },
      ]},
    },
    {
      title: "Cách Chặt Gà Quay Đúng Kiểu — Đẹp Mắt và Không Mất Da",
      image: { url: "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=1200&q=85", alt: "Chặt Gà Quay Đúng Cách" },
      cats: ["ga-quay", "meo-nau-an"],
      content: { time: now, blocks: [
        { type: "paragraph", data: { text: "Chặt gà quay tưởng đơn giản nhưng làm sai sẽ làm da bị bong, thịt vỡ không đẹp. Chặt đúng kỹ thuật giúp dĩa gà trình bày được, da giữ nguyên vẹn và thịt không bị khô." } },
        { type: "header", data: { text: "Dụng cụ cần thiết", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Dao chặt nặng, sắc — lưỡi dao phải đủ nặng để chặt qua xương một nhát", "Thớt gỗ dày tối thiểu 5cm — không dùng thớt nhựa mỏng, dao dễ trượt", "Khăn sạch lót dưới thớt để không trượt"] } },
        { type: "header", data: { text: "Thứ tự chặt gà đúng cách", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Bước 1: Để gà nghỉ 5–10 phút sau khi ra lò trước khi chặt", "Bước 2: Tách 2 đùi — dùng dao rạch da nơi đùi nối thân, bẻ nhẹ ra ngoài rồi cắt", "Bước 3: Tách 2 cánh — rạch tại khớp vai, bẻ ngược và cắt", "Bước 4: Tách đầu cổ riêng", "Bước 5: Chặt ức thành miếng ngang dày 2–3cm", "Bước 6: Chặt lưng thành 3–4 miếng", "Bước 7: Chặt đùi và cánh thành miếng vừa ăn"] } },
        { type: "header", data: { text: "Mẹo giữ da không bị bong", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Chặt dứt khoát một nhát, không cưa tới lui — da sẽ bong", "Chặt vuông góc với thớt, không chặt xiên", "Không dùng dao sắc quá mỏng — lưỡi dao mỏng dễ bị kẹt xương làm xé da", "Bày ra dĩa ngay sau khi chặt xong, đừng để lâu"] } },
      ]},
    },

    // ── VỊT QUAY ─────────────────────────────────────────────────
    {
      title: "Vịt Quay Bắc Kinh Tại Nhà — Có Thể Làm Không?",
      image: { url: "https://images.unsplash.com/photo-1609107028023-43f0e83ee32a?w=1200&q=85", alt: "Vịt Quay Bắc Kinh" },
      cats: ["vit-quay", "cong-thuc"],
      content: { time: now, blocks: [
        { type: "paragraph", data: { text: "Vịt quay Bắc Kinh (Peking Duck) là một trong những món nổi tiếng nhất thế giới, thường chỉ thấy ở nhà hàng cao cấp. Nhưng với lò nướng gia đình hiện đại, bạn hoàn toàn có thể làm được phiên bản gần chuẩn — không cần lò đặc biệt." } },
        { type: "header", data: { text: "Điều làm Vịt Quay Bắc Kinh khác biệt", level: 2 } },
        { type: "paragraph", data: { text: "Bí quyết của Peking Duck không phải ở gia vị mà ở kỹ thuật tạo da giòn mỏng như giấy. Da vịt được bơm hơi để tách khỏi thịt, sau đó phết hỗn hợp mạch nha và phơi khô trong phòng lạnh ít nhất 24 tiếng. Quá trình này loại bỏ hoàn toàn độ ẩm khỏi da, tạo ra lớp da giòn cực mỏng khi quay." } },
        { type: "header", data: { text: "Phiên bản rút gọn tại nhà", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Chần vịt qua nước sôi 2 phút để da căng", "Phết hỗn hợp mạch nha + giấm gạo (tỷ lệ 2:1) lên toàn da khi còn nóng", "Treo trong tủ lạnh không che 24–48 tiếng (quan trọng nhất)", "Quay 220°C trong 15 phút, hạ 180°C quay tiếp 40 phút", "Lật vịt giữa chừng để chín đều"] } },
        { type: "header", data: { text: "Cách ăn đúng điệu Bắc Kinh", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Cắt da thành miếng nhỏ 3x5cm, ăn da riêng trước", "Cuốn bánh mì chiên mỏng (bánh bao chiên) với da vịt + dưa leo + hành lá", "Chấm tương hoisin", "Thịt vịt nấu cháo hoặc xào với giá đỗ — dùng tiếp sau khi ăn da"] } },
      ]},
    },
    {
      title: "Vịt Quay Ngũ Vị — Chuẩn Vị Người Hoa Không Cần Ra Quán",
      image: { url: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=1200&q=85", alt: "Vịt Quay Ngũ Vị Hương" },
      cats: ["vit-quay", "cong-thuc"],
      content: { time: now, blocks: [
        { type: "paragraph", data: { text: "Vịt quay ngũ vị là công thức phổ biến nhất trong cộng đồng người Hoa tại TP.HCM. Không cần lò quay chuyên dụng, chỉ cần lò nướng gia đình và đúng kỹ thuật là có thể làm ra con vịt quay vàng giòn thơm lừng." } },
        { type: "header", data: { text: "Nguyên liệu ướp (cho vịt 2 kg)", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["2 thìa ngũ vị hương", "3 thìa nước tương đậm", "2 thìa dầu hào", "1 thìa đường phèn tán nhỏ", "1 thìa rượu Shaoxing hoặc rượu trắng", "5 tép tỏi + 2 lát gừng + 1 cây sả băm nhuyễn", "1 thìa muối"] } },
        { type: "header", data: { text: "Ướp đúng cách cho vịt thấm đều", level: 2 } },
        { type: "paragraph", data: { text: "Nhồi 2/3 hỗn hợp gia vị vào bên trong bụng vịt, xoa đều. Phần còn lại xoa ngoài da. Dùng tăm khâu miệng bụng vịt lại để gia vị không chảy ra khi quay. Bọc kín, ướp trong tủ lạnh tối thiểu 8 tiếng." } },
        { type: "header", data: { text: "Lớp áo ngoài da — tạo màu và giòn", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Hỗn hợp phết: mạch nha 2 thìa + giấm gạo 2 thìa + nước tương 1 thìa", "Chần vịt qua nước sôi 2 phút, phết hỗn hợp ngay khi da còn nóng", "Phơi khô trong tủ lạnh 12–24 tiếng", "Quay 200°C / 60–70 phút, phết thêm mật ong trong 10 phút cuối"] } },
      ]},
    },
    {
      title: "Vịt Quay Kèm Bún — Cách Làm Tô Bún Vịt Thơm Ngon Tại Nhà",
      image: { url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=85", alt: "Bún Vịt Quay" },
      cats: ["vit-quay", "mon-quay"],
      content: { time: now, blocks: [
        { type: "paragraph", data: { text: "Vịt quay ăn với bún là một trong những cách thưởng thức phổ biến nhất — nước dùng từ xương vịt quay ngọt thanh, bún trắng mềm, thịt vịt giòn da là sự kết hợp hoàn hảo." } },
        { type: "header", data: { text: "Nước dùng từ xương vịt quay", level: 2 } },
        { type: "paragraph", data: { text: "Sau khi lấy hết phần thịt và da ngon nhất, phần xương vịt quay là nguyên liệu tuyệt vời để nấu nước dùng. Cho xương vào nồi, thêm gừng đập dập, sả cây, hành tím nướng, đổ 2 lít nước, nấu sôi rồi hạ lửa hầm 1 tiếng. Nêm muối, đường, nước mắm vừa ăn." } },
        { type: "header", data: { text: "Topping và rau ăn kèm", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Thịt vịt quay thái miếng, da còn giòn", "Cải xanh trụng qua nước sôi", "Hành lá, ngò rí thái nhỏ", "Gừng bào sợi", "Chanh, ớt tươi", "Tương hoisin và tương ớt để chấm"] } },
        { type: "header", data: { text: "Cách trình bày tô bún đẹp", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Trụng bún qua nước sôi, cho vào tô", "Xếp thịt vịt lên trên — da phải hướng lên để giữ giòn", "Chan nước dùng nóng vào tô (không đổ lên da)", "Rắc hành ngò, gừng bào lên trên", "Dọn ngay — để lâu da sẽ mềm"] } },
      ]},
    },

    // ── HEO SỮA ──────────────────────────────────────────────────
    {
      title: "Giá Heo Sữa Quay Bao Nhiêu? Bảng Giá và Cách Tính Chi Phí",
      image: { url: "https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?w=1200&q=85", alt: "Giá Heo Sữa Quay" },
      cats: ["heo-sua", "mon-quay"],
      content: { time: now, blocks: [
        { type: "paragraph", data: { text: "Heo sữa quay là món cao cấp, giá cũng cao hơn heo lớn. Bài viết này giúp bạn hiểu rõ cấu trúc giá để tránh bị hét giá hoặc mua phải hàng kém chất lượng với giá rẻ." } },
        { type: "header", data: { text: "Cấu trúc giá heo sữa quay", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Giá heo sống: 250.000–350.000đ/kg (heo sữa đúng chuẩn)", "Chi phí quay (than, nhân công, lu hoặc lò): 100.000–150.000đ/kg", "Tổng giá thành cơ bản: 350.000–500.000đ/kg heo thành phẩm", "Tỷ lệ hao hụt khi quay: 30–35% (heo 5kg sau quay còn 3.2–3.5kg)"] } },
        { type: "header", data: { text: "Giá thị trường tham khảo (2024)", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Heo sữa quay 3–4 kg: 1.200.000–1.600.000đ/con", "Heo sữa quay 4–5 kg: 1.600.000–2.200.000đ/con", "Heo sữa quay 5–6 kg: 2.200.000–2.800.000đ/con", "Heo sữa quay lu (kỹ thuật truyền thống): cộng thêm 20–30%"] } },
        { type: "header", data: { text: "Dấu hiệu bán giá rẻ bất thường", level: 2 } },
        { type: "paragraph", data: { text: "Heo sữa quay nguyên con 5kg mà giá dưới 1.500.000đ thì nên xem xét lại. Giá quá rẻ thường đến từ: dùng heo cai sữa giả sữa, heo không rõ nguồn gốc, da được tô màu nhân tạo, hoặc heo quay từ hôm trước hâm lại. Chọn nơi uy tín, nhận hàng trong ngày để đảm bảo chất lượng." } },
        { type: "header", data: { text: "Đặt heo sữa tại Heo Quay Bình Tân", level: 2 } },
        { type: "paragraph", data: { text: "Liên hệ 0987 054 231 để được tư vấn kích cỡ và báo giá chính xác. Chúng tôi quay heo sữa theo đơn đặt hàng, không có hàng tồn, đảm bảo tươi trong ngày. Giao hàng tận nơi trong khu vực Bình Tân và các quận lân cận." } },
      ]},
    },
    {
      title: "Heo Sữa Quay Cúng Đầy Tháng — Ý Nghĩa và Cách Chuẩn Bị",
      image: { url: "https://images.unsplash.com/photo-1585703900468-13785b50e4e4?w=1200&q=85", alt: "Heo Sữa Cúng Đầy Tháng" },
      cats: ["heo-sua", "mon-quay"],
      content: { time: now, blocks: [
        { type: "paragraph", data: { text: "Trong văn hóa người Việt gốc Hoa và nhiều gia đình Nam Bộ, heo sữa quay là lễ vật không thể thiếu trong lễ đầy tháng. Màu đỏ vàng của heo quay tượng trưng cho may mắn, thịnh vượng và sức khỏe cho em bé." } },
        { type: "header", data: { text: "Ý nghĩa của heo sữa trong lễ đầy tháng", level: 2 } },
        { type: "paragraph", data: { text: "Heo sữa quay trong lễ đầy tháng mang nhiều ý nghĩa: màu đỏ của da heo mang lại may mắn, heo nguyên con tượng trưng cho sự trọn vẹn đầy đủ, và việc cúng con heo nguyên thể hiện lòng thành kính với tổ tiên và thần linh phù hộ cho đứa trẻ." } },
        { type: "header", data: { text: "Cách bày mâm cúng đầy tháng có heo sữa", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Heo sữa quay đặt ở vị trí trung tâm mâm cúng", "Đầu heo quay về phía ban thờ", "Kèm theo: xôi gấc đỏ, trái cây 5 loại, nhang đèn", "Không cắt heo trước khi cúng xong", "Sau khi cúng mới chặt ra cho khách ăn"] } },
        { type: "header", data: { text: "Chọn size heo sữa phù hợp", level: 2 } },
        { type: "list", data: { style: "unordered", items: ["Lễ gia đình nhỏ: heo 3–4 kg, đủ cho 10–15 người", "Tiệc đầy tháng 20–30 khách: heo 5–6 kg", "Tiệc lớn trên 50 khách: 2 con heo sữa hoặc 1 con heo sữa + 1 heo lớn", "Đặt trước tối thiểu 2 ngày để đảm bảo có hàng đúng ngày"] } },
        { type: "header", data: { text: "Đặt heo sữa quay tại Bình Tân", level: 2 } },
        { type: "paragraph", data: { text: "Heo Quay Bình Tân chuyên cung cấp heo sữa quay cho các dịp lễ quan trọng. Gọi 0987 054 231 để đặt hàng và được tư vấn về kích cỡ phù hợp. Giao hàng đúng giờ, đảm bảo da còn giòn khi đến tay bạn." } },
      ]},
    },
  ]

  let count = 0
  for (const p of posts) {
    const catIds = p.cats.map(slug => C[slug]).filter(Boolean)
    const post = await db.post.create({
      data: {
        title: p.title,
        content: p.content,
        published: true,
        image: p.image,
        authorId: AUTHOR,
        categories: { create: catIds.map(id => ({ categoryId: id })) },
      }
    })
    console.log("✓", post.title.slice(0, 55))
    count++
  }

  const total = await db.post.count()
  console.log(`\nThêm ${count} bài. Tổng posts: ${total}`)
}

main().catch(console.error).finally(() => db.$disconnect())
