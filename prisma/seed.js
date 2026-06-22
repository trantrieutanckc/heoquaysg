const { PrismaClient } = require("@prisma/client")
const { hash } = require("bcryptjs")

const db = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@heoquay.com"
  const password = process.env.ADMIN_PASSWORD || "Admin@123"
  const name = process.env.ADMIN_NAME || "Admin"

  const existing = await db.user.findUnique({ where: { email } })
  if (existing) {
    console.log(`User ${email} đã tồn tại. Bỏ qua.`)
    return
  }

  const hashed = await hash(password, 12)

  const user = await db.user.create({
    data: { email, name, password: hashed, role: "ADMIN" },
  })

  console.log(`✓ Tạo admin thành công: ${user.email} (id: ${user.id})`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => db.$disconnect())
