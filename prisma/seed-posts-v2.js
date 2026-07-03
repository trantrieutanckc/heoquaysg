const { PrismaClient } = require("@prisma/client")
const db = new PrismaClient()

const ADMIN_ID = "cmqowl0w40000h98etnodtd00"

// ── TipTap JSON helpers ───────────────────────────────────────────────────────

function doc(...content) {
  return { type: "doc", content }
}

function p(text, marks = []) {
  if (!text) return { type: "paragraph", attrs: { textAlign: "left" }, content: [] }
  return {
    type: "paragraph",
    attrs: { textAlign: "left" },
    content: [{ type: "text", text, ...(marks.length ? { marks } : {}) }],
  }
}

function pRich(parts) {
  // parts: [{ text, bold?, italic? }]
  return {
    type: "paragraph",
    attrs: { textAlign: "left" },
    content: parts.map(({ text, bold, italic }) => ({
      type: "text",
      text,
      ...(bold || italic
        ? { marks: [...(bold ? [{ type: "bold" }] : []), ...(italic ? [{ type: "italic" }] : [])] }
        : {}),
    })),
  }
}

function h2(text) {
  return {
    type: "heading",
    attrs: { level: 2, textAlign: "left" },
    content: [{ type: "text", text }],
  }
}

function h3(text) {
  return {
    type: "heading",
    attrs: { level: 3, textAlign: "left" },
    content: [{ type: "text", text }],
  }
}

function ul(...items) {
  return {
    type: "bulletList",
    content: items.map((text) => ({
      type: "listItem",
      content: [{ type: "paragraph", content: [{ type: "text", text }] }],
    })),
  }
}

function ol(...items) {
  return {
    type: "orderedList",
    attrs: { start: 1 },
    content: items.map((text) => ({
      type: "listItem",
      content: [{ type: "paragraph", content: [{ type: "text", text }] }],
    })),
  }
}

function blockquote(text) {
  return {
    type: "blockquote",
    content: [{ type: "paragraph", content: [{ type: "text", text }] }],
  }
}

// ── Nội dung từng bài ─────────────────────────────────────────────────────────

