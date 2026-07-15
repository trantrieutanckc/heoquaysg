const { PrismaClient, Prisma } = require("@prisma/client")
const db = new PrismaClient()

async function main() {
  const existing = await db.siteConfig.findUnique({ where: { id: "default" } })
  const current = existing?.data ?? {}

  const updated = {
    ...current,

    // Story
    aboutStory1:
      "Heo Quay Bình Tân ra đời từ tình yêu với ẩm thực và khát vọng giữ gìn hương vị quay truyền thống giữa lòng Sài Gòn. Chúng tôi đặt bếp lửa tại 160 Đường Số 11, Bình Hưng Hòa, Bình Tân — nơi mỗi ngày hàng trăm lượt khách ghé qua để mang về những mâm cỗ đậm đà cho gia đình và những dịp quan trọng.",
    aboutStory2:
      "Từng con heo, từng con gà, từng con vịt đều được chọn lọc kỹ lưỡng từ các trang trại sạch. Gia vị ướp theo công thức riêng, than hoa đốt đúng nhiệt, tay quay đều đặn — không tắt lửa, không rút ngắn thời gian. Đó là lý do da luôn giòn tan, thịt ngọt mềm, hương thơm khó quên.",

    // Stats
    aboutStat1Number: "10+",
    aboutStat1Label: "Năm kinh nghiệm",
    aboutStat1Desc: "Hơn 10 năm gắn bó với nghề quay tại Bình Tân",

    aboutStat2Number: "500+",
    aboutStat2Label: "Khách hàng tin tưởng",
    aboutStat2Desc: "Phục vụ cả khách lẻ lẫn đặt tiệc cưới, cúng giỗ, đầy tháng",

    aboutStat3Number: "4",
    aboutStat3Label: "Món đặc trưng",
    aboutStat3Desc: "Heo quay, Heo sữa, Gà quay, Vịt quay",

    // Steps
    aboutStep1Title: "Chọn nguyên liệu tươi",
    aboutStep1Desc:
      "Heo, gà, vịt được nhập từ trang trại uy tín, kiểm tra kỹ càng trước khi nhận — đảm bảo tươi sống, không dùng hàng đông lạnh.",

    aboutStep2Title: "Ướp gia vị bí truyền",
    aboutStep2Desc:
      "Ướp qua đêm với hơn 10 loại gia vị theo công thức gia truyền, để gia vị thấm đều từng thớ thịt từ trong ra ngoài.",

    aboutStep3Title: "Quay than hoa 3–4 giờ",
    aboutStep3Desc:
      "Quay chậm bằng than hoa, xoay đều tay liên tục để da vàng giòn đều — không dùng lò điện, giữ đúng hương than truyền thống.",

    aboutStep4Title: "Giao đến tay bạn",
    aboutStep4Desc:
      "Chặt nóng, đóng gói cẩn thận, giao tận nơi trong ngày hoặc nhận trực tiếp tại cửa hàng 160 Đường Số 11, Bình Tân.",

    // Commitments
    aboutCommit1Title: "Nguyên liệu tươi sạch",
    aboutCommit1Desc:
      "Nhập nguyên liệu mỗi ngày từ các nhà cung cấp uy tín, không dùng hàng đông lạnh hay phụ gia tăng màu.",

    aboutCommit2Title: "Công thức gia truyền",
    aboutCommit2Desc:
      "Bí quyết ướp và quay được gìn giữ qua nhiều năm, tạo nên hương vị đặc trưng riêng của Heo Quay Bình Tân.",

    aboutCommit3Title: "Giao hàng tận nơi",
    aboutCommit3Desc:
      "Nhận đặt online, giao hàng trong ngày khu vực Bình Tân và các quận lân cận. Đặt trước để đảm bảo có hàng.",

    aboutCommit4Title: "Giá cả hợp lý",
    aboutCommit4Desc:
      "Chất lượng không cắt giảm, giá không đội lên. Phục vụ từ bữa cơm gia đình đến tiệc lớn cưới hỏi, cúng giỗ.",
  }

  await db.siteConfig.update({
    where: { id: "default" },
    data: { data: updated },
  })

  console.log("✓ Đã cập nhật nội dung Về chúng tôi vào siteConfig.")
}

main().catch(console.error).finally(() => db.$disconnect())
