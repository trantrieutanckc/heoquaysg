const { PrismaClient } = require("@prisma/client")
const db = new PrismaClient()

function makeContent(blocks) {
  return { time: Date.now(), blocks, version: "2.28.2" }
}

function p(text) { return { type: "paragraph", data: { text } } }
function h2(text) { return { type: "header", data: { text, level: 2 } } }
function h3(text) { return { type: "header", data: { text, level: 3 } } }
function ul(items) { return { type: "list", data: { style: "unordered", items } } }
function ol(items) { return { type: "list", data: { style: "ordered", items } } }

const posts = [
  {
    id: "cmqoymc2b0007h9wg78geoujq",
    title: "Heo Quay Da Giòn — Công Thức Gia Truyền Của Heo Quay Bình Tân",
    seoDescription: "Bí quyết heo quay da giòn tan, thịt mềm thơm ngọt theo công thức gia truyền của Heo Quay Bình Tân. Tìm hiểu quy trình từ chọn heo đến khi thành phẩm.",
    content: makeContent([
      p("Heo quay da giòn là món ăn đặc trưng mà Heo Quay Bình Tân tự hào nhất. Với hơn nhiều năm kinh nghiệm, chúng tôi đã hoàn thiện công thức gia truyền để mang đến lớp da vàng óng, giòn rụm, thịt mềm ngọt thấm đều gia vị."),
      h2("Chọn Heo Đúng Chuẩn"),
      p("Nguyên liệu quyết định 70% thành công của món quay. Chúng tôi chọn heo từ 8–12 kg, da mỏng đều, thịt hồng tươi, không có mùi lạ. Heo nuôi tự nhiên cho thịt ngọt hơn và da giòn hơn so với heo công nghiệp."),
      h2("Ướp Gia Vị Đúng Cách"),
      p("Gia vị ướp bên trong gồm ngũ vị hương, tỏi, gừng, nước tương, mật ong và một số thảo mộc bí truyền. Ướp ít nhất 6 tiếng, tốt nhất là qua đêm để gia vị thấm đều từ trong ra ngoài."),
      h2("Bí Quyết Da Giòn"),
      ul([
        "Phơi khô da hoàn toàn trước khi quay — đây là bước quan trọng nhất",
        "Châm kim đều khắp bề mặt da để hơi thoát ra khi quay",
        "Quét giấm trắng lên da, để khô rồi mới cho vào lò",
        "Nhiệt độ ban đầu cao (220°C) để da phồng giòn, sau hạ xuống để thịt chín đều",
      ]),
      h2("Thành Phẩm"),
      p("Heo quay đạt chuẩn khi gõ vào da nghe tiếng 'cộc cộc', màu vàng nâu đều, không cháy đen. Thịt bên trong mềm, thấm vị, không bị khô. Đây là tiêu chuẩn mà Heo Quay Bình Tân luôn duy trì cho mỗi con heo xuất bếp."),
    ])
  },
  {
    id: "cmqoymcgi0009h9wgycd0kc72",
    title: "Vịt Quay Bắc Kinh — Bí Quyết Da Mỏng Giòn Chuẩn Vị",
    seoDescription: "Khám phá bí quyết làm vịt quay Bắc Kinh da mỏng giòn rụm, thịt mềm thơm. Công thức chuẩn nhà hàng được chia sẻ từ Heo Quay Bình Tân.",
    content: makeContent([
      p("Vịt quay Bắc Kinh là một trong những món ăn nổi tiếng nhất thế giới với lớp da mỏng giòn tan và thịt mềm ngọt. Tại Heo Quay Bình Tân, chúng tôi áp dụng kỹ thuật quay truyền thống kết hợp với bí quyết riêng để tạo ra món vịt quay đạt chuẩn nhà hàng."),
      h2("Chọn Vịt Chuẩn"),
      p("Vịt dùng để quay phải là vịt Bắc Kinh (Pekin duck) từ 2–2.5 kg, da trắng mịn, mỡ vừa phải. Vịt quá béo sẽ bị ngấy, quá gầy thịt sẽ khô sau khi quay."),
      h2("Kỹ Thuật Thổi Không Khí"),
      p("Bước đặc biệt của vịt quay Bắc Kinh là thổi không khí vào giữa da và thịt, tách hai lớp ra để khi quay da sẽ phồng lên và giòn hơn. Đây là bước không thể bỏ qua để có được lớp da đặc trưng."),
      h2("Nước Sốt Tẩm"),
      ul([
        "Mật ong pha loãng với nước — tạo màu vàng óng và vị ngọt nhẹ",
        "Giấm trắng — giúp da săn lại và giòn hơn",
        "Nước tương — tạo màu và vị đậm đà",
        "Rượu mai quế lộ — thơm và khử mùi vịt hiệu quả",
      ]),
      h2("Thời Gian Phơi Khô"),
      p("Sau khi tẩm nước sốt, treo vịt ở nơi thoáng gió ít nhất 4–6 tiếng, tốt nhất là qua đêm. Da càng khô, sau khi quay càng giòn. Đây là bước mà nhiều người bỏ qua khiến da không đạt độ giòn mong muốn."),
    ])
  },
  {
    id: "cmqoymcpx000bh9wgo7ef9d9b",
    title: "5 Mẹo Chọn Heo Tươi Cho Món Quay Ngon",
    seoDescription: "5 mẹo chọn heo tươi ngon cho món heo quay đạt chuẩn. Bí quyết từ chuyên gia Heo Quay Bình Tân giúp bạn phân biệt heo tươi và heo kém chất lượng.",
    content: makeContent([
      p("Chọn được con heo tươi ngon là bước đầu tiên và quan trọng nhất để có món heo quay ngon. Với kinh nghiệm nhiều năm trong nghề, đội ngũ Heo Quay Bình Tân chia sẻ 5 mẹo giúp bạn chọn heo chuẩn."),
      h2("1. Quan Sát Màu Thịt"),
      p("Thịt heo tươi có màu hồng đỏ tươi, không có đốm xanh hay nâu. Thịt quá đỏ sẫm có thể là heo già, thịt nhạt màu có thể là heo bệnh hoặc heo bị bơm nước."),
      h2("2. Kiểm Tra Da Heo"),
      p("Da heo dùng để quay phải mỏng đều, không có vết thương hay đốm đen. Da dày và xù xì sẽ khó giòn sau khi quay, còn da có vết thương sẽ bị cháy không đều."),
      h2("3. Ngửi Mùi"),
      p("Thịt heo tươi có mùi tự nhiên, nhẹ nhàng. Nếu có mùi hôi, mùi lạ hay mùi hóa chất là dấu hiệu không tốt. Tuyệt đối không chọn thịt có mùi chua."),
      h2("4. Kiểm Tra Độ Đàn Hồi"),
      p("Dùng ngón tay ấn nhẹ vào thịt — thịt tươi sẽ đàn hồi trở lại ngay. Thịt kém tươi hoặc bị bơm nước sẽ để lại vết lõm hoặc rỉ nước ra."),
      h2("5. Chọn Trọng Lượng Phù Hợp"),
      p("Heo từ 8–12 kg cho tỷ lệ thịt/da tốt nhất. Heo quá nhỏ thịt mỏng ít, heo quá lớn da dày khó giòn và thịt không đều. Tại Heo Quay Bình Tân, chúng tôi chỉ chọn heo trong khoảng trọng lượng này."),
    ])
  },
  {
    id: "cmqpiccph0003h96w6g7hi3lm",
    title: "Top 10 Món Ăn Từ Heo Quay, Gà Quay Và Vịt Quay Ngon Nhất",
    seoDescription: "Khám phá top 10 món ăn ngon nhất từ heo quay, gà quay và vịt quay. Từ cơm tấm heo quay đến vịt quay chấm tương gừng — tất cả đều có tại Heo Quay Bình Tân.",
    content: makeContent([
      p("Heo quay, gà quay và vịt quay không chỉ ăn trực tiếp mà còn là nguyên liệu cho rất nhiều món ăn ngon. Dưới đây là top 10 món được khách hàng Heo Quay Bình Tân yêu thích nhất."),
      h2("1. Cơm Tấm Heo Quay"),
      p("Heo quay thái lát mỏng ăn kèm cơm tấm, dưa chua, chả trứng và nước mắm pha. Đây là combo được order nhiều nhất tại quán."),
      h2("2. Bún Heo Quay"),
      p("Bún tươi chan nước dùng xương hầm, ăn kèm heo quay thái miếng, rau sống và tương hoisin. Thanh mát mà vẫn đậm đà."),
      h2("3. Vịt Quay Chấm Tương Gừng"),
      p("Vịt quay thái chặt, ăn kèm tương gừng và hành phi. Đây là cách thưởng thức truyền thống nhất của người miền Nam."),
      h2("4. Gà Quay Chặt Muối Tiêu Chanh"),
      p("Gà quay chặt miếng vừa ăn, rắc muối tiêu và vắt chanh tươi. Đơn giản nhưng cực kỳ ngon miệng."),
      h2("5. Cháo Heo Quay"),
      p("Cháo trắng nấu từ gạo tẻ, ăn kèm heo quay thái nhỏ, hành lá, tiêu và gừng thái sợi. Món ăn sáng lý tưởng."),
      h2("6–10. Các Món Khác"),
      ul([
        "Bánh mì kẹp heo quay — vỏ bánh giòn kết hợp thịt quay đậm vị",
        "Hủ tiếu vịt quay — nước dùng ngọt thanh, vịt mềm thơm",
        "Phở gà quay — biến tấu độc đáo của phở truyền thống",
        "Mì vằn thắn vịt quay — đậm vị Hoa-Việt",
        "Xôi heo quay — xôi nếp dẻo ăn kèm heo quay và đồ chua",
      ]),
    ])
  },
  {
    id: "cmqpj22hi0005h96wfd8kryzl",
    title: "Cách Ăn Heo Quay Ngon — Những Kết Hợp Không Thể Bỏ Qua",
    seoDescription: "Hướng dẫn cách ăn heo quay ngon nhất với các loại rau sống, nước chấm và món ăn kèm phù hợp. Bí quyết thưởng thức heo quay chuẩn từ Heo Quay Bình Tân.",
    content: makeContent([
      p("Heo quay ngon không chỉ đến từ cách chế biến mà còn từ cách thưởng thức. Ăn heo quay đúng cách sẽ giúp bạn cảm nhận trọn vẹn hương vị của món ăn đặc biệt này."),
      h2("Rau Sống Ăn Kèm"),
      ul([
        "Dưa leo thái lát — thanh mát, cân bằng vị béo của da heo",
        "Cà chua — vị chua nhẹ làm tăng hương vị",
        "Rau thơm: húng quế, ngò gai — tăng mùi thơm tự nhiên",
        "Giá đỗ — thêm độ giòn và thanh mát",
      ]),
      h2("Nước Chấm Phù Hợp"),
      p("Mỗi loại quay có nước chấm đặc trưng riêng: heo quay chấm tương hoisin hoặc nước mắm tỏi ớt; gà quay chấm muối tiêu chanh; vịt quay chấm tương gừng hoặc sốt mận."),
      h2("Cách Chặt Và Thái"),
      p("Heo quay nên chặt khi còn nóng để da không bị mềm. Thái miếng vừa ăn khoảng 2–3cm, đảm bảo mỗi miếng đều có cả da, mỡ và thịt để cảm nhận đầy đủ hương vị."),
      h2("Thời Điểm Ăn Ngon Nhất"),
      p("Heo quay ngon nhất khi ăn trong vòng 2 tiếng sau khi ra lò. Da còn giòn, thịt còn ấm, gia vị còn đậm đà. Tại Heo Quay Bình Tân, chúng tôi luôn chuẩn bị theo đặt hàng để đảm bảo sản phẩm tươi nhất đến tay khách."),
    ])
  },
  {
    id: "cmqpj300s0007h96wtl0jh3bh",
    title: "Heo Quay Trong Văn Hóa Ẩm Thực Việt Nam — Từ Cúng Đình Đến Tiệc Cưới",
    seoDescription: "Khám phá ý nghĩa văn hóa của heo quay trong đời sống người Việt — từ lễ vật cúng đình, tiệc cưới đến mâm cỗ gia đình ngày tết.",
    content: makeContent([
      p("Heo quay không chỉ là món ăn ngon mà còn mang giá trị văn hóa sâu sắc trong đời sống người Việt. Từ bàn thờ cúng tế đến bàn tiệc cưới hỏi, heo quay luôn giữ vị trí trang trọng đặc biệt."),
      h2("Heo Quay Trong Lễ Cúng"),
      p("Theo phong tục truyền thống, heo quay nguyên con là lễ vật không thể thiếu trong các buổi cúng đình, cúng thần hoàng, lễ khai trương và mừng tân gia. Màu vàng óng của da heo quay tượng trưng cho sự thịnh vượng và may mắn."),
      h2("Heo Quay Trong Đám Cưới"),
      p("Ở miền Nam, heo quay là món bắt buộc trong tiệc cưới, đặc biệt là trong mâm quả đám hỏi. Số lượng heo quay trong đám cưới thường phản ánh sự sang trọng và thành ý của nhà trai."),
      h2("Heo Quay Ngày Tết"),
      p("Những ngày Tết Nguyên Đán, heo quay xuất hiện trên hầu hết bàn thờ gia tiên và mâm cỗ ngày tết. Đây là cách người Việt bày tỏ lòng biết ơn với tổ tiên và cầu mong năm mới sung túc, đủ đầy."),
      h2("Heo Quay Bình Tân — Phục Vụ Mọi Dịp"),
      p("Hiểu được ý nghĩa văn hóa đặc biệt này, Heo Quay Bình Tân cung cấp dịch vụ đặt heo quay nguyên con cho mọi dịp lễ, cúng, cưới hỏi với chất lượng ổn định và giao hàng đúng giờ."),
    ])
  },
  {
    id: "cmqpj30ls0009h96wg2hmhiha",
    title: "Cao Điểm Đặt Heo Quay — Những Dịp Nào Nên Đặt Trước",
    seoDescription: "Những dịp lễ, tết nào cần đặt heo quay trước? Lịch cao điểm và lưu ý khi đặt hàng tại Heo Quay Bình Tân để không bị lỡ.",
    content: makeContent([
      p("Heo quay luôn được đặt nhiều vào các dịp lễ tết và sự kiện đặc biệt. Để đảm bảo có heo quay đúng ngày, bạn cần biết những thời điểm cao điểm và đặt hàng trước kịp thời."),
      h2("Các Dịp Cao Điểm Trong Năm"),
      ul([
        "Tết Nguyên Đán (tháng 1–2): đặt trước ít nhất 1–2 tuần",
        "Rằm tháng Giêng: đặt trước 3–5 ngày",
        "Thanh Minh (tháng 3 âm lịch): đặt trước 1 tuần",
        "Tháng Cô Hồn (tháng 7 âm lịch): đặt trước 3–5 ngày",
        "Cuối năm (tháng 11–12): mùa cưới và tất niên, đặt trước 1–2 tuần",
      ]),
      h2("Lưu Ý Khi Đặt Hàng"),
      p("Khi đặt hàng, vui lòng cung cấp: ngày giờ cần nhận hàng, số lượng, trọng lượng mong muốn và địa chỉ giao hàng. Chúng tôi sẽ xác nhận đơn và liên hệ lại trong vòng 30 phút."),
      h2("Chính Sách Đặt Cọc"),
      p("Đối với đơn hàng từ 2 con trở lên hoặc đặt vào dịp lễ tết, chúng tôi yêu cầu đặt cọc 30–50% để đảm bảo nguyên liệu. Số tiền còn lại thanh toán khi nhận hàng."),
      h2("Liên Hệ Đặt Hàng"),
      p("Gọi điện hoặc nhắn Zalo trực tiếp để đặt hàng nhanh nhất. Heo Quay Bình Tân phục vụ 7 ngày/tuần và luôn ưu tiên đảm bảo đủ hàng cho khách đã đặt trước."),
    ])
  },
  {
    id: "cmqpjbjrq000bh96wzisd8mf9",
    title: "Cháo Heo Quay — Món Ăn Sáng Đậm Đà Từ Heo Quay Thừa",
    seoDescription: "Cách nấu cháo heo quay thơm ngon từ phần heo quay còn dư. Biến tấu thú vị và tiết kiệm cho bữa sáng cả gia đình.",
    content: makeContent([
      p("Sau bữa tiệc, còn dư lại ít heo quay? Đừng bỏ phí — hãy nấu một nồi cháo heo quay thơm ngon để thưởng thức buổi sáng hôm sau. Đây là cách tận dụng thông minh được nhiều gia đình yêu thích."),
      h2("Nguyên Liệu Cần Chuẩn Bị"),
      ul([
        "200–300g heo quay còn lại, thái nhỏ",
        "1 chén gạo tẻ, vo sạch",
        "Xương heo (nếu có) để nấu nước dùng",
        "Gừng thái sợi, hành lá thái nhỏ",
        "Tiêu, muối, nước mắm",
        "Dầu mè để dậy mùi",
      ]),
      h2("Cách Nấu"),
      ol([
        "Nấu xương heo với nước trong 1–2 tiếng để có nước dùng ngọt. Nếu không có xương, dùng nước lọc thêm hạt nêm.",
        "Cho gạo đã vo vào nước dùng sôi, khuấy đều tay để cháo không bị cháy đáy.",
        "Nấu lửa nhỏ khoảng 30–40 phút đến khi gạo nở mềm.",
        "Nêm muối, nước mắm vừa miệng.",
        "Múc cháo ra tô, cho heo quay thái nhỏ lên trên.",
        "Rắc gừng sợi, hành lá, tiêu và vài giọt dầu mè.",
      ]),
      h2("Mẹo Để Cháo Ngon Hơn"),
      p("Heo quay cho vào cháo khi ăn chứ không nấu chung — da sẽ giữ được độ giòn nhất định. Cháo heo quay ngon nhất khi ăn nóng, kèm quẩy (dầu cháo quẩy) giòn."),
    ])
  },
  {
    id: "cmqpjbklg000dh96w305qtui1",
    title: "Heo Quay Và Các Món Ăn Kèm Truyền Thống Miền Nam",
    seoDescription: "Khám phá các món ăn kèm truyền thống với heo quay tại miền Nam: dưa cải, củ kiệu, bánh hỏi, bún và nhiều hơn nữa.",
    content: makeContent([
      p("Heo quay miền Nam thường được thưởng thức với nhiều món ăn kèm đặc trưng, tạo nên sự hài hòa hoàn hảo giữa vị béo giòn của da heo và sự thanh mát của rau củ chua ngọt."),
      h2("Bánh Hỏi"),
      p("Bánh hỏi ăn kèm heo quay là combo cực phổ biến tại miền Nam. Bánh hỏi mềm mịn, dai dai kết hợp với heo quay giòn rụm và chút hành phi thơm lừng tạo nên hương vị khó cưỡng."),
      h2("Dưa Cải Muối"),
      p("Vị chua mặn của dưa cải muối là thứ không thể thiếu khi ăn heo quay. Độ chua của dưa cải giúp giảm cảm giác ngán béo, kích thích vị giác và làm tăng hương vị tổng thể."),
      h2("Củ Kiệu Chua Ngọt"),
      p("Củ kiệu ngâm chua ngọt là món ăn kèm truyền thống ngày Tết nhưng cũng rất hợp khi ăn cùng heo quay. Vị chua ngọt giòn của củ kiệu cân bằng hoàn hảo với vị béo đậm của thịt quay."),
      h2("Bún Tươi"),
      p("Bún tươi ăn kèm heo quay chấm nước mắm tỏi ớt là cách ăn phổ biến nhất. Bún thanh mát, nhẹ bụng, giúp bữa ăn không bị quá nặng nề dù thịt quay vốn đã khá béo."),
      h2("Cơm Tấm"),
      p("Cơm tấm heo quay là món ăn đường phố biểu tượng của Sài Gòn. Cơm tấm dẻo, hơi dính kết hợp với heo quay, chả, bì và dưa chua tạo nên một bữa ăn hoàn chỉnh và đậm đà."),
    ])
  },
  {
    id: "cmqpjbl65000fh96wd9r014cm",
    title: "Nghệ Thuật Chặt Heo Quay — Kỹ Thuật Chuẩn Cho Miếng Đẹp",
    seoDescription: "Hướng dẫn kỹ thuật chặt heo quay đúng cách để có miếng đẹp, da không bị vỡ. Bí quyết từ đầu bếp chuyên nghiệp tại Heo Quay Bình Tân.",
    content: makeContent([
      p("Chặt heo quay tưởng đơn giản nhưng thực ra là một kỹ thuật đòi hỏi sự khéo léo và kinh nghiệm. Chặt không đúng cách sẽ làm da bị vỡ vụn, mất đi sự nguyên vẹn và kém thẩm mỹ."),
      h2("Dụng Cụ Cần Thiết"),
      ul([
        "Dao chặt nặng, sắc bén — không dùng dao thái thông thường",
        "Thớt gỗ dày và chắc chắn",
        "Khăn sạch để lau dao giữa các nhát chặt",
      ]),
      h2("Kỹ Thuật Chặt Cơ Bản"),
      p("Đặt heo quay nằm nghiêng trên thớt. Dùng dao chặt dứt khoát, một nhát mạnh và chính xác — tránh chặt nhiều nhát vì sẽ làm da bị dập vỡ. Lực chặt cần đủ mạnh để đứt xương nhưng không quá mạnh làm da nát."),
      h2("Thứ Tự Chặt"),
      ol([
        "Tách đầu ra trước",
        "Chặt dọc sống lưng chia đôi con heo",
        "Chặt ngang thành từng khoanh vừa ăn khoảng 2–3cm",
        "Sắp xếp lại theo hình dạng ban đầu để trình bày đẹp",
      ]),
      h2("Nhiệt Độ Tốt Nhất Để Chặt"),
      p("Chặt heo quay khi còn ấm nóng (trong vòng 30 phút sau khi ra lò) là tốt nhất. Khi nguội, da và mỡ sẽ cứng lại, khó chặt và dễ bị vỡ vụn. Tại Heo Quay Bình Tân, chúng tôi luôn chặt heo ngay trước khi giao để khách nhận được sản phẩm ở trạng thái tốt nhất."),
    ])
  },
  {
    id: "cmqpjcgtv000hh96wqu2inwnw",
    title: "Bánh Hỏi Thịt Quay — Combo Ngon Khó Cưỡng Của Miền Nam",
    seoDescription: "Hướng dẫn làm bánh hỏi thịt quay chuẩn vị miền Nam. Cách chọn bánh hỏi ngon, cách ăn kèm với heo quay, gà quay và nước chấm phù hợp.",
    content: makeContent([
      p("Bánh hỏi thịt quay là một trong những combo ẩm thực phổ biến nhất tại miền Nam, đặc biệt trong các dịp giỗ chạp, tiệc tùng. Sự kết hợp giữa bánh hỏi mềm dẻo và thịt quay giòn rụm tạo nên hương vị độc đáo khó quên."),
      h2("Chọn Bánh Hỏi Ngon"),
      p("Bánh hỏi ngon phải mềm, dai vừa phải, không bị nát khi gắp. Màu trắng trong, sợi bánh đều và không bị dính cục. Bánh hỏi Bình Định và bánh hỏi Phan Thiết được đánh giá ngon nhất."),
      h2("Hành Phi Thơm Lừng"),
      p("Hành phi là linh hồn của bánh hỏi thịt quay. Hành lá thái nhỏ phi với dầu đến khi vàng đều, thêm chút muối và đường. Rưới hành phi nóng lên bánh hỏi ngay trước khi ăn."),
      h2("Thịt Quay Phù Hợp"),
      p("Heo quay là lựa chọn phổ biến nhất, nhưng gà quay hay vịt quay cũng rất ngon khi ăn kèm bánh hỏi. Thịt quay nên thái lát mỏng vừa ăn, xếp đẹp lên trên bánh hỏi."),
      h2("Nước Chấm"),
      p("Nước mắm pha chua ngọt với tỏi ớt là nước chấm truyền thống cho bánh hỏi thịt quay. Tỷ lệ chuẩn: 3 nước mắm — 2 đường — 5 nước lọc — 1 chanh, thêm tỏi và ớt theo khẩu vị."),
    ])
  },
  {
    id: "cmqpjci4v000jh96w28vo61gh",
    title: "Nem Cuốn Thịt Quay — Phiên Bản Sáng Tạo Từ Heo Quay Bình Tân",
    seoDescription: "Cách làm nem cuốn thịt quay thơm ngon, thanh mát. Cuốn nem với heo quay, rau sống tươi và chấm tương hoisin — món ăn nhẹ hoàn hảo cho mọi dịp.",
    content: makeContent([
      p("Nem cuốn thịt quay là biến tấu sáng tạo kết hợp giữa nem cuốn truyền thống Việt Nam và heo quay thơm ngon. Đây là món ăn nhẹ, thanh mát, rất phù hợp cho bữa trưa hoặc bữa tiệc đứng."),
      h2("Nguyên Liệu Cuốn"),
      ul([
        "Bánh tráng gạo mỏng, ngâm nước ấm cho mềm",
        "Heo quay thái lát mỏng",
        "Bún tươi sợi nhỏ",
        "Rau sống: xà lách, húng quế, rau thơm, dưa leo",
        "Cà rốt bào sợi",
        "Tôm luộc (tùy chọn)",
      ]),
      h2("Kỹ Thuật Cuốn"),
      p("Trải bánh tráng lên khăn ẩm. Xếp rau sống, bún, heo quay và cà rốt vào 1/3 bánh tráng. Cuốn chặt tay, gấp hai mép vào rồi cuốn tiếp cho chắc. Cắt chéo để lộ phần nhân bên trong khi bày."),
      h2("Nước Chấm Kèm Theo"),
      p("Tương hoisin pha với tương đen và đậu phộng rang giã nhỏ là nước chấm truyền thống cho nem cuốn. Thêm vài lát ớt tươi để tăng vị cay nhẹ. Nước chấm chua ngọt kiểu miền Nam cũng rất hợp với phiên bản này."),
      h2("Biến Tấu Thú Vị"),
      p("Thay heo quay bằng gà quay hoặc vịt quay để có hương vị khác. Thêm bơ lát vào nem cuốn để tạo vị béo ngậy bất ngờ — xu hướng mới đang được giới trẻ yêu thích."),
    ])
  },
  {
    id: "cmqq6ilku0001h9mczddxmnkk",
    title: "Gà Quay Mật Ong — Da Vàng Giòn, Thơm Lừng Khó Cưỡng",
    seoDescription: "Bí quyết làm gà quay mật ong da vàng óng, giòn rụm, thịt mềm ngọt. Công thức chuẩn và các mẹo để có màu mật ong đẹp không bị cháy.",
    content: makeContent([
      p("Gà quay mật ong nổi tiếng với lớp da vàng óng đặc trưng, vị ngọt thơm tự nhiên của mật ong kết hợp với thịt gà mềm ngọt bên trong. Đây là một trong những món gà quay được yêu thích nhất tại Heo Quay Bình Tân."),
      h2("Chọn Gà Phù Hợp"),
      p("Gà ta (gà thả vườn) từ 1.2–1.8 kg cho kết quả tốt nhất: da mỏng, thịt chắc và thơm hơn gà công nghiệp. Gà quá lớn thịt sẽ không đều chín, quá nhỏ thì không kinh tế."),
      h2("Công Thức Nước Tẩm Mật Ong"),
      ul([
        "3 muỗng mật ong nguyên chất",
        "2 muỗng nước tương",
        "1 muỗng dầu hào",
        "1 muỗng tỏi băm",
        "½ muỗng ngũ vị hương",
        "Tiêu xay, muối vừa đủ",
      ]),
      h2("Bí Quyết Màu Vàng Đẹp"),
      p("Quét nước mật ong lên gà 2–3 lần trong quá trình quay, mỗi lần cách nhau 15 phút. Lần cuối quét trước khi tắt lò 5 phút để màu lên đẹp mà không bị cháy. Nếu thấy da bắt đầu cháy, che phủ bằng giấy bạc và hạ nhiệt độ."),
      h2("Nhiệt Độ Và Thời Gian"),
      p("Quay ở 180°C trong 45–60 phút tùy kích cỡ gà. Dùng que xiên đâm vào phần đùi, nếu nước chảy ra trong (không hồng) là gà đã chín. Để gà nghỉ 5–10 phút trước khi chặt để nước thịt phân bố đều."),
    ])
  },
  {
    id: "cmqq6ilzr0003h9mcov9kptqj",
    title: "Gà Quay Lu Sài Gòn — Giòn Da Không Cần Lò Nướng",
    seoDescription: "Cách làm gà quay lu truyền thống Sài Gòn giòn da thơm ngon mà không cần lò nướng. Kỹ thuật quay lu bằng than độc đáo chỉ có ở miền Nam.",
    content: makeContent([
      p("Gà quay lu là đặc sản độc đáo của Sài Gòn — gà được quay trong chiếc lu đất nung bằng than hoa, tạo ra hương khói đặc trưng không thể có được từ lò nướng thông thường. Đây là kỹ thuật quay truyền thống của người Hoa-Việt tại miền Nam."),
      h2("Lu Đất Nung — Dụng Cụ Đặc Biệt"),
      p("Lu đất nung có khả năng giữ nhiệt tốt và tạo ra nhiệt độ đều đặn từ mọi phía. Than hoa cháy bên dưới tạo ra nhiệt từ dưới lên, trong khi thành lu nóng tỏa nhiệt từ xung quanh, giúp gà chín đều và da giòn hoàn hảo."),
      h2("Ướp Gà Kiểu Lu"),
      ul([
        "Muối hột, tiêu đen xay thô",
        "Tỏi, sả băm nhuyễn",
        "Gừng giã nát",
        "Dầu ăn để tạo màu",
        "Ướp ít nhất 4 tiếng hoặc qua đêm",
      ]),
      h2("Kỹ Thuật Quay Lu"),
      p("Treo gà lên móc bên trong lu, đầu gà hướng xuống dưới. Đốt than hoa đặt dưới đáy lu. Đậy nắp kín và quay khoảng 45–60 phút. Hơi nóng tuần hoàn bên trong lu tạo ra hiệu ứng 'quay không khí' làm da giòn tự nhiên mà không cần dầu."),
      h2("Hương Vị Đặc Trưng"),
      p("Điểm khác biệt lớn nhất của gà quay lu so với gà nướng lò là mùi khói than nhẹ nhàng thấm vào thịt. Hương khói này tạo ra chiều sâu hương vị đặc biệt mà bất kỳ ai từng ăn một lần đều không thể quên."),
    ])
  },
  {
    id: "cmqq6im9e0005h9mcamlujsum",
    title: "Bí Quyết Ướp Heo Quay Đậm Vị — Từ Trong Ra Ngoài",
    seoDescription: "Công thức ướp heo quay đậm đà, thơm ngon từ bên trong ra bên ngoài. Tỷ lệ gia vị chuẩn và thời gian ướp tối ưu để có heo quay ngon nhất.",
    content: makeContent([
      p("Ướp gia vị là bước quyết định hương vị của heo quay. Ướp đúng cách, gia vị thấm đều từ trong ra ngoài sẽ tạo ra món heo quay đậm đà, thơm ngon ở mọi miếng thịt."),
      h2("Gia Vị Ướp Bên Trong"),
      ul([
        "Ngũ vị hương: 2 muỗng canh",
        "Tỏi băm: 5–6 tép",
        "Gừng băm: 1 muỗng canh",
        "Nước tương: 3 muỗng canh",
        "Dầu hào: 2 muỗng canh",
        "Rượu trắng: 2 muỗng canh (khử mùi)",
        "Đường: 1 muỗng canh",
        "Muối: 1 muỗng cà phê",
      ]),
      h2("Ướp Ngoài Da"),
      p("Ngoài da chỉ cần muối hột thoa đều để rút nước từ da ra, giúp da khô và giòn hơn sau khi quay. Không cần ướp nhiều gia vị lên da vì sẽ làm da dễ cháy và mất màu đẹp."),
      h2("Thời Gian Ướp"),
      p("Ướp gia vị bên trong ít nhất 6 tiếng, tốt nhất là để qua đêm trong tủ lạnh. Ướp muối ngoài da 2–3 tiếng trước khi quay. Đây là thời gian tối thiểu để gia vị thấm đủ — ướp ít hơn sẽ khiến thịt bên trong nhạt."),
      h2("Kỹ Thuật Ướp Đều"),
      p("Dùng que hoặc đũa đâm nhiều lỗ nhỏ khắp thịt trước khi ướp để gia vị thấm sâu hơn. Xoa bóp gia vị vào thịt thay vì chỉ rưới lên — massage đều giúp gia vị phân bố đồng đều hơn."),
    ])
  },
  {
    id: "cmqq6imj00007h9mc3axy33v5",
    title: "Cơm Tấm Heo Quay — Cách Làm Đúng Vị Sài Gòn",
    seoDescription: "Công thức cơm tấm heo quay đúng chuẩn Sài Gòn với cơm tấm dẻo, heo quay giòn và nước mắm pha chua ngọt. Món ăn đường phố biểu tượng dễ làm tại nhà.",
    content: makeContent([
      p("Cơm tấm heo quay là biểu tượng ẩm thực đường phố Sài Gòn. Sự kết hợp giữa cơm tấm dẻo thơm, heo quay giòn ngon và nước mắm pha đậm đà tạo nên một bữa ăn hoàn chỉnh, đơn giản mà ngon khó cưỡng."),
      h2("Chọn Gạo Tấm Đúng Loại"),
      p("Gạo tấm ngon là loại hạt tấm đều, không có mùi mốc. Gạo tấm Bà Đen hoặc gạo tấm Sóc Trăng được đánh giá cao nhất. Vo gạo nhẹ tay, không vo quá nhiều sẽ làm mất lớp tinh bột tạo độ dẻo."),
      h2("Nấu Cơm Tấm Đúng Cách"),
      p("Tỷ lệ nước gạo tấm: 1 cốc gạo — 1.5 cốc nước. Ít hơn cơm thường vì gạo tấm đã bị vỡ nhỏ, hút nước nhanh hơn. Nấu xong để ủ thêm 10 phút cho cơm tơi đều."),
      h2("Heo Quay Cho Cơm Tấm"),
      p("Heo quay dùng cho cơm tấm nên chọn phần ba chỉ (ba rọi) quay — có đủ nạc, mỡ và da giòn. Thái lát mỏng khoảng 0.5cm, xếp đẹp lên trên cơm."),
      h2("Nước Mắm Pha Cơm Tấm"),
      p("Đây là linh hồn của dĩa cơm tấm: 3 muỗng nước mắm ngon + 2 muỗng đường + 4 muỗng nước ấm + 1 muỗng nước cốt chanh. Khuấy đều cho đường tan, thêm tỏi ớt băm. Nước mắm phải đạt vị cân bằng giữa mặn — ngọt — chua."),
      h2("Các Món Ăn Kèm Truyền Thống"),
      ul([
        "Chả trứng (chả bì): béo ngậy, thơm",
        "Bì heo: sợi mỏng dai, trộn thính thơm",
        "Dưa chua: cà rốt và củ cải ngâm giấm ngọt",
        "Hành phi và mỡ hành",
        "Trứng ốp la (tùy chọn)",
      ]),
    ])
  },
  {
    id: "cmqq6imso0009h9mc2qtjsk3b",
    title: "Vịt Quay Húng Lìu — Đậm Đà Hương Vị Đặc Trưng",
    seoDescription: "Bí quyết làm vịt quay húng lìu thơm ngon, đậm đà hương vị đặc trưng. Gia vị húng lìu tạo mùi thơm độc đáo khó lẫn với bất kỳ loại vịt quay nào khác.",
    content: makeContent([
      p("Vịt quay húng lìu là phiên bản vịt quay đặc trưng của người Việt gốc Hoa, mang hương vị đậm đà, thơm lừng khác biệt hoàn toàn so với vịt quay Bắc Kinh. Chìa khóa của món này nằm ở hỗn hợp gia vị húng lìu độc đáo."),
      h2("Húng Lìu Là Gì?"),
      p("Húng lìu (hay còn gọi là ngũ vị hương đặc biệt) là hỗn hợp các loại gia vị khô gồm hoa hồi, quế chi, đinh hương, hạt tiêu Tứ Xuyên và thảo quả. Mỗi thành phần đóng góp một tầng hương vị riêng, tạo nên mùi thơm phức tạp và đặc trưng."),
      h2("Ướp Vịt Húng Lìu"),
      ul([
        "Húng lìu xay mịn: 2 muỗng canh",
        "Tương hoisin: 3 muỗng canh",
        "Nước tương đen: 2 muỗng canh",
        "Rượu Thiệu Hưng: 2 muỗng canh",
        "Dầu mè: 1 muỗng canh",
        "Đường phèn: 1 muỗng canh",
        "Tỏi và gừng băm nhuyễn",
      ]),
      h2("Kỹ Thuật Quay"),
      p("Ướp vịt từ 8–12 tiếng để húng lìu thấm sâu vào thịt. Treo khô ngoài trời hoặc trong tủ lạnh (có quạt) 4–6 tiếng trước khi quay. Quay ở 190°C khoảng 50–60 phút, quét mật ong pha nước tương lên da 2 lần trong quá trình quay."),
      h2("Hương Vị Thành Phẩm"),
      p("Vịt quay húng lìu khi chín có màu nâu đỏ đẹp, mùi thơm nồng đặc trưng của các loại gia vị. Thịt mềm, thấm đều hương vị, da giòn với lớp sốt bóng đẹp. Ăn kèm với mì sợi hoặc cơm trắng và nước tương gừng."),
    ])
  },
  {
    id: "cmqq6in29000bh9mchobbe6ty",
    title: "Vịt Quay Bắc Kinh Tại Nhà — Hướng Dẫn Chi Tiết Từng Bước",
    seoDescription: "Hướng dẫn chi tiết cách làm vịt quay Bắc Kinh tại nhà da mỏng giòn rụm. Từng bước từ chọn vịt, sơ chế, ướp đến kỹ thuật quay đúng chuẩn.",
    content: makeContent([
      p("Vịt quay Bắc Kinh tưởng phức tạp nhưng hoàn toàn có thể làm tại nhà nếu bạn hiểu đúng kỹ thuật. Hướng dẫn chi tiết này sẽ giúp bạn tự tay làm ra món vịt quay da mỏng giòn rụm chuẩn vị nhà hàng."),
      h2("Bước 1: Chuẩn Bị Vịt"),
      p("Chọn vịt Bắc Kinh từ 2–2.5 kg, làm sạch lông, loại bỏ nội tạng. Dùng dây buộc cổ vịt, thổi không khí vào giữa da và thịt bằng cách luồn ống hút hay bơm nhỏ vào qua cổ. Đây là bước bắt buộc để có da giòn."),
      h2("Bước 2: Chần Nước Sôi"),
      p("Đặt vịt vào rổ, dội nước sôi đều khắp bề mặt da 2–3 lần. Bước này giúp se da, lỗ chân lông co lại, sau khi quay da sẽ giòn hơn. Thấm khô bằng khăn sạch."),
      h2("Bước 3: Tẩm Nước Sốt"),
      p("Pha hỗn hợp: 3 muỗng mật ong + 2 muỗng giấm trắng + 1 muỗng nước tương. Quét đều lên toàn bộ bề mặt da, để khô rồi quét thêm lần 2. Treo khô trong tủ lạnh (không đậy) ít nhất 8 tiếng, tốt nhất là 24 tiếng."),
      h2("Bước 4: Quay"),
      p("Làm nóng lò ở 220°C trong 15 phút. Cho vịt vào quay 15 phút đầu ở 220°C để da phồng giòn, sau đó hạ xuống 180°C và tiếp tục quay 35–40 phút. Lật vịt một lần ở giữa quá trình."),
      h2("Bước 5: Nghỉ Và Chặt"),
      p("Lấy vịt ra để nghỉ 10 phút trước khi chặt. Tách da ra ăn trước với bánh tráng mỏng, hành lá, dưa leo và tương hoisin — đây là cách thưởng thức truyền thống của vịt quay Bắc Kinh."),
    ])
  },
  {
    id: "cmqqb5yft0001h9wmhohfzql4",
    title: "Tổng Hợp 5 Loại Nước Chấm Ngon Nhất Cho Món Quay",
    seoDescription: "5 loại nước chấm ngon nhất ăn kèm heo quay, gà quay, vịt quay. Công thức chi tiết và cách pha chuẩn vị nhà hàng cho từng loại nước chấm.",
    content: makeContent([
      p("Nước chấm là yếu tố quan trọng không kém gì bản thân món quay. Chọn đúng nước chấm sẽ làm tăng hương vị lên nhiều lần. Dưới đây là 5 loại nước chấm phù hợp nhất cho các món quay."),
      h2("1. Nước Mắm Tỏi Ớt"),
      p("Phổ biến nhất và dễ làm nhất: 3 nước mắm + 2 đường + 5 nước lọc + 1 chanh + tỏi ớt băm. Hợp với tất cả các loại quay, đặc biệt là heo quay và gà quay."),
      h2("2. Tương Hoisin Mè"),
      p("Trộn tương hoisin với dầu mè, thêm chút nước ấm cho lỏng vừa. Rắc đậu phộng rang lên trên. Đây là nước chấm truyền thống cho vịt quay Bắc Kinh và gà quay kiểu Hoa."),
      h2("3. Muối Tiêu Chanh"),
      p("Đơn giản nhất: muối hột + tiêu đen xay thô + vắt chanh tươi. Ăn kèm gà quay, đặc biệt là gà quay muối. Vị mặn-cay-chua tự nhiên làm nổi bật vị ngọt của thịt gà."),
      h2("4. Sốt Mận"),
      p("Nấu mận muối với đường, gừng và một chút nước tương thành sốt sệt. Lọc bỏ hạt mận. Đây là nước chấm cổ điển cho vịt quay kiểu Quảng Đông, vị chua ngọt độc đáo."),
      h2("5. Tương Gừng"),
      p("Gừng tươi bào nhuyễn trộn với dầu ăn nóng và muối. Thêm chút đường và nước tương nhạt. Tương gừng có hương vị tươi mát, giảm mùi tanh của vịt và tôn lên vị ngọt tự nhiên của thịt."),
    ])
  },
  {
    id: "cmqqb5yuy0003h9wm74wqt7jt",
    title: "Bí Quyết Pha Nước Sốt Mận — Chấm Vịt Quay Chuẩn Vị Nhà Hàng",
    seoDescription: "Công thức pha nước sốt mận chuẩn vị nhà hàng để chấm vịt quay. Bí quyết chọn mận ngon và tỷ lệ pha đúng để có sốt sệt mịn màng và đậm đà.",
    content: makeContent([
      p("Sốt mận là nước chấm không thể thiếu khi ăn vịt quay Quảng Đông hay vịt quay Bắc Kinh. Một bát sốt mận ngon sẽ làm tăng hương vị của vịt quay lên gấp bội. Đây là công thức chuẩn nhà hàng mà Heo Quay Bình Tân chia sẻ."),
      h2("Chọn Mận Đúng Loại"),
      p("Dùng mận muối (Ô mai mận) hoặc mận khô Trung Quốc. Mận ngon có màu đen bóng, thịt dày, vị chua ngọt cân bằng và không quá mặn. Tránh chọn mận có mùi lạ hoặc quá cứng."),
      h2("Nguyên Liệu"),
      ul([
        "200g mận muối/mận khô",
        "3 muỗng canh đường phèn",
        "2 muỗng canh nước tương nhạt",
        "1 muỗng cà phê gừng tươi băm nhuyễn",
        "1 muỗng canh giấm trắng",
        "200ml nước lọc",
      ]),
      h2("Cách Nấu"),
      ol([
        "Rửa sạch mận, bỏ vào nồi cùng nước lọc",
        "Nấu sôi lửa nhỏ 20–25 phút đến khi mận mềm nát",
        "Dầm mận cho nát, lọc qua rây loại bỏ hạt và xơ",
        "Cho phần sốt trở lại nồi, thêm đường phèn và khuấy đều",
        "Nấu thêm 10 phút đến khi sốt sệt vừa ý",
        "Nêm nước tương, gừng, giấm — nếm thử và điều chỉnh",
      ]),
      h2("Bảo Quản"),
      p("Sốt mận sau khi nguội có thể bảo quản trong lọ thủy tinh kín ở ngăn mát tủ lạnh được 2–3 tuần. Hâm nóng lại trước khi dùng và thêm chút nước nếu sốt quá đặc."),
    ])
  },
]

async function main() {
  console.log(`Cập nhật ${posts.length} bài...`)
  for (const post of posts) {
    await db.post.update({
      where: { id: post.id },
      data: {
        title: post.title,
        seoDescription: post.seoDescription,
        content: post.content,
      }
    })
    console.log(`✓ ${post.title}`)
  }
  console.log("Xong batch 1!")
}

main().catch(console.error).finally(() => db.$disconnect())
