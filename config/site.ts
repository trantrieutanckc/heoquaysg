import { SiteConfig } from "types"

const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace("http://localhost:3000", "https://heoquaybinhtan.com") || "https://heoquaybinhtan.com"

export const siteConfig: SiteConfig = {
  name: "Heo Quay Bình Tân",
  description:
    "Chuyên heo quay, vịt quay, gà quay chất lượng cao. Công thức gia truyền, nguyên liệu tươi sạch.",
  url: baseUrl,
  ogImage: `${baseUrl}/og.jpg`,
  links: {
    twitter: "",
    github: "",
  },
}
