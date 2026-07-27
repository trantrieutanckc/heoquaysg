const { PrismaClient } = require("@prisma/client")
const fs = require("fs")
const path = require("path")

const prisma = new PrismaClient()

async function main() {
  console.log("Đang export data từ Supabase...")

  const data = {}

  data.users = await prisma.user.findMany()
  console.log(`  users: ${data.users.length} rows`)

  data.posts = await prisma.post.findMany()
  console.log(`  posts: ${data.posts.length} rows`)

  data.categories = await prisma.category.findMany()
  console.log(`  categories: ${data.categories.length} rows`)

  data.postCategories = await prisma.postCategory.findMany()
  console.log(`  postCategories: ${data.postCategories.length} rows`)

  data.comments = await prisma.comment.findMany()
  console.log(`  comments: ${data.comments.length} rows`)

  data.tags = await prisma.tag.findMany()
  console.log(`  tags: ${data.tags.length} rows`)

  data.postTags = await prisma.postTag.findMany()
  console.log(`  postTags: ${data.postTags.length} rows`)

  data.menuItems = await prisma.menuItem.findMany()
  console.log(`  menuItems: ${data.menuItems.length} rows`)

  data.siteConfig = await prisma.siteConfig.findMany()
  console.log(`  siteConfig: ${data.siteConfig.length} rows`)

  data.pages = await prisma.page.findMany()
  console.log(`  pages: ${data.pages.length} rows`)

  data.dishGroups = await prisma.dishGroup.findMany()
  console.log(`  dishGroups: ${data.dishGroups.length} rows`)

  data.dishes = await prisma.dish.findMany()
  console.log(`  dishes: ${data.dishes.length} rows`)

  data.bookings = await prisma.booking.findMany().catch(() => [])
  console.log(`  bookings: ${data.bookings.length} rows`)

  data.subscribers = await prisma.subscriber.findMany().catch(() => [])
  console.log(`  subscribers: ${data.subscribers.length} rows`)

  data.notifications = await prisma.notification.findMany().catch(() => [])
  console.log(`  notifications: ${data.notifications.length} rows`)

  data.refreshTokens = await prisma.refreshToken.findMany().catch(() => [])
  console.log(`  refreshTokens: ${data.refreshTokens.length} rows`)

  const outPath = path.join(__dirname, "../heoquaybinhtan_data.json")
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2), "utf8")
  console.log(`\nXong! File: ${outPath}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