const posts = [
  // ─── 1 ────────────────────────────────────────────────────────────────────
  {
    title: "Heo Quay Lá Mắc Mật — Đặc Sản Giao Thoa Hai Miền",
    slug: "heo-quay-la-mac-mat",
    template: "wide",
    published: true,
    image: {
      url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80",
      alt: "Heo quay lá mắc mật thơm nức",
    },
    categorySlug: "mon-quay",
    content: doc(
      p("Lá mắc mật — loài thảo mộc mọc hoang ở vùng núi phía Bắc — chính là linh hồn của món heo quay đặc sản Lạng Sơn. Khi kết hợp cùng kỹ thuật quay truyền thống, lớp da vàng ươm giòn tan hòa với hương thơm rừng núi tạo nên hương vị không thể lẫn đi đâu được."),
      h2("Lá mắc mật là gì?"),
      p("Mắc mật (tên khoa học Clausena lansium) là loại cây thuộc họ Rutaceae, mọc tự nhiên ở các tỉnh miền núi Đông Bắc như Lạng Sơn, Cao Bằng, Bắc Kạn. Lá non có mùi thơm đặc trưng — pha giữa sả, quế và một chút cay nhẹ — không thể thay thế bằng loại thảo mộc nào khác."),
      blockquote("\"Thiếu lá mắc mật thì không thể gọi là heo quay Lạng Sơn.\" — Nghệ nhân ẩm thực Hoàng Thị Lan, Lạng Sơn"),
      h2("Nguyên liệu (cho 1 con heo 10–12 kg)"),
      ul(
        "1 con heo sữa hoặc heo tơ 10–12 kg, đã làm sạch",
        "300 g lá mắc mật tươi (hoặc 100 g lá khô)",
        "5 tbsp ngũ vị hương",
        "3 tbsp nước tương đậm",
        "2 tbsp mật ong",
        "1 tbsp muối hột",
        "1 tbsp đường vàng",
        "1 tsp tiêu đen xay",
        "3 tép tỏi băm nhuyễn",
        "Giấm trắng để phết da"
      ),
      h2("Cách làm"),
      h3("Bước 1 — Sơ chế và nhồi lá"),
      p("Rửa sạch lá mắc mật, để ráo. Trộn lá với ngũ vị hương, nước tương, muối, tỏi băm và đường thành hỗn hợp nhồi. Nhồi toàn bộ hỗn hợp vào bụng heo, dùng que tre cố định bụng lại."),
      h3("Bước 2 — Ướp và phơi da"),
      p("Dùng que nhọn chích đều khắp mặt da. Phết giấm trắng lên toàn bộ da, đặt heo ở nơi thoáng gió ít nhất 4 tiếng (hoặc qua đêm trong tủ lạnh không che đậy). Da khô hoàn toàn là điều kiện bắt buộc để da giòn."),
      h3("Bước 3 — Quay"),
      p("Quay ở 220°C trong 20–25 phút đầu để da phồng và bắt màu. Hạ xuống 180°C, tiếp tục quay 60–80 phút tùy kích cỡ heo. Mỗi 20 phút phết một lớp mật ong pha loãng lên da để tạo màu vàng cánh gián đẹp mắt."),
      h3("Bước 4 — Để nguội và chặt"),
      p("Sau khi ra lò, để heo nghỉ 10 phút trước khi chặt — thịt sẽ giữ nước tốt hơn. Chặt miếng vừa ăn, bày ra đĩa với vài nhánh lá mắc mật tươi trang trí."),
      h2("Ăn kèm gì ngon nhất?"),
      ul(
        "Xôi nếp nương — đặc trưng miền núi Bắc",
        "Bánh mì nướng với tương hoisin",
        "Dưa cải muối chua giải ngán",
        "Rau sống: húng quế, rau mùi, ngò gai"
      ),
      h2("Mẹo từ bếp Heo Quay 47"),
      p("Nếu không tìm được lá mắc mật tươi, bạn có thể mua lá khô tại các chợ đầu mối ở Hà Nội hoặc đặt online. Lá khô cần ngâm nước 30 phút trước khi dùng. Hương thơm có thể nhạt hơn 20%, nhưng vẫn đủ đặc trưng."),
      blockquote("Tại Heo Quay 47, chúng tôi nhập lá mắc mật tươi từ Lạng Sơn mỗi tuần để đảm bảo hương vị chuẩn vị Bắc.")
    ),
  },

  // ─── 2 ────────────────────────────────────────────────────────────────────
  {
    title: "Gà Quay Mật Ong — Da Giòn, Thịt Ngọt, Không Bở",
    slug: "ga-quay-mat-ong-da-gion",
    template: "standard",
    published: true,
    image: {
      url: "https://images.unsplash.com/photo-1598103442097-8b74394b95c1?w=1200&q=80",
      alt: "Gà quay mật ong vàng ươm",
    },
    categorySlug: "cong-thuc",
    content: doc(
      p("Gà quay mật ong là món quen thuộc nhưng để làm đúng — da giòn mà không cháy, thịt mềm mà không bở, màu vàng cánh gián tự nhiên — lại cần hiểu đúng từng bước. Bài này chia sẻ công thức chúng tôi đang dùng tại Heo Quay 47."),
      h2("Chọn gà"),
      p("Gà ta hoặc gà Đông Tảo 1.5–2 kg cho kết quả tốt nhất. Gà công nghiệp da dày, mỡ nhiều — khó giòn và hay bị cháy ngoài sống trong. Gà phải tươi, không đông lạnh; da còn nguyên vẹn, không rách."),
      h2("Nguyên liệu"),
      ul(
        "1 con gà ta 1.5–2 kg",
        "3 tbsp mật ong (loại đậm màu như mật ong rừng)",
        "2 tbsp nước tương",
        "1 tbsp dầu hào",
        "1 tsp ngũ vị hương",
        "1 tsp bột tỏi",
        "1 tsp bột gừng",
        "½ tsp muối",
        "1 tbsp giấm táo (để phết da)",
        "Dầu ăn để phết trước khi quay"
      ),
      h2("Kỹ thuật làm da giòn"),
      h3("Quan trọng nhất: làm khô da"),
      p("Dùng khăn giấy thấm khô toàn bộ mặt da. Phết giấm táo lên da, để tủ lạnh 8–12 tiếng không che đậy. Hơi lạnh trong tủ sẽ hút ẩm từ da ra ngoài — đây là bước nhiều người bỏ qua dẫn đến da không giòn."),
      h3("Chích da đều tay"),
      p("Dùng nĩa hoặc kim chích đều khắp mặt da, đặc biệt phần ngực và đùi. Chích giúp mỡ dưới da thoát ra trong quá trình quay thay vì đọng lại làm da mềm."),
      h2("Công thức ướp"),
      p("Trộn mật ong, nước tương, dầu hào, ngũ vị hương, bột tỏi, bột gừng và muối. Phết đều vào bên trong bụng gà trước, sau đó mới phết ngoài da. Để ướp tối thiểu 4 tiếng — lý tưởng là qua đêm."),
      h2("Nhiệt độ và thời gian"),
      ol(
        "Làm nóng lò 220°C (đặt khay dưới đáy để hứng mỡ)",
        "Đặt gà lên vỉ, phết một lớp dầu mỏng lên da",
        "Quay 220°C — 20 phút đầu để da phồng và bắt màu",
        "Hạ xuống 180°C — tiếp tục 25–30 phút",
        "Kiểm tra: xiên vào phần đùi dày nhất, nước chảy ra trong là chín",
        "Phết thêm mật ong pha loãng 1:1 với nước, bật broil (lửa trên) 3–5 phút để màu đẹp"
      ),
      h2("Để gà không bị bở"),
      ul(
        "Không quay quá lâu — thịt gà chín ở 74°C bên trong",
        "Để gà nghỉ 10 phút sau khi ra lò trước khi chặt",
        "Không mở lò thường xuyên trong quá trình quay (mất nhiệt, thịt co lại)"
      ),
      blockquote("Mẹo nhỏ: thêm vài lát gừng và sả vào bụng gà trước khi quay — mùi thơm lan vào thịt rất tự nhiên."),
      h2("Nước chấm đi kèm"),
      p("Gà quay mật ong ngon nhất khi chấm muối tiêu chanh truyền thống hoặc tương xí muội. Tránh dùng tương hoisin vì vị ngọt đã có trong mật ong, ăn sẽ bị ngấy.")
    ),
  },

  // ─── 3 ────────────────────────────────────────────────────────────────────
  {
    title: "Tại Sao Da Heo Quay Không Giòn? 7 Lỗi Thường Gặp",
    slug: "da-heo-quay-khong-gion-loi-thuong-gap",
    template: "standard",
    published: true,
    image: {
      url: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=1200&q=80",
      alt: "Da heo quay giòn rụm",
    },
    categorySlug: "meo-nau-an",
    content: doc(
      p("Da giòn là tiêu chí số một của một miếng heo quay ngon. Nhưng không ít người thử đi thử lại mà da vẫn mềm, dai hoặc cháy loang lổ. Bài này tổng hợp 7 lỗi phổ biến nhất và cách khắc phục từng lỗi."),
      h2("Lỗi 1 — Da còn ẩm trước khi quay"),
      p("Đây là nguyên nhân số một. Độ ẩm trong da sẽ tạo hơi nước khi gặp nhiệt, làm da phồng lên rồi xẹp xuống thay vì giòn đều."),
      pRich([
        { text: "Cách khắc phục: ", bold: true },
        { text: "Sau khi ướp, để heo trong tủ lạnh không che đậy ít nhất 8 tiếng. Lấy ra trước khi quay 30 phút để về nhiệt độ phòng, dùng khăn giấy thấm lại một lần nữa." },
      ]),
      h2("Lỗi 2 — Không chích da"),
      p("Da heo có lớp mỡ dày phía dưới. Nếu không chích, mỡ không thoát ra được, tích tụ dưới da và làm da mềm ủng."),
      pRich([
        { text: "Cách khắc phục: ", bold: true },
        { text: "Dùng kim hoặc nĩa chích đều khắp mặt da, sâu khoảng 3–4 mm. Tập trung vào phần lưng và vai nơi mỡ dày nhất. Không cần chích phần bụng." },
      ]),
      h2("Lỗi 3 — Ướp gia vị lên da"),
      p("Nước tương, mật ong, dầu hào — dù ngon nhưng đều chứa đường và nước. Phết lên da trước khi quay làm da không bao giờ khô được."),
      pRich([
        { text: "Cách khắc phục: ", bold: true },
        { text: "Ướp gia vị bên trong bụng và phần thịt, không phết lên da. Chỉ phết mật ong pha loãng lên da trong 5–10 phút cuối để tạo màu." },
      ]),
      h2("Lỗi 4 — Nhiệt độ lò không đủ cao lúc đầu"),
      p("Nếu bắt đầu quay ở nhiệt độ thấp, da sẽ nấu chín dần thay vì phồng nhanh. Kết quả là da chín nhưng không giòn."),
      pRich([
        { text: "Cách khắc phục: ", bold: true },
        { text: "Luôn bắt đầu ở 220–230°C trong 20 phút đầu để da phồng và bắt màu. Sau đó mới hạ nhiệt để thịt bên trong chín đều." },
      ]),
      h2("Lỗi 5 — Mở lò quá nhiều lần"),
      p("Mỗi lần mở lò, nhiệt độ giảm đột ngột 20–30°C. Dao động nhiệt liên tục làm da co lại rồi giãn ra, mất đi độ giòn."),
      pRich([
        { text: "Cách khắc phục: ", bold: true },
        { text: "Chỉ mở lò tối đa 2 lần: một lần để lật (nếu cần) và một lần để phết mật ong cuối. Dùng đèn bên trong lò để quan sát thay vì mở cửa." },
      ]),
      h2("Lỗi 6 — Dùng heo đông lạnh"),
      p("Thịt đông lạnh sau khi rã đông tiết ra nhiều nước, đặc biệt ở lớp da. Dù phơi và lau khô bao nhiêu, da vẫn chứa ẩm nhiều hơn heo tươi."),
      pRich([
        { text: "Cách khắc phục: ", bold: true },
        { text: "Dùng heo tươi mổ trong ngày. Nếu buộc dùng đông lạnh, rã đông trong tủ lạnh 24 tiếng (không rã ở nhiệt độ phòng), sau đó phơi khô ít nhất 12 tiếng." },
      ]),
      h2("Lỗi 7 — Không để heo nghỉ sau khi ra lò"),
      p("Chặt ngay khi vừa ra lò, hơi nước bên trong thịt thoát ra, ngấm lên da và làm da mềm chỉ sau vài phút."),
      pRich([
        { text: "Cách khắc phục: ", bold: true },
        { text: "Để heo nghỉ trên vỉ (không để trên đĩa phẳng) 8–10 phút sau khi ra lò trước khi chặt. Đặt trên vỉ giúp không khí lưu thông, da tiếp tục giòn." },
      ]),
      blockquote("Tóm lại: khô da + nhiệt cao ban đầu + không mở lò thường xuyên = da giòn. Đơn giản nhưng đòi hỏi kỷ luật ở từng bước."),
      h2("Checklist nhanh trước khi quay"),
      ul(
        "✅ Da đã phơi ít nhất 8 tiếng trong tủ lạnh",
        "✅ Da đã được chích đều",
        "✅ Không có gia vị trên mặt da",
        "✅ Lò đã làm nóng sẵn 220°C",
        "✅ Không mở lò trong 20 phút đầu"
      )
    ),
  },

  // ─── 4 ────────────────────────────────────────────────────────────────────
  {
    title: "Đặt Heo Quay Cúng Giỗ — Những Điều Cần Biết",
    slug: "dat-heo-quay-cung-gio-can-biet",
    template: "minimal",
    published: true,
    image: {
      url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
      alt: "Mâm cỗ cúng giỗ có heo quay",
    },
    categorySlug: "mon-quay",
    content: doc(
      p("Heo quay là lễ vật không thể thiếu trong các dịp giỗ chạp, cúng rằm tháng Bảy, cúng Ông Táo hay cúng đất. Đặt heo quay cúng có một số điểm khác với đặt heo quay thông thường mà không phải ai cũng biết."),
      h2("Kích thước và trọng lượng phù hợp"),
      p("Trọng lượng heo quay cúng thường được tính dựa theo số người dùng bữa sau lễ cúng:"),
      ul(
        "Gia đình nhỏ 4–6 người: heo sữa 3–5 kg (còn gọi là heo quay cúng nhỏ)",
        "Gia đình 10–15 người: heo tơ 6–8 kg",
        "Tiệc giỗ 20–30 người: heo 10–12 kg",
        "Giỗ lớn, cúng đình: heo 15–20 kg trở lên"
      ),
      p("Tại Heo Quay 47, chúng tôi cung cấp heo sữa từ 3 kg (nguyên con) phù hợp cho lễ cúng tại nhà."),
      h2("Đặt trước bao lâu?"),
      pRich([
        { text: "Tối thiểu 2 ngày trước", bold: true },
        { text: " ngày cúng. Nếu cúng vào cuối tuần hoặc ngày rằm, mùng một, nên đặt trước " },
        { text: "3–5 ngày", bold: true },
        { text: " để đảm bảo có hàng. Dịp Thanh Minh, Vu Lan (tháng 7 âm lịch) và cuối năm âm lịch thường rất đông — nên đặt trước ít nhất 1 tuần." },
      ]),
      h2("Giờ giao hàng"),
      p("Lễ cúng thường diễn ra vào buổi sáng (9–11 giờ). Do đó giờ giao lý tưởng là 7–8 giờ sáng để heo còn nóng, da còn giòn khi lên mâm. Chúng tôi nhận đơn giao từ 7:00 sáng cho đơn đặt trước."),
      blockquote("Lưu ý: Heo Quay 47 giao hàng Thứ 2 đến Thứ 6. Nếu ngày cúng rơi vào Thứ 7 hoặc Chủ Nhật, vui lòng liên hệ trực tiếp để thỏa thuận."),
      h2("Heo quay nguyên con hay theo miếng?"),
      p("Cúng giỗ truyền thống yêu cầu heo quay nguyên con — đầu heo, thân và bốn chân đầy đủ, không chặt. Sau khi cúng xong mới chặt phục vụ bữa ăn. Chúng tôi giao nguyên con, kèm dao chặt và hướng dẫn chặt nếu cần."),
      h2("Chuẩn bị mâm cúng"),
      p("Heo quay thường được đặt trên khay inox hoặc mâm gỗ lớn, đầu hướng ra ngoài (hướng về bàn thờ hoặc trước sân). Trang trí đơn giản với vài bông hoa cúc vàng và lá lộc."),
      ul(
        "Không cần cắt trang trí phức tạp — giữ nguyên con để thể hiện sự trang trọng",
        "Đặt kèm muối trắng và gừng tươi bên cạnh",
        "Có thể kèm theo bánh chưng hoặc xôi gấc tùy phong tục vùng miền"
      ),
      h2("Liên hệ đặt hàng"),
      p("Gọi hotline hoặc điền form đặt lịch trên website. Vui lòng ghi rõ: ngày giao, giờ giao, trọng lượng mong muốn và địa chỉ. Chúng tôi sẽ xác nhận đơn trong vòng 2 giờ làm việc.")
    ),
  },

  // ─── 5 ────────────────────────────────────────────────────────────────────
  {
    title: "Bảo Quản Heo Quay — Giữ Da Giòn Cả Ngày Không Lo",
    slug: "bao-quan-heo-quay-da-gion",
    template: "standard",
    published: true,
    image: {
      url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80",
      alt: "Heo quay bảo quản đúng cách",
    },
    categorySlug: "meo-nau-an",
    content: doc(
      p("Heo quay ngon nhất trong 2 giờ đầu sau khi ra lò. Nhưng nếu bạn đặt giao buổi sáng để dùng bữa trưa, hay có tiệc kéo dài nhiều giờ — biết cách bảo quản đúng sẽ giúp da giòn lâu hơn đáng kể."),
      h2("Tại sao da heo quay bị mềm?"),
      p("Da heo quay mềm vì một nguyên nhân duy nhất: hơi nước. Hơi nước từ thịt bên trong bốc lên, kết hợp với độ ẩm không khí và đọng lại trên bề mặt da, làm da mất độ giòn. Quá trình này diễn ra ngay khi heo ra khỏi lò."),
      h2("Cách giữ giòn trong 2–4 giờ"),
      p("Đây là tình huống phổ biến nhất: heo giao lúc 10 giờ, ăn lúc 12 giờ trưa."),
      ol(
        "Để heo trên vỉ, không để trực tiếp trên khay hay đĩa phẳng — hơi nước phía dưới sẽ làm ẩm phần bụng",
        "Đặt nơi thoáng, nhiệt độ phòng, tránh điều hòa thổi thẳng vào",
        "Không bọc hoặc đậy nắp — bọc kín sẽ giữ hơi nước lại",
        "Nếu có lò nướng, bật 150°C và để heo trong lò (cửa hé nhẹ) để giữ ấm và duy trì độ giòn"
      ),
      h2("Cách giữ giòn sau 4–8 giờ"),
      p("Khi cần giữ lâu hơn (cỗ giỗ ăn nhiều đợt, tiệc dài), heo quay đã nguội cần được hâm lại đúng cách:"),
      ol(
        "Để heo nguội hoàn toàn về nhiệt độ phòng",
        "Bật lò 200°C, để heo trực tiếp lên vỉ (không dùng khay)",
        "Hâm 12–15 phút — da sẽ giòn lại như mới",
        "Không dùng lò vi sóng — da sẽ mềm nhũn hoàn toàn và không thể phục hồi"
      ),
      blockquote("Nồi chiên không dầu (air fryer) rất tốt để hâm miếng nhỏ: 180°C / 5–7 phút, da giòn đều và nhanh hơn lò nướng thông thường."),
      h2("Bảo quản qua đêm"),
      p("Nếu có heo quay thừa sau tiệc:"),
      ul(
        "Để nguội hoàn toàn, bọc thịt (không bọc da) bằng giấy bạc",
        "Cất ngăn mát tủ lạnh, dùng trong 2 ngày",
        "Khi ăn: hâm bằng lò nướng hoặc air fryer, không dùng lò vi sóng",
        "Tuyệt đối không đông lạnh — cấu trúc da bị phá vỡ, không thể giòn lại"
      ),
      h2("Bảo quản để vận chuyển xa"),
      p("Nếu cần mang heo quay đi xa (tiệc ngoài trời, nhà khách xa):"),
      ul(
        "Bọc toàn bộ heo bằng giấy bạc để giữ nhiệt, không dùng màng bọc thực phẩm",
        "Đặt trong thùng xốp (không cần đá lạnh nếu vận chuyển dưới 2 tiếng)",
        "Khi đến nơi, mở giấy bạc ngay để da không bị ngạt hơi",
        "Nếu có lò tại chỗ, hâm lại 10 phút trước khi phục vụ"
      ),
      h2("Tóm tắt nhanh"),
      ul(
        "Giòn ngay sau quay: vỉ thoáng, không bọc, không che",
        "Giữ 2–4 giờ: để trên vỉ, lò 150°C cửa hé",
        "Hâm lại: lò 200°C / 12–15 phút hoặc air fryer 180°C / 5–7 phút",
        "Tủ lạnh: bọc thịt (không bọc da), dùng trong 2 ngày",
        "Cấm: lò vi sóng, đông lạnh, bọc kín khi còn nóng"
      )
    ),
  },

  // ─── 6 ────────────────────────────────────────────────────────────────────
  {
    title: "Heo Quay 47 — Câu Chuyện Từ Bếp Lửa Gia Đình",
    slug: "heo-quay-47-cau-chuyen-thuong-hieu",
    template: "wide",
    published: true,
    image: {
      url: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1200&q=80",
      alt: "Bếp lửa truyền thống Heo Quay 47",
    },
    categorySlug: "mon-quay",
    content: doc(
      p("\"47\" không phải con số ngẫu nhiên. Đó là số nhà nơi bà ngoại tôi đã nuôi heo và quay heo suốt 30 năm ở một con hẻm nhỏ Bình Tân. Heo Quay 47 ra đời từ ký ức đó — và từ một câu hỏi đơn giản: liệu có thể đưa hương vị bếp nhà ra ngoài mà không mất đi điều gì?"),
      h2("Bắt đầu từ một ký ức"),
      p("Mỗi dịp giỗ, bà tôi dậy từ 4 giờ sáng. Không phải vì bà phải làm nhiều việc — mà vì bà muốn có đủ thời gian. Thời gian để heo thấm gia vị. Thời gian để da khô tự nhiên trong gió sớm. Thời gian để lửa than đỏ đều trước khi đặt heo lên."),
      p("Không có nhiệt kế, không có hẹn giờ. Chỉ có kinh nghiệm và sự kiên nhẫn. Miếng heo bà quay luôn có lớp da phồng đều, giòn tan khi cắn — không một vết cháy, không một chỗ mềm. Hàng xóm xung quanh thường ghé qua không phải để hỏi thăm, mà để hỏi mua."),
      blockquote("\"Con heo ngon hay không là do người quay có kiên nhẫn không, chứ không phải do gia vị nhiều hay ít.\" — Bà ngoại Tám"),
      h2("Khi bếp nhà trở thành thương hiệu"),
      p("Năm 2019, sau nhiều năm học và làm công việc không liên quan đến bếp núc, tôi quyết định quay lại với điều duy nhất mình thực sự biết làm tốt. Mang công thức của bà, học thêm kỹ thuật kiểm soát nhiệt độ hiện đại, và bắt đầu nhận đơn từ bạn bè."),
      p("Tuần đầu: 5 đơn. Tháng thứ ba: 50 đơn. Năm thứ hai: thuê thêm người và mở rộng bếp."),
      p("Điều tôi không muốn thay đổi: vẫn dùng đúng lá mắc mật từ Lạng Sơn, vẫn phơi da qua đêm, vẫn không dùng phụ gia để làm da giòn nhân tạo. Điều tôi học thêm: kiểm soát nhiệt độ bằng nhiệt kế, chuẩn hóa công thức ướp để mỗi con heo ra lò đều giống nhau."),
      h2("Điều chúng tôi cam kết"),
      ul(
        "Heo tươi mổ trong ngày, không dùng heo đông lạnh",
        "Không dùng phụ gia tạo giòn, tạo màu nhân tạo",
        "Lá mắc mật nhập trực tiếp từ Lạng Sơn mỗi tuần",
        "Giao đúng giờ — cam kết bồi thường nếu trễ quá 30 phút",
        "Không giao Thứ 7 và Chủ Nhật để đảm bảo chất lượng kiểm soát"
      ),
      h2("Heo Quay 47 hôm nay"),
      p("Chúng tôi hiện phục vụ trên 200 đơn mỗi tháng, từ tiệc gia đình đến sự kiện doanh nghiệp, cúng giỗ đến khai trương. Mỗi con heo vẫn do chính tôi hoặc người học trực tiếp từ tôi thực hiện — chưa bao giờ khoán cho người chưa đủ 6 tháng thực hành."),
      p("Con số 47 vẫn ở đó — nhắc tôi rằng điều quan trọng nhất không phải là bao nhiêu đơn, mà là mỗi miếng heo ra lò có xứng đáng với tiêu chuẩn của bà không."),
      blockquote("Đặt hàng sớm — đặc biệt dịp lễ và cuối năm. Chúng tôi không nhận thêm đơn khi đã đủ công suất trong ngày.")
    ),
  },
]

