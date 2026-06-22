export const CATEGORY_TEMPLATES = [
  {
    value: "standard",
    label: "Danh sách",
    description: "Bài viết theo hàng dọc với ảnh thu nhỏ bên trái",
  },
  {
    value: "grid",
    label: "Lưới ảnh",
    description: "Hiển thị dạng lưới 2–3 cột, nổi bật hình ảnh",
  },
  {
    value: "hero",
    label: "Hero banner",
    description: "Ảnh category lớn phía trên, bài viết dạng lưới bên dưới",
  },
] as const

export type CategoryTemplate = (typeof CATEGORY_TEMPLATES)[number]["value"]

export const POST_TEMPLATES = [
  {
    value: "standard",
    label: "Chuẩn",
    description: "Bố cục bài viết thông thường, đọc dễ",
  },
  {
    value: "wide",
    label: "Rộng",
    description: "Nội dung rộng hơn, phù hợp bài nhiều ảnh",
  },
  {
    value: "minimal",
    label: "Tối giản",
    description: "Giao diện đọc sạch, không hiện tác giả/category",
  },
] as const

export type PostTemplate = (typeof POST_TEMPLATES)[number]["value"]
