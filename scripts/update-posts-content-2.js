const { PrismaClient } = require("@prisma/client")
const db = new PrismaClient()

function makeContent(blocks) {
  return { time: Date.now(), blocks, version: "2.28.2" }
}
function p(text) { return { type: "paragraph", data: { text } } }
function h2(text) { return { type: "header", data: { text, level: 2 } } }
function ul(items) { return { type: "list", data: { style: "unordered", items } } }
function ol(items) { return { type: "list", data: { style: "ordered", items } } }

const posts = [
  {
    id: "cmqqb5z4k0005h9wmiczajjq0",
    title: "Nguồn Gốc Heo Quay — Từ Lễ Vật Cúng Đình Đến Bàn Ăn Người Việt",
    seoDescription: "Tìm hiểu nguồn gốc lịch sử của heo quay trong văn hóa Việt-Hoa, từ nghi lễ cúng tế cổ xưa đến vị trí không thể thiếu trên bàn ăn người Việt hiện đại.",
    content: makeContent([
      p("Heo quay có lịch sử hàng nghìn năm gắn liền với văn hóa ẩm thực Trung Hoa và Việt Nam. Từ những con heo quay nguyên con dâng lên thần linh trong các nghi lễ cổ xưa, món ăn này đã trở thành một phần không thể tách rời của đời sống người Việt."),
      h2("Nguồn Gốc Từ Trung Hoa"),
      p("Heo quay (Siu Yuk trong tiếng Quảng Đông) xuất hiện trong ẩm thực Trung Hoa từ thời nhà Chu (1046–256 TCN). Ban đầu chỉ được dùng trong các buổi tế lễ hoàng gia và cúng thần linh. Theo thời gian, món ăn này lan rộng ra dân gian và trở thành biểu tượng của sự sung túc."),
      h2("Du Nhập Vào Việt Nam"),
      p("Heo quay du nhập vào Việt Nam qua cộng đồng người Hoa (Hoa kiều) định cư tại các đô thị miền Nam từ thế kỷ 17–18. Người Hoa mang theo công thức và kỹ thuật quay truyền thống, rồi dần thích nghi với nguyên liệu và khẩu vị địa phương."),
      h2("Biến Thể Việt Nam"),
      p("Người Việt đã sáng tạo ra nhiều biến thể riêng: heo quay miền Tây với sả gừng, heo quay theo phong cách Huế với gia vị cung đình, hay heo quay Sài Gòn ăn kèm cơm tấm. Mỗi vùng miền có nét đặc trưng riêng tạo nên sự phong phú đa dạng."),
      h2("Heo Quay Bình Tân Ngày Nay"),
      p("Kế thừa và phát huy truyền thống đó, Heo Quay Bình Tân giữ gìn công thức gia truyền kết hợp với kỹ thuật hiện đại, mang đến cho khách hàng những con heo quay chất lượng cao mang đậm hương vị truyền thống."),
    ])
  },
  {
    id: "cmqqb5ze60007h9wmdvgea6t7",
    title: "Vịt Quay Bắc Kinh — 600 Năm Lịch Sử Của Món Ăn Hoàng Gia",
    seoDescription: "Khám phá lịch sử 600 năm của vịt quay Bắc Kinh từ cung đình hoàng gia đến bàn ăn toàn thế giới. Những điều thú vị ít người biết về món ăn nổi tiếng này.",
    content: makeContent([
      p("Vịt quay Bắc Kinh là một trong những món ăn nổi tiếng nhất thế giới với lịch sử hơn 600 năm. Từ bàn tiệc hoàng gia nhà Minh đến các nhà hàng cao cấp trên toàn cầu, món ăn này đã chinh phục khẩu vị của hàng tỷ người."),
      h2("Khởi Nguồn Từ Cung Đình Nhà Minh"),
      p("Vịt quay Bắc Kinh được ghi nhận lần đầu vào thời nhà Minh (1368–1644). Các đầu bếp hoàng cung đã phát triển kỹ thuật thổi không khí vào da vịt và quay bằng củi ăn quả để tạo ra lớp da đặc trưng mỏng giòn và màu sắc đẹp."),
      h2("Kỹ Thuật Quay Bằng Lò Mở"),
      p("Phương pháp truyền thống dùng lò mở (gualu) với củi cây táo, lê hoặc đào — những loại gỗ ăn quả tạo ra hương khói nhẹ và đặc biệt. Vịt được treo trong lò, quay đều bằng móc trong suốt 40–60 phút để da chín đều và giòn."),
      h2("Kỹ Thuật Quay Lò Kín"),
    p("Phương pháp thứ hai dùng lò kín (menlu), vịt được đặt nằm trong lò. Ít dùng gỗ ăn quả hơn nhưng vẫn tạo ra lớp da đẹp. Nhiều nhà hàng hiện đại ở Việt Nam áp dụng phương pháp này vì dễ kiểm soát nhiệt độ hơn."),
      h2("Vịt Quay Bắc Kinh Tại Heo Quay Bình Tân"),
      p("Áp dụng kỹ thuật truyền thống kết hợp với nguyên liệu tươi địa phương, vịt quay Bắc Kinh tại Heo Quay Bình Tân giữ nguyên tinh hoa hàng trăm năm nhưng phù hợp hơn với khẩu vị người Việt Nam hiện đại."),
    ])
  },
  {
    id: "cmqqb5znv0009h9wmazscu7vu",
    title: "Cách Chọn Heo, Gà, Vịt Tươi Ngon — Bí Quyết Từ Đầu Bếp Chuyên Nghiệp",
    seoDescription: "Bí quyết chọn heo, gà, vịt tươi ngon từ đầu bếp chuyên nghiệp. Cách phân biệt thịt tươi và không tươi, những dấu hiệu nhận biết nhanh khi đi chợ.",
    content: makeContent([
      p("Chọn nguyên liệu tươi ngon là nền tảng của mọi món ăn ngon. Đội ngũ đầu bếp Heo Quay Bình Tân chia sẻ bí quyết chọn heo, gà, vịt chuẩn chất lượng mà họ áp dụng mỗi ngày."),
      h2("Chọn Heo Tươi"),
      ul([
        "Da trắng hồng, không có vết bầm hay đốm đen",
        "Thịt màu hồng tươi, không có mùi hôi",
        "Da mỏng đều, không có vết thương",
        "Ấn vào thịt đàn hồi ngay, không để lại vết lõm",
        "Mỡ màu trắng sáng, không vàng hay xỉn màu",
      ]),
      h2("Chọn Gà Tươi"),
      ul([
        "Da màu vàng nhạt hoặc trắng (tùy giống), không tím tái",
        "Thịt ngực và đùi chắc, không nhão",
        "Mắt gà (nếu còn nguyên con) phải trong, không đục",
        "Không có mùi lạ — mùi tanh nhẹ là bình thường với gà tươi",
        "Gà ta (thả vườn) da mỏng hơn, thịt chắc và thơm hơn gà công nghiệp",
      ]),
      h2("Chọn Vịt Tươi"),
      ul([
        "Da màu trắng ngà, không bầm hay tím",
        "Thịt ức đầy đặn, không bị tóp",
        "Mỡ dưới da màu vàng nhạt đều",
        "Không có mùi tanh quá nồng — cần phân biệt với mùi tanh bình thường của vịt",
        "Chân và mỏ còn mềm, không cứng",
      ]),
      h2("Thời Điểm Mua Tốt Nhất"),
      p("Mua tại chợ sáng sớm (trước 8 giờ) để có thịt tươi nhất. Tránh mua thịt đã để cả ngày trong điều kiện không đảm bảo lạnh. Tại Heo Quay Bình Tân, chúng tôi chỉ nhập nguyên liệu mỗi sáng và chế biến trong ngày để đảm bảo độ tươi ngon tối đa."),
    ])
  },
  {
    id: "cmqqb5zvt000bh9wm49sijeni",
    title: "Gia Vị Thiết Yếu Cho Các Món Quay — Cách Chọn Và Bảo Quản",
    seoDescription: "Danh sách gia vị thiết yếu cho heo quay, gà quay, vịt quay. Cách chọn gia vị chất lượng và bảo quản đúng cách để giữ được hương vị tốt nhất.",
    content: makeContent([
      p("Gia vị là linh hồn của các món quay. Dùng đúng loại gia vị, đúng liều lượng và bảo quản đúng cách sẽ tạo ra sự khác biệt lớn trong hương vị thành phẩm. Đây là danh sách gia vị thiết yếu mà Heo Quay Bình Tân luôn dùng."),
      h2("Ngũ Vị Hương"),
      p("Gồm hoa hồi, đinh hương, quế chi, hạt tiêu Tứ Xuyên và thảo quả. Đây là gia vị không thể thiếu trong các món quay kiểu Hoa. Mua ngũ vị hương nguyên hạt về tự xay sẽ thơm hơn nhiều so với bột xay sẵn."),
      h2("Tương Hoisin"),
      p("Tương đen đặc làm từ đậu nành lên men, ngọt và thơm. Dùng để ướp và làm nước chấm. Chọn loại tương Hoisin có màu nâu đen đậm, mùi thơm ngào ngạt — tránh loại màu quá đen hoặc có mùi chua."),
      h2("Dầu Hào"),
      p("Tăng vị umami sâu cho món quay. Chọn dầu hào cao cấp có hàm lượng hàu thật cao. Bảo quản trong tủ lạnh sau khi mở nắp."),
      h2("Rượu Thiệu Hưng"),
      p("Rượu gạo lên men truyền thống của Trung Hoa, dùng để khử mùi và tăng hương thơm. Nếu không có, có thể thay bằng rượu trắng Việt Nam hoặc sake Nhật."),
      h2("Cách Bảo Quản Gia Vị"),
      ul([
        "Gia vị khô (ngũ vị hương, hoa hồi): lọ kín tránh ẩm, dùng trong 6 tháng",
        "Tương, nước tương, dầu hào: tủ lạnh sau khi mở, dùng trong 3 tháng",
        "Gừng tươi: bọc giấy ẩm để ngăn mát, dùng trong 2–3 tuần",
        "Tỏi: nơi thoáng mát, khô ráo, tránh ánh nắng trực tiếp",
      ]),
    ])
  },
  {
    id: "cmqqbg6ub0001h93p3p3uftt9",
    title: "Heo Quay Sữa — Da Mỏng Giòn Tan, Thịt Mềm Ngọt Đặc Trưng",
    seoDescription: "Tìm hiểu về heo quay sữa — món ăn xa xỉ với da mỏng giòn tan và thịt mềm ngọt đặc trưng. Điểm khác biệt giữa heo quay sữa và heo quay thường.",
    content: makeContent([
      p("Heo quay sữa (cochinillo asado theo tiếng Tây Ban Nha, hay Suckling pig) là phiên bản cao cấp nhất của món heo quay — dùng heo còn đang bú sữa, chưa ăn thức ăn cứng. Da cực mỏng, giòn tan như giấy, thịt mềm ngọt như thịt gà, không có mùi mỡ."),
      h2("Heo Sữa Là Gì?"),
      p("Heo sữa là heo con từ 2–6 tuần tuổi, nặng 3–8 kg, chưa cai sữa mẹ. Vì chỉ ăn sữa nên thịt không có mùi hôi, mỡ rất ít và phân bố đều, da mỏng như tờ giấy — đây là điều không thể có ở heo lớn."),
      h2("Sự Khác Biệt Với Heo Quay Thường"),
      ul([
        "Da mỏng hơn nhiều — giòn tan ngay khi cắn vào",
        "Thịt mềm ngọt tự nhiên, không cần ướp nhiều gia vị",
        "Không có mùi hôi của thịt heo trưởng thành",
        "Màu vàng đẹp hơn và đồng đều hơn sau khi quay",
        "Thời gian quay ngắn hơn (30–45 phút thay vì 2–3 tiếng)",
      ]),
      h2("Cách Quay Heo Sữa"),
      p("Do da mỏng, heo sữa rất dễ cháy nếu nhiệt độ quá cao. Quay ở 160–170°C trong 35–45 phút, quét mật ong pha nước tương 2 lần. Heo sữa chín khi da có màu vàng nâu đẹp và gõ vào nghe tiếng giòn."),
      h2("Đặt Heo Quay Sữa Tại Heo Quay Bình Tân"),
      p("Heo quay sữa cần đặt trước ít nhất 3–5 ngày vì số lượng heo sữa có hạn. Phù hợp cho tiệc sinh nhật, tân gia, kỷ niệm hoặc bất kỳ dịp đặc biệt nào cần một món ăn ấn tượng."),
    ])
  },
  {
    id: "cmqqbg78z0003h93p2mij0qie",
    title: "Char Siu Và Siu Yuk — Hai Món Heo Quay Kiểu Hồng Kông Khác Nhau Thế Nào?",
    seoDescription: "Phân biệt Char Siu (heo xá xíu) và Siu Yuk (heo quay) — hai món heo quay kiểu Hồng Kông phổ biến nhất. Nguyên liệu, cách làm và hương vị khác biệt ra sao?",
    content: makeContent([
      p("Char Siu và Siu Yuk đều là những món heo nổi tiếng trong ẩm thực Quảng Đông (Hồng Kông), nhưng lại hoàn toàn khác nhau về nguyên liệu, cách chế biến và hương vị. Nhiều người hay nhầm lẫn hai món này — hãy cùng tìm hiểu sự khác biệt."),
      h2("Char Siu — Heo Xá Xíu"),
      p("Char Siu (叉燒) nghĩa đen là 'xiên nướng'. Đây là thịt heo (thường là thăn lưng, ba chỉ hoặc cổ heo) được ướp với tương hoisin, mật ong, tương đỏ, ngũ vị hương rồi xiên que và nướng trong lò. Thành phẩm có màu đỏ nâu bóng đặc trưng, vị ngọt đậm và thơm."),
      h2("Siu Yuk — Heo Quay"),
      p("Siu Yuk (燒肉) là heo quay nguyên con hoặc miếng lớn, tập trung vào lớp da giòn rụm bên ngoài. Gia vị đơn giản hơn Char Siu, ướp bên trong nhiều hơn bên ngoài. Điểm nhận biết: da trắng ngà hoặc vàng óng giòn tan."),
      h2("So Sánh Trực Tiếp"),
      ul([
        "Màu sắc: Char Siu đỏ nâu bóng — Siu Yuk vàng óng với da giòn",
        "Vị: Char Siu ngọt đậm — Siu Yuk đậm đà và mặn vừa",
        "Kết cấu: Char Siu mềm không có da — Siu Yuk có da giòn đặc trưng",
        "Phần thịt dùng: Char Siu dùng thịt nạc — Siu Yuk cần cả da, mỡ và thịt",
      ]),
      h2("Tại Heo Quay Bình Tân"),
      p("Chúng tôi chuyên về Siu Yuk (heo quay da giòn) theo công thức gia truyền. Nếu bạn muốn thưởng thức cả hai trong một bữa ăn, hãy gọi thêm xá xíu tự làm để có sự so sánh thú vị giữa hai phong cách."),
    ])
  },
  {
    id: "cmqqbg7ik0005h93p9jlmn4dm",
    title: "Mẹo Bảo Quản Heo Quay — Giữ Da Giòn Qua Đêm Không Bị Mềm",
    seoDescription: "Bí quyết bảo quản heo quay để da vẫn giòn qua đêm. Cách hâm nóng lại heo quay đúng cách để khôi phục độ giòn mà không làm thịt bị khô.",
    content: makeContent([
      p("Heo quay ngon nhất khi ăn ngay sau khi ra lò, nhưng đôi khi bạn mua nhiều hoặc còn thừa sau bữa tiệc. Làm thế nào để bảo quản và hâm nóng lại mà vẫn giữ được lớp da giòn? Đây là bí quyết từ Heo Quay Bình Tân."),
      h2("Bảo Quản Ngắn Hạn (Dưới 4 Tiếng)"),
      p("Không cần để tủ lạnh. Để heo quay ở nơi thoáng mát, không đậy kín (đậy kín sẽ làm da bị hơi và mềm). Nếu cần giữ ấm, dùng lò nướng ở nhiệt độ thấp 60–70°C."),
      h2("Bảo Quản Qua Đêm"),
      p("Để nguội hoàn toàn, không đậy nắp kín, đặt vào tủ lạnh ngăn mát. Tuyệt đối không bọc nilon vì hơi ẩm tích tụ sẽ làm da mềm nhanh. Dùng khay hoặc đĩa lớn, không chồng chất."),
      h2("Cách Hâm Nóng Lại Giòn Da"),
      ul([
        "Lò nướng: 200°C trong 10–15 phút — phương pháp tốt nhất, da giòn trở lại gần như ban đầu",
        "Chảo khô: đặt da úp xuống chảo nóng, không dầu, 3–5 phút — nhanh và hiệu quả",
        "Nồi chiên không dầu: 180°C trong 8–10 phút — tiện lợi, kết quả tốt",
        "Tuyệt đối không dùng lò vi sóng — da sẽ bị dai và mềm nhũn",
      ]),
      h2("Thời Hạn Bảo Quản"),
      p("Heo quay có thể bảo quản ngăn mát 2–3 ngày, ngăn đông 1–2 tuần. Khi lấy từ ngăn đông ra, rã đông trong ngăn mát qua đêm trước khi hâm nóng. Chất lượng tốt nhất vẫn là ăn trong ngày — điều mà Heo Quay Bình Tân luôn khuyến khích."),
    ])
  },
  {
    id: "cmqqbg7s40007h93puuv498ls",
    title: "Heo Quay Miền Tây — Hương Vị Sả Gừng Khói Than Độc Đáo",
    seoDescription: "Khám phá phong cách heo quay miền Tây độc đáo với hương vị sả gừng và khói than đặc trưng. Sự khác biệt giữa heo quay miền Tây và các phong cách quay khác.",
    content: makeContent([
      p("Heo quay miền Tây là phiên bản đặc trưng của vùng sông nước Nam Bộ, khác hẳn heo quay kiểu Hoa ở chỗ sử dụng sả, gừng và các loại gia vị nhiệt đới địa phương, tạo ra hương vị thơm nồng độc đáo không thể nhầm lẫn."),
      h2("Gia Vị Đặc Trưng Miền Tây"),
      ul([
        "Sả: 5–6 cây, bỏ lá, giã nát — tạo mùi thơm đặc trưng",
        "Gừng tươi: 1 củ to, giã nát — khử mùi và tạo vị cay ấm",
        "Nghệ tươi: 1 củ nhỏ — tạo màu vàng đẹp và hương vị riêng",
        "Lá chanh thái chỉ: thêm mùi thơm tươi mát",
        "Ớt hiểm xanh: vị cay nhẹ đặc trưng miền Nam",
      ]),
      h2("Kỹ Thuật Quay Than"),
      p("Đặc điểm của heo quay miền Tây là quay bằng than củi (thường là củi dừa hoặc củi tràm) thay vì lò nướng điện. Khói từ than củi thấm vào thịt tạo ra hương vị khói tự nhiên rất đặc trưng — đây là điều không thể tái tạo được bằng lò điện."),
      h2("Cách Ướp Kiểu Miền Tây"),
      p("Giã nhuyễn tất cả gia vị, trộn với nước mắm ngon, đường và dầu ăn. Ướp bên trong heo và để qua đêm. Ngoài da chỉ quét mỡ lợn và một ít muối. Khi quay, thường xiên heo lên que tre lớn và quay trực tiếp trên bếp than."),
      h2("Hương Vị Thành Phẩm"),
      p("Heo quay miền Tây có màu vàng nâu đẹp, mùi thơm sả gừng nồng nhẹ, khói than thoang thoảng. Thịt bên trong mềm và đậm đà hơn heo quay kiểu Hoa. Ăn kèm với bánh hỏi, rau sống và nước mắm tỏi ớt chuẩn vị miền Nam."),
    ])
  },
  {
    id: "cmqqblgrc0001h9c9rsxq8cwn",
    title: "Gà Quay Ngũ Vị — Thơm Lừng Từ Trong Ra Ngoài",
    seoDescription: "Công thức gà quay ngũ vị thơm lừng, da vàng giòn và thịt thấm đều gia vị. Bí quyết sử dụng ngũ vị hương đúng cách để có món gà quay đậm đà nhất.",
    content: makeContent([
      p("Gà quay ngũ vị là món ăn phổ biến trong ẩm thực Hoa-Việt với hương thơm đặc trưng của năm loại gia vị hòa quyện. Thịt gà thấm đều gia vị từ trong ra ngoài, da vàng giòn bóng — đây là chuẩn mực của một con gà quay ngon."),
      h2("Ngũ Vị Hương — Linh Hồn Của Món"),
      p("Năm vị trong ngũ vị hương tượng trưng cho năm yếu tố: hoa hồi (ngôi sao thần kỳ tạo mùi nồng ấm), quế chi (vị cay ngọt), đinh hương (nồng đặc trưng), hạt tiêu Tứ Xuyên (tê cay nhẹ) và thảo quả (thơm mát). Xay tươi từng lần dùng để đảm bảo hương thơm tối đa."),
      h2("Công Thức Ướp"),
      ul([
        "Ngũ vị hương: 1.5 muỗng canh",
        "Nước tương: 3 muỗng canh",
        "Tương hoisin: 2 muỗng canh",
        "Mật ong: 2 muỗng canh",
        "Rượu thiệu hưng: 2 muỗng canh",
        "Tỏi băm: 4 tép",
        "Dầu mè: 1 muỗng canh",
      ]),
      h2("Kỹ Thuật Ướp Sâu"),
      p("Dùng que xiên đâm nhiều lỗ nhỏ khắp thân gà (đặc biệt là phần đùi và ngực dày). Xoa bóp gia vị kỹ vào các lỗ để thấm sâu. Đặt gà vào túi kín, ướp trong tủ lạnh 12–24 tiếng — càng lâu càng thấm vị."),
      h2("Quay Và Tạo Màu"),
      p("Quay ở 190°C trong 50–60 phút. Quét thêm hỗn hợp mật ong và nước tương lên da 2 lần trong quá trình quay để da bóng và màu lên đẹp. Để gà nghỉ 8 phút trước khi chặt để nước thịt không chảy ra khi cắt."),
    ])
  },
  {
    id: "cmqqblh6g0003h9c9kbe56gqz",
    title: "Gà Quay Muối — Công Thức Truyền Thống Người Hoa Tại Sài Gòn",
    seoDescription: "Công thức gà quay muối truyền thống của người Hoa tại Sài Gòn. Da giòn vàng, thịt mềm ngọt tự nhiên và hương thơm muối thảo mộc đặc trưng.",
    content: makeContent([
      p("Gà quay muối (Salt Baked Chicken) là món ăn truyền thống của người Hoa Khách Gia (Hakka) đã có mặt tại Sài Gòn hàng trăm năm. Điểm đặc biệt là gà được bao phủ bởi muối và thảo mộc, tạo ra môi trường nướng đặc biệt giữ lại toàn bộ nước và hương vị tự nhiên."),
      h2("Muối Thảo Mộc Đặc Biệt"),
      p("Muối dùng cho món này không phải muối ăn thông thường mà là hỗn hợp muối hột rang khô trộn với các loại thảo mộc: lá dứa khô, lá xả khô, lá chanh khô, hoa hồi và quế chi. Hỗn hợp này khi đun nóng sẽ tỏa ra hương thơm đặc biệt thấm vào thịt gà."),
      h2("Quy Trình Làm"),
      ol([
        "Ướp gà với muối, rượu và gừng trong 2 tiếng",
        "Lau khô gà hoàn toàn bằng khăn sạch",
        "Rang muối thảo mộc cho nóng già (khoảng 200°C)",
        "Bọc gà trong giấy nến, đặt vào giữa lớp muối nóng",
        "Đậy kín và nướng 45–60 phút, lật giữa chừng",
      ]),
      h2("Hương Vị Độc Đáo"),
      p("Phương pháp nướng muối tạo ra nhiệt đều từ mọi phía, giữ lại toàn bộ nước trong thịt gà. Kết quả là thịt cực kỳ mềm ngọt, thơm nhẹ hương thảo mộc và muối, da vàng giòn nhẹ. Đây là cách ăn gà 'thuần khiết' nhất, tôn lên vị ngọt tự nhiên của thịt gà."),
      h2("Chấm Với Gì?"),
      p("Gà quay muối truyền thống ăn kèm muối tiêu chanh hoặc tương gừng. Đừng dùng nước mắm hay sốt đậm vị sẽ lấn át hương thơm tinh tế của món này."),
    ])
  },
  {
    id: "cmqqblhgf0005h9c9d43gjjb1",
    title: "Bí Quyết Chọn Gà Ngon Cho Món Quay — Gà Ta Hay Gà Công Nghiệp?",
    seoDescription: "So sánh gà ta và gà công nghiệp cho món quay. Ưu nhược điểm của từng loại và khi nào nên dùng gà nào để có món gà quay ngon nhất.",
    content: makeContent([
      p("Gà ta hay gà công nghiệp — đây là câu hỏi mà nhiều người thắc mắc khi làm gà quay. Mỗi loại có ưu và nhược điểm riêng. Hiểu rõ sự khác biệt sẽ giúp bạn chọn đúng loại gà cho từng mục đích."),
      h2("Gà Ta (Gà Thả Vườn)"),
      p("Ưu điểm: Thịt chắc, thơm ngọt tự nhiên, da mỏng vừa phải và giòn sau khi quay. Mỡ ít, phân bố đều. Hương vị đậm đà hơn gà công nghiệp do gà được vận động nhiều."),
      p("Nhược điểm: Giá cao hơn 30–50%, kích cỡ không đều, thịt đôi khi dai hơn ở gà già. Cần thời gian quay lâu hơn do thịt chắc hơn."),
      h2("Gà Công Nghiệp"),
      p("Ưu điểm: Giá rẻ hơn, kích cỡ đều, thịt mềm (do ít vận động), dễ chín đều hơn. Thích hợp cho số lượng lớn hoặc ngân sách hạn chế."),
      p("Nhược điểm: Thịt nhạt vị hơn, da dày và khó giòn hơn, lượng nước trong thịt nhiều hơn nên sau khi quay thịt dễ bị khô nếu không kiểm soát nhiệt độ tốt."),
      h2("Khuyến Nghị Từ Heo Quay Bình Tân"),
      p("Cho gà quay đặc biệt (tiệc, cúng lễ): Dùng gà ta từ 1.2–1.8 kg — hương vị vượt trội, xứng đáng với dịp quan trọng."),
      p("Cho gà quay số lượng lớn (buffet, đặt tiệc): Gà công nghiệp từ 1.5–2 kg — kinh tế và dễ kiểm soát chất lượng đồng đều."),
      h2("Dấu Hiệu Nhận Biết"),
      ul([
        "Gà ta: da vàng nhạt, chân và mỏ cứng, ngón chân dài",
        "Gà công nghiệp: da trắng, thân to tròn, chân ngắn và mềm hơn",
      ]),
    ])
  },
  {
    id: "cmqqblhrz0007h9c9umtuq2f1",
    title: "Vịt Quay Chao — Đặc Sản Miền Nam Thơm Béo Khó Quên",
    seoDescription: "Công thức vịt quay chao đặc sản miền Nam với hương thơm béo ngậy của chao đỏ. Cách ướp vịt với chao và kỹ thuật quay để da giòn đúng chuẩn.",
    content: makeContent([
      p("Vịt quay chao là đặc sản độc đáo của miền Nam Việt Nam, dùng chao đỏ (đậu hũ lên men) làm gia vị chính. Hương thơm nồng béo đặc trưng của chao kết hợp với da vịt giòn tạo ra món ăn khó quên, rất khác so với các phong cách vịt quay khác."),
      h2("Chao Đỏ — Nguyên Liệu Đặc Biệt"),
      p("Chao đỏ (Nam Ru) là đậu hũ lên men cùng rượu đỏ và gia vị, có màu đỏ cam đặc trưng, mùi nồng và vị mặn béo độc đáo. Đây là gia vị truyền thống của người Hoa miền Nam, tạo ra hương vị không thể thay thế cho món vịt quay chao."),
      h2("Công Thức Ướp Vịt Chao"),
      ul([
        "4–5 miếng chao đỏ, dầm nhuyễn",
        "2 muỗng canh rượu chao (nước trong hũ chao)",
        "2 muỗng canh nước tương",
        "1 muỗng canh dầu hào",
        "1 muỗng canh mật ong",
        "Tỏi và sả băm nhuyễn",
        "Tiêu xay",
      ]),
      h2("Ướp Và Quay"),
      p("Trộn đều tất cả gia vị, xoa kỹ vào bên trong và bên ngoài vịt. Ướp ít nhất 8 tiếng trong tủ lạnh. Phơi khô vịt 3–4 tiếng trước khi quay. Quay ở 200°C trong 55–65 phút, quét thêm lớp nước chao pha loãng với mật ong lên da 2 lần."),
      h2("Hương Vị Thành Phẩm"),
      p("Vịt quay chao có màu đỏ nâu đẹp rất đặc trưng (do màu đỏ của chao), mùi thơm nồng béo không thể lẫn với bất kỳ loại vịt quay nào. Thịt đậm đà, da giòn bóng. Ăn kèm với cơm trắng hoặc bún tươi và dưa giá."),
    ])
  },
  {
    id: "cmqqbli1w0009h9c969y9tniw",
    title: "Vịt Quay Quảng Đông — Cách Làm Chuẩn Vị Nhà Hàng",
    seoDescription: "Hướng dẫn chi tiết cách làm vịt quay Quảng Đông chuẩn vị nhà hàng. Từ khâu chọn vịt, nhồi gia vị bên trong đến kỹ thuật treo và quay đúng cách.",
    content: makeContent([
      p("Vịt quay Quảng Đông (Cantonese Roast Duck) là phong cách quay vịt phổ biến nhất trong các nhà hàng Hoa tại Việt Nam và trên toàn thế giới. Điểm đặc trưng là gia vị được nhồi bên trong bụng vịt và bịt kín, tạo ra môi trường hơi áp suất giúp gia vị thấm đều và thịt cực kỳ mềm ngọt."),
      h2("Gia Vị Nhồi Bên Trong"),
      ul([
        "Tương hoisin: 3 muỗng canh",
        "Nước tương: 2 muỗng canh",
        "Dầu mè: 1 muỗng canh",
        "Ngũ vị hương: 1 muỗng canh",
        "Tỏi, gừng, sả băm nhuyễn",
        "Đường phèn: 1 muỗng canh",
        "Rượu thiệu hưng: 2 muỗng canh",
      ]),
      h2("Kỹ Thuật Nhồi Và Bịt Bụng"),
      p("Nhồi tất cả gia vị vào bụng vịt, dùng que xiên hoặc kim chỉ bịt kín phần hở. Mục đích là giữ gia vị bên trong để khi quay, hơi nước gia vị sẽ tuần hoàn bên trong làm thịt chín đều và thấm vị từ trong ra."),
      h2("Nước Tẩm Ngoài Da"),
      p("Pha hỗn hợp: mật ong + giấm trắng + nước tương + nước ấm theo tỷ lệ 2:1:1:3. Dội nước sôi lên da vịt, thấm khô, quét hỗn hợp tẩm lên da 2 lần. Treo khô trong tủ lạnh 12–24 tiếng."),
      h2("Quay Và Kiểm Tra"),
      p("Treo vịt thẳng đứng trong lò ở 200°C trong 45 phút, sau đó lật và quay thêm 20 phút. Vịt chín khi đâm vào đùi nước chảy ra trong. Chặt và ăn ngay kèm sốt mận hoặc tương gừng."),
    ])
  },
  {
    id: "cmqqblibv000bh9c9lvk93b9d",
    title: "Mẹo Khử Mùi Tanh Của Vịt — Làm Sạch Đúng Cách Trước Khi Quay",
    seoDescription: "Cách khử mùi tanh của vịt hiệu quả trước khi quay. Các nguyên liệu và kỹ thuật làm sạch vịt đúng cách để thịt thơm ngon không còn mùi tanh đặc trưng.",
    content: makeContent([
      p("Mùi tanh là vấn đề khiến nhiều người ngại làm vịt quay tại nhà. Nhưng với kỹ thuật làm sạch đúng cách, bạn có thể hoàn toàn khử mùi tanh để có con vịt thơm tho trước khi ướp và quay."),
      h2("Nguyên Nhân Gây Mùi Tanh"),
      p("Mùi tanh của vịt đến từ tuyến mỡ đuôi (phải cắt bỏ), máu còn sót lại trong xương và các tuyến bã nhờn dưới da. Nội tạng nếu vỡ khi làm sạch cũng sẽ làm thịt có mùi."),
      h2("Các Bước Làm Sạch Cơ Bản"),
      ol([
        "Cắt bỏ tuyến dầu ở đuôi vịt — đây là nguồn mùi tanh chính",
        "Nhổ sạch lông tơ còn sót lại bằng nhíp",
        "Rửa sạch khoang bụng bên trong, loại bỏ màng máu",
        "Rửa lại với nước muối loãng 10 phút",
        "Trụng qua nước sôi 1–2 phút để se da và loại máu",
      ]),
      h2("Nguyên Liệu Khử Mùi Hiệu Quả"),
      ul([
        "Gừng: giã nát, xoa đều trong và ngoài con vịt — hiệu quả nhất",
        "Rượu trắng: ngâm vịt trong rượu loãng 10–15 phút",
        "Giấm trắng: pha với nước tỷ lệ 1:5, ngâm 5 phút",
        "Muối hột: chà xát mạnh lên da và bên trong bụng",
        "Lá chanh: nhét vào bụng vịt khi ướp",
      ]),
      h2("Mẹo Từ Đầu Bếp"),
      p("Trụng vịt trong nước sôi có thêm vài lát gừng và ít rượu trắng trong 2 phút, sau đó ngâm ngay vào nước lạnh. Bước này vừa khử mùi vừa se da, giúp da giòn hơn sau khi quay. Đây là kỹ thuật mà các nhà hàng Hoa tại Sài Gòn đều áp dụng."),
    ])
  },
  // 10 Album posts - đổi thành nội dung hữu ích
  {
    id: "cmqup0fb40001h959xnu4f551",
    title: "Giới Thiệu Heo Quay Bình Tân — Thương Hiệu Ẩm Thực Gia Truyền",
    seoDescription: "Câu chuyện về thương hiệu Heo Quay Bình Tân — từ công thức gia truyền đến sứ mệnh mang heo quay chất lượng cao đến tận tay khách hàng Sài Gòn.",
    content: makeContent([
      p("Heo Quay Bình Tân được thành lập với một sứ mệnh đơn giản: mang đến những con heo quay chất lượng cao nhất với công thức gia truyền, phục vụ tận tâm mọi dịp trong cuộc sống của người dân Sài Gòn."),
      h2("Câu Chuyện Bắt Đầu"),
      p("Xuất phát từ niềm đam mê ẩm thực và công thức heo quay được truyền qua nhiều thế hệ, Heo Quay Bình Tân ra đời với mong muốn giữ gìn hương vị truyền thống trong khi đáp ứng nhu cầu ngày càng cao của thực khách hiện đại."),
      h2("Công Thức Gia Truyền"),
      p("Công thức ướp heo quay của chúng tôi kết hợp hài hòa giữa ngũ vị hương, các loại thảo mộc đặc biệt và bí quyết riêng được gìn giữ qua nhiều năm. Mỗi con heo đều được ướp ít nhất 6 tiếng và quay theo quy trình nghiêm ngặt để đảm bảo chất lượng đồng đều."),
      h2("Cam Kết Chất Lượng"),
      ul([
        "Chỉ dùng heo tươi nhập mỗi ngày, không dùng heo đông lạnh",
        "Quay theo đơn đặt hàng, không để heo quay qua đêm bán lại",
        "Giao hàng đúng giờ với sản phẩm còn nóng",
        "Hoàn tiền 100% nếu không hài lòng về chất lượng",
      ]),
      h2("Phục Vụ Mọi Dịp"),
      p("Từ tiệc cưới, cúng giỗ, khai trương đến bữa ăn gia đình — Heo Quay Bình Tân đều có thể phục vụ với chất lượng ổn định và giá cả hợp lý. Liên hệ ngay để được tư vấn và đặt hàng."),
    ])
  },
  {
    id: "cmqup0fk50003h95903ub2mrv",
    title: "Quy Trình Chế Biến Heo Quay Chuẩn Tại Heo Quay Bình Tân",
    seoDescription: "Khám phá quy trình chế biến heo quay nghiêm ngặt tại Heo Quay Bình Tân — từ tuyển chọn nguyên liệu, sơ chế, ướp gia vị đến kỹ thuật quay và kiểm tra chất lượng.",
    content: makeContent([
      p("Để có được những con heo quay đạt chuẩn, Heo Quay Bình Tân tuân theo quy trình nghiêm ngặt gồm nhiều bước kiểm soát chất lượng. Đây là quy trình mà chúng tôi thực hiện mỗi ngày để đảm bảo mỗi sản phẩm xuất bếp đều đạt chất lượng cao nhất."),
      h2("Bước 1: Tuyển Chọn Nguyên Liệu"),
      p("Mỗi sáng sớm, đội ngũ của chúng tôi trực tiếp đến lò mổ để tuyển chọn heo. Tiêu chí: trọng lượng 8–12 kg, da mỏng đều, thịt hồng tươi, không có mùi lạ. Chỉ khoảng 60–70% số heo đạt tiêu chuẩn được chọn."),
      h2("Bước 2: Sơ Chế"),
      p("Heo sau khi chọn được làm sạch kỹ, cạo lông còn sót, rửa bằng nước muối và kiểm tra lần cuối. Xử lý phần nội tạng và làm thông thoáng khoang bụng để gia vị dễ thấm."),
      h2("Bước 3: Ướp Gia Vị"),
      p("Gia vị được pha theo công thức riêng, xoa đều bên trong khoang bụng và bên ngoài da. Heo được ướp ít nhất 6 tiếng (thường là qua đêm) trong điều kiện nhiệt độ kiểm soát."),
      h2("Bước 4: Chuẩn Bị Da"),
      p("Trước khi quay, da heo được phơi khô bằng quạt hoặc trong tủ khô đặc biệt. Châm kim đều khắp bề mặt da, quét giấm trắng và để khô lần cuối. Đây là bước quan trọng nhất để có da giòn."),
      h2("Bước 5: Quay Và Kiểm Tra"),
      p("Quay trong lò ở nhiệt độ kiểm soát chính xác. Kiểm tra độ chín bằng nhiệt kế thịt và thử bằng que xiên. Chỉ xuất bếp khi đạt đủ tiêu chuẩn về màu sắc, độ giòn da và độ chín của thịt."),
    ])
  },
  {
    id: "cmqup0fsq0005h959mvhhmijj",
    title: "Thực Đơn Heo Quay Bình Tân — Các Loại Quay Và Bảng Giá",
    seoDescription: "Thực đơn đầy đủ của Heo Quay Bình Tân bao gồm heo quay, gà quay, vịt quay và các sản phẩm đi kèm. Bảng giá tham khảo và cách đặt hàng nhanh nhất.",
    content: makeContent([
      p("Heo Quay Bình Tân cung cấp đa dạng các loại quay phục vụ mọi nhu cầu — từ đặt cả con cho tiệc lớn đến mua theo kg cho bữa ăn gia đình. Dưới đây là thực đơn và hướng dẫn đặt hàng chi tiết."),
      h2("Heo Quay"),
      ul([
        "Heo quay nguyên con (8–12 kg): giá theo kg, đặt trước 1 ngày",
        "Heo quay sữa nguyên con (3–5 kg): giá cao hơn, đặt trước 3–5 ngày",
        "Heo quay theo kg (mua lẻ): thông báo số lượng khi đặt",
        "Heo quay phần (ba chỉ, đùi, sườn): theo yêu cầu",
      ]),
      h2("Gà Quay"),
      ul([
        "Gà quay nguyên con: gà ta 1.2–2 kg",
        "Gà quay theo kg",
        "Gà quay mật ong (đặt trước)",
        "Gà quay muối (đặt trước)",
      ]),
      h2("Vịt Quay"),
      ul([
        "Vịt quay Bắc Kinh nguyên con",
        "Vịt quay chao (đặt trước)",
        "Vịt quay húng lìu (đặt trước)",
        "Vịt quay theo kg",
      ]),
      h2("Cách Đặt Hàng"),
      p("Gọi điện hoặc nhắn Zalo trực tiếp. Cung cấp: loại quay, số lượng/trọng lượng, ngày giờ nhận hàng, địa chỉ giao hàng. Xác nhận đơn trong 30 phút. Thanh toán khi nhận hàng hoặc đặt cọc theo thỏa thuận."),
    ])
  },
  {
    id: "cmqup0g180007h959iv3fhu3l",
    title: "Dịch Vụ Giao Heo Quay Tận Nơi — Nhanh, Tươi, Đúng Giờ",
    seoDescription: "Dịch vụ giao heo quay tận nơi của Heo Quay Bình Tân — giao nhanh trong nội thành, đảm bảo heo quay vẫn nóng giòn khi đến tay khách.",
    content: makeContent([
      p("Heo Quay Bình Tân cung cấp dịch vụ giao hàng tận nơi trong khu vực Bình Tân và các quận lân cận tại TP.HCM. Chúng tôi hiểu rằng heo quay cần được ăn khi còn nóng, nên luôn ưu tiên giao hàng nhanh chóng và đúng giờ."),
      h2("Khu Vực Giao Hàng"),
      ul([
        "Quận Bình Tân: giao trong 30 phút",
        "Quận 6, Quận 8, Quận Bình Chánh: giao trong 45–60 phút",
        "Các quận trung tâm (1, 3, 5, 10, 11): giao trong 60–90 phút",
        "Các quận khác: liên hệ để kiểm tra khả năng giao hàng",
      ]),
      h2("Đóng Gói Giữ Nhiệt"),
      p("Heo quay được đóng gói trong thùng xốp chuyên dụng với lớp giấy bạc giữ nhiệt. Đảm bảo khi giao đến tay khách, heo quay vẫn còn ấm và da vẫn giòn ở mức tốt nhất có thể."),
      h2("Phí Giao Hàng"),
      p("Miễn phí giao hàng cho đơn từ 1 con heo quay trở lên trong bán kính 5km. Đơn nhỏ hơn hoặc khoảng cách xa hơn có phụ phí giao hàng tùy theo khoảng cách. Liên hệ để biết phí cụ thể."),
      h2("Đặt Hàng Giao Giờ Nhất Định"),
      p("Bạn có thể chỉ định chính xác giờ giao hàng để phù hợp với lịch tiệc hay lễ cúng. Chúng tôi sẽ tính thời gian quay để heo ra lò và đến tay bạn đúng giờ mong muốn."),
    ])
  },
  {
    id: "cmqup0g9s0009h959e81zego5",
    title: "Heo Quay Cho Tiệc Cưới — Dịch Vụ Trọn Gói Và Những Điều Cần Biết",
    seoDescription: "Hướng dẫn đặt heo quay cho tiệc cưới từ Heo Quay Bình Tân. Số lượng cần thiết, thời điểm đặt, dịch vụ kèm theo và những lưu ý quan trọng.",
    content: makeContent([
      p("Heo quay trong tiệc cưới không chỉ là món ăn mà còn là biểu tượng may mắn và thịnh vượng. Heo Quay Bình Tân có kinh nghiệm phục vụ hàng trăm tiệc cưới mỗi năm và hiểu rõ những gì bạn cần chuẩn bị."),
      h2("Tính Số Lượng Heo Quay"),
      p("Quy tắc chung: 1 con heo quay 10 kg phục vụ được khoảng 30–40 khách (ăn kèm với các món khác). Nếu heo quay là món chính: 1 con phục vụ 20–25 khách."),
      h2("Thời Điểm Đặt Hàng"),
      ul([
        "Tiệc nhỏ (dưới 5 con): đặt trước 1 tuần",
        "Tiệc vừa (5–10 con): đặt trước 2 tuần",
        "Tiệc lớn (trên 10 con): đặt trước 3–4 tuần",
        "Tiệc vào dịp Tết hoặc mùa cao điểm: đặt trước 1–2 tháng",
      ]),
      h2("Dịch Vụ Kèm Theo"),
      ul([
        "Chặt heo và sắp xếp trình bày tại chỗ",
        "Cung cấp nước chấm, rau sống ăn kèm",
        "Tư vấn số lượng phù hợp với thực đơn tổng thể",
        "Giao hàng đúng giờ theo lịch tiệc",
      ]),
      h2("Lưu Ý Quan Trọng"),
      p("Hãy cho chúng tôi biết giờ khai tiệc để tính thời gian giao hàng chính xác. Heo quay ngon nhất khi được chặt và ăn trong vòng 2 tiếng sau khi ra lò — chúng tôi sẽ sắp xếp thời gian quay phù hợp để bạn có heo quay tươi nhất vào đúng thời điểm cần."),
    ])
  },
  {
    id: "cmqup0gid000bh959emaji6cj",
    title: "Heo Quay Cúng Giỗ — Ý Nghĩa Và Hướng Dẫn Chuẩn Bị",
    seoDescription: "Hướng dẫn chọn heo quay cho lễ cúng giỗ đúng phong tục. Ý nghĩa tâm linh của heo quay trong nghi lễ thờ cúng người Việt và cách chuẩn bị đúng cách.",
    content: makeContent([
      p("Heo quay có vị trí đặc biệt trong các nghi lễ thờ cúng của người Việt, từ giỗ chạp, lễ tết đến cúng đình, miếu. Hiểu đúng ý nghĩa và cách chuẩn bị sẽ giúp buổi lễ trang trọng và thành kính hơn."),
      h2("Ý Nghĩa Tâm Linh"),
      p("Heo quay trong lễ cúng tượng trưng cho lòng thành kính và sự sung túc. Màu vàng óng của da heo quay mang ý nghĩa may mắn, thịnh vượng. Dâng heo quay nguyên con thể hiện lòng biết ơn trọn vẹn với tổ tiên và thần linh."),
      h2("Chọn Heo Quay Cúng Đúng Chuẩn"),
      ul([
        "Heo quay nguyên con — không chặt trước khi cúng",
        "Da vàng đẹp, không bị cháy hay vỡ",
        "Heo còn nguyên vẹn, không thiếu bộ phận nào",
        "Thường chọn số lẻ (1, 3, 5 con) theo phong tục",
      ]),
      h2("Thời Điểm Đặt Và Nhận"),
      p("Heo quay cúng cần được nhận trước giờ làm lễ ít nhất 30–60 phút để chuẩn bị mâm cúng. Liên hệ trước để thông báo giờ cúng — Heo Quay Bình Tân sẽ tính ngược thời gian quay để đảm bảo giao heo còn nóng và đúng giờ."),
      h2("Sau Khi Cúng Xong"),
      p("Heo quay sau khi hạ mâm có thể chặt và chia cho mọi người trong gia đình và khách mời. Phần còn lại bảo quản trong tủ lạnh và dùng trong 2–3 ngày. Xem thêm bài viết về cách bảo quản heo quay để giữ được chất lượng tốt nhất."),
    ])
  },
  {
    id: "cmqup0gqy000dh959cjdoal5n",
    title: "Khai Trương Đặt Heo Quay — Mang Lộc Đến Cơ Sở Kinh Doanh Mới",
    seoDescription: "Phong tục đặt heo quay khai trương cơ sở kinh doanh. Ý nghĩa tâm linh, cách chọn heo quay đẹp và dịch vụ đặt heo quay khai trương tại Heo Quay Bình Tân.",
    content: makeContent([
      p("Đặt heo quay khai trương là một phong tục quan trọng trong kinh doanh của người Việt Nam và người Hoa. Con heo quay vàng óng đặt trang trọng trước cơ sở mới mang ý nghĩa cầu mong sự thịnh vượng, phát đạt và may mắn cho chủ nhân."),
      h2("Ý Nghĩa Của Heo Quay Khai Trương"),
      p("Theo quan niệm dân gian và phong tục của người Hoa ảnh hưởng mạnh đến văn hóa kinh doanh miền Nam, heo quay tượng trưng cho 'lộc' đầu tiên của cơ sở. Màu vàng của da heo tượng trưng cho vàng bạc, tiền tài — mở đầu thuận lợi cho công việc kinh doanh."),
      h2("Chọn Heo Quay Đẹp Cho Khai Trương"),
      ul([
        "Da vàng đẹp, không bị cháy hoặc vỡ — thẩm mỹ quan trọng trong dịp này",
        "Heo nguyên vẹn, đầy đủ — không thiếu bộ phận nào",
        "Trọng lượng phù hợp với không gian và số lượng khách",
        "Đặt trước 3–5 ngày để đảm bảo chất lượng tốt nhất",
      ]),
      h2("Cách Bày Heo Quay"),
      p("Đặt heo quay trên bàn hoặc mâm lớn, đầu hướng về phía lối vào. Trang trí bằng hoa quả, đèn nến và hương. Sau nghi lễ, chặt heo và mời khách mời thưởng thức — chia sẻ 'lộc đầu' với mọi người."),
      h2("Đặt Heo Quay Khai Trương"),
      p("Liên hệ Heo Quay Bình Tân để đặt heo quay khai trương. Chúng tôi sẽ tư vấn kích thước phù hợp, giao đúng giờ và đảm bảo con heo quay đẹp nhất để ngày khai trương của bạn diễn ra thuận lợi và ấn tượng."),
    ])
  },
  {
    id: "cmqup0gzi000fh959ta5glcry",
    title: "Câu Hỏi Thường Gặp Khi Đặt Heo Quay — Giải Đáp Từ Heo Quay Bình Tân",
    seoDescription: "Giải đáp các câu hỏi thường gặp khi đặt heo quay: thời gian đặt trước, cách tính số lượng, bảo quản, giao hàng và các thắc mắc khác.",
    content: makeContent([
      p("Dưới đây là những câu hỏi mà khách hàng thường hỏi khi đặt heo quay tại Heo Quay Bình Tân. Hy vọng phần giải đáp này sẽ giúp bạn có trải nghiệm mua hàng thuận lợi nhất."),
      h2("Cần Đặt Trước Bao Lâu?"),
      p("Thông thường đặt trước 1 ngày là đủ. Vào dịp lễ tết hoặc đặt số lượng lớn (từ 5 con trở lên) nên đặt trước 1–2 tuần. Heo quay sữa cần đặt trước ít nhất 3–5 ngày."),
      h2("Một Con Heo Quay Ăn Được Bao Nhiêu Người?"),
      p("Heo quay 10 kg ăn kèm với cơm và các món khác đủ cho 30–40 người. Nếu ăn heo quay là món chính thì khoảng 20–25 người. Nên đặt thêm 10–15% so với nhu cầu để đảm bảo đủ cho mọi người."),
      h2("Giao Hàng Đến Địa Chỉ Của Tôi Không?"),
      p("Chúng tôi giao hàng trong khu vực TP.HCM. Phí giao hàng tùy theo khoảng cách. Miễn phí cho đơn đủ điều kiện trong bán kính 5km. Liên hệ để biết phí cụ thể cho địa chỉ của bạn."),
      h2("Heo Quay Có Để Được Qua Đêm Không?"),
      p("Có thể để tủ lạnh qua đêm. Khi hâm nóng lại dùng lò nướng hoặc nồi chiên không dầu để khôi phục độ giòn. Tuyệt đối không dùng lò vi sóng."),
      h2("Có Thể Đặt Theo Phần (Không Nguyên Con)?"),
      p("Có, chúng tôi bán theo kg hoặc theo phần (ba chỉ, đùi, sườn). Tuy nhiên đặt nguyên con sẽ có giá tốt hơn và đảm bảo chất lượng đồng đều nhất."),
    ])
  },
  {
    id: "cmqup0h81000hh9592b539g91",
    title: "Mẹo Thưởng Thức Heo Quay Ngon — Từ Chuyên Gia Heo Quay Bình Tân",
    seoDescription: "Những mẹo thưởng thức heo quay ngon nhất từ chuyên gia ẩm thực Heo Quay Bình Tân — từ cách ăn da giòn đúng chuẩn đến kết hợp đồ uống phù hợp.",
    content: makeContent([
      p("Có một con heo quay ngon là điều tốt, nhưng biết cách thưởng thức đúng cách sẽ làm trải nghiệm ăn uống trở nên hoàn hảo hơn nhiều. Đây là những mẹo từ đội ngũ Heo Quay Bình Tân."),
      h2("Ăn Da Trước, Thịt Sau"),
      p("Da giòn là phần quý nhất của heo quay và cũng là phần dễ bị mềm nhất nếu để lâu. Hãy ăn da ngay khi vừa chặt, khi còn nóng và giòn nhất. Đừng để da tiếp xúc với nước chấm quá lâu vì sẽ bị mềm."),
      h2("Kết Hợp Đúng Nước Chấm"),
      p("Không phải nước chấm nào cũng hợp với mọi phần heo quay. Da giòn ăn không cần chấm gì để cảm nhận vị béo giòn thuần túy. Thịt nạc hợp với tương hoisin hoặc nước mắm tỏi ớt. Phần mỡ ăn kèm với dưa cải để cân bằng."),
      h2("Rau Sống Ăn Kèm"),
      p("Dưa leo mát lạnh, rau thơm và ít giá đỗ sẽ giúp bữa ăn không bị ngán dù ăn nhiều. Cắn một miếng dưa leo sau mỗi 2–3 miếng heo quay để làm sạch vị giác và ăn được nhiều hơn."),
      h2("Đồ Uống Phù Hợp"),
      ul([
        "Trà ô long hay trà pu-erh — phổ biến nhất, giúp tiêu hóa tốt",
        "Bia lạnh — cách uống kèm phổ biến tại miền Nam",
        "Nước dừa tươi — thanh mát, trung hòa vị béo",
        "Tránh nước ngọt có gas — tạo cảm giác no nhanh",
      ]),
      h2("Sau Bữa Ăn"),
      p("Uống một tách trà ô long nóng sau bữa ăn heo quay giúp tiêu hóa tốt hơn và loại bỏ cảm giác ngán. Đây là thói quen truyền thống của người Hoa mà bạn nên thử áp dụng."),
    ])
  },
  {
    id: "cmqup0hgk000jh959gmosrhe9",
    title: "Liên Hệ Và Đặt Heo Quay Bình Tân — Hướng Dẫn Đặt Hàng Nhanh Nhất",
    seoDescription: "Hướng dẫn đặt heo quay Bình Tân nhanh nhất qua điện thoại và Zalo. Thông tin liên hệ, giờ làm việc và các kênh đặt hàng của Heo Quay Bình Tân.",
    content: makeContent([
      p("Đặt heo quay tại Heo Quay Bình Tân nhanh chóng và dễ dàng qua nhiều kênh khác nhau. Dưới đây là tất cả thông tin bạn cần để đặt hàng."),
      h2("Cách Đặt Hàng Nhanh Nhất"),
      p("Gọi điện hoặc nhắn Zalo trực tiếp — đây là cách nhanh nhất để đặt hàng và nhận xác nhận ngay. Cung cấp: loại quay muốn đặt, số lượng hoặc trọng lượng, ngày giờ nhận hàng và địa chỉ giao hàng."),
      h2("Thông Tin Để Đặt Hàng Đầy Đủ"),
      ul([
        "Loại: heo quay / gà quay / vịt quay",
        "Số lượng (con) hoặc trọng lượng (kg)",
        "Ngày và giờ cần nhận hàng (hoặc giờ tiệc/cúng)",
        "Địa chỉ giao hàng cụ thể",
        "Số điện thoại liên lạc",
        "Yêu cầu đặc biệt (nếu có): trình bày, chặt sẵn, v.v.",
      ]),
      h2("Giờ Làm Việc"),
      p("Heo Quay Bình Tân phục vụ 7 ngày/tuần, kể cả ngày lễ. Nhận đặt hàng từ sáng sớm. Giờ giao hàng linh hoạt theo yêu cầu của khách."),
      h2("Chính Sách Hủy Đơn"),
      p("Thông báo hủy hoặc thay đổi đơn hàng trước 12 tiếng sẽ không phát sinh phí. Hủy trong vòng 12 tiếng trước giờ giao có thể mất tiền cọc (nếu đã đặt cọc). Trường hợp bất khả kháng, vui lòng liên hệ sớm nhất có thể để được hỗ trợ."),
      h2("Cam Kết Của Chúng Tôi"),
      p("Heo Quay Bình Tân cam kết giao hàng đúng giờ, đúng chất lượng như đã thỏa thuận. Nếu có bất kỳ vấn đề nào về chất lượng sản phẩm, chúng tôi sẽ hoàn tiền hoặc thay thế ngay lập tức."),
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
  console.log("Xong batch 2!")
}

main().catch(console.error).finally(() => db.$disconnect())
