const { PrismaClient } = require("@prisma/client")
const db = new PrismaClient()

const MENU = [
  {
    name: "Heo Quay",
    order: 1,
    dishes: [
      { name: "Heo Quay (bán lẻ theo kg)",     price: 185000, unit: "kg",      order: 1 },
      { name: "Heo Quay Nguyên Con (~18–22kg)", price: 3200000, unit: "con",    order: 2 },
      { name: "Heo Quay Nửa Con",               price: 1650000, unit: "nửa con", order: 3 },
      { name: "Heo Quay Phần (đặt ăn lẻ)",      price: 45000,  unit: "phần",   order: 4 },
    ],
  },
  {
    name: "Heo Sữa Quay",
    order: 2,
    dishes: [
      { name: "Heo Sữa Nguyên Con (3–4 kg)",   price: 600000,  unit: "con",   order: 1 },
      { name: "Heo Sữa Nguyên Con (5–6 kg)",   price: 850000,  unit: "con",   order: 2 },
      { name: "Heo Sữa Nguyên Con (7–8 kg)",   price: 1100000, unit: "con",   order: 3 },
      { name: "Heo Sữa Quay Lu",                price: 750000,  unit: "con",   order: 4, description: "Quay theo kỹ thuật lu đất nung truyền thống" },
    ],
  },
  {
    name: "Gà Quay",
    order: 3,
    dishes: [
      { name: "Gà Quay Nguyên Con (~1.2–1.5 kg)", price: 140000, unit: "con",     order: 1 },
      { name: "Gà Quay Nửa Con",                   price: 75000,  unit: "nửa con", order: 2 },
      { name: "Gà Quay Mật Ong",                   price: 155000, unit: "con",     order: 3 },
      { name: "Gà Quay Ngũ Vị",                    price: 150000, unit: "con",     order: 4 },
    ],
  },
  {
    name: "Vịt Quay",
    order: 4,
    dishes: [
      { name: "Vịt Quay Nguyên Con (~1.8–2 kg)", price: 220000, unit: "con",     order: 1 },
      { name: "Vịt Quay Nửa Con",                 price: 115000, unit: "nửa con", order: 2 },
      { name: "Vịt Quay Quảng Đông",              price: 235000, unit: "con",     order: 3 },
      { name: "Vịt Quay Chao",                    price: 225000, unit: "con",     order: 4 },
    ],
  },
]

async function main() {
  for (const group of MENU) {
    const g = await db.dishGroup.create({
      data: {
        name: group.name,
        order: group.order,
        dishes: {
          create: group.dishes.map(d => ({
            name: d.name,
            price: d.price,
            unit: d.unit,
            order: d.order,
            description: d.description ?? null,
            available: true,
          })),
        },
      },
      include: { dishes: true },
    })
    console.log(`✓ ${g.name} — ${g.dishes.length} món`)
  }
  console.log("\nXong! Vào dashboard/menu để chỉnh giá.")
}

main().catch(console.error).finally(() => db.$disconnect())