// ── Seed runner ───────────────────────────────────────────────────────────────

async function main() {
  // Đảm bảo categories tồn tại
  const catDefs = [
    { name: "Món Quay", slug: "mon-quay", template: "hero" },
    { name: "Công Thức", slug: "cong-thuc", template: "grid" },
    { name: "Mẹo Nấu Ăn", slug: "meo-nau-an", template: "standard" },
  ]

  const catIds = {}
  for (const cat of catDefs) {
    const existing = await db.category.findUnique({ where: { slug: cat.slug } })
    if (existing) {
      catIds[cat.slug] = existing.id
    } else {
      const created = await db.category.create({ data: cat })
      catIds[cat.slug] = created.id
      console.log(`Created category: ${cat.name}`)
    }
  }

  // Tạo bài viết
  for (const p of posts) {
    const existing = await db.post.findFirst({ where: { title: p.title } })
    if (existing) {
      await db.post.delete({ where: { id: existing.id } })
      console.log(`Deleted old: "${p.title}"`)
    }

    const post = await db.post.create({
      data: {
        title: p.title,
        content: p.content,
        template: p.template,
        published: p.published,
        image: p.image,
        authorId: ADMIN_ID,
        categories: {
          create: [{ categoryId: catIds[p.categorySlug] }],
        },
      },
    })
    console.log(`✓ "${p.title}" → /posts/${post.id}`)
  }

  console.log(`\nDone! ${posts.length} bài viết đã được tạo.`)
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
