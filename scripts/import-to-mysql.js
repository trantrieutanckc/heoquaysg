const { PrismaClient } = require("@prisma/client")
const fs = require("fs")
const path = require("path")

const prisma = new PrismaClient()
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "../heoquaybinhtan_data.json"), "utf8"))

function fixDate(val) {
  return val ? new Date(val) : null
}

async function main() {
  console.log("Importing data vào MySQL...")

  // users
  for (const r of data.users) {
    await prisma.user.upsert({
      where: { id: r.id },
      update: {},
      create: {
        id: r.id,
        name: r.name,
        email: r.email,
        emailVerified: fixDate(r.emailVerified),
        image: r.image,
        role: r.role,
        password: r.password,
        createdAt: fixDate(r.createdAt),
        updatedAt: fixDate(r.updatedAt),
      },
    })
  }
  console.log(`  ✓ users: ${data.users.length}`)

  // categories
  for (const r of data.categories) {
    await prisma.category.upsert({
      where: { id: r.id },
      update: {},
      create: {
        id: r.id,
        name: r.name,
        slug: r.slug,
        description: r.description,
        published: r.published,
        image: r.image ?? undefined,
        order: r.order,
        seoTitle: r.seoTitle,
        seoDescription: r.seoDescription,
        seoKeywords: r.seoKeywords,
        seoImage: r.seoImage,
        template: r.template,
        banner: r.banner ?? undefined,
        createdAt: fixDate(r.createdAt),
        updatedAt: fixDate(r.updatedAt),
      },
    })
  }
  console.log(`  ✓ categories: ${data.categories.length}`)

  // tags
  for (const r of data.tags) {
    await prisma.tag.upsert({
      where: { id: r.id },
      update: {},
      create: {
        id: r.id,
        name: r.name,
        slug: r.slug,
        createdAt: fixDate(r.createdAt),
      },
    })
  }
  console.log(`  ✓ tags: ${data.tags.length}`)

  // posts
  for (const r of data.posts) {
    await prisma.post.upsert({
      where: { id: r.id },
      update: {},
      create: {
        id: r.id,
        title: r.title,
        content: r.content ?? undefined,
        published: r.published,
        featured: r.featured,
        authorId: r.authorId,
        image: r.image ?? undefined,
        likes: r.likes,
        seoTitle: r.seoTitle,
        seoDescription: r.seoDescription,
        seoKeywords: r.seoKeywords,
        seoImage: r.seoImage,
        template: r.template,
        banner: r.banner ?? undefined,
        relatedPostIds: r.relatedPostIds ?? undefined,
        slug: r.slug,
        scheduledAt: fixDate(r.scheduledAt),
        bookable: r.bookable,
        ctaEnabled: r.ctaEnabled,
        ctaTitle: r.ctaTitle,
        ctaDesc: r.ctaDesc,
        ctaImage: r.ctaImage,
        ctaBtn2Label: r.ctaBtn2Label,
        ctaBtn2Url: r.ctaBtn2Url,
        avgRating: r.avgRating,
        ratingCount: r.ratingCount,
        createdAt: fixDate(r.createdAt),
        updatedAt: fixDate(r.updatedAt),
      },
    })
  }
  console.log(`  ✓ posts: ${data.posts.length}`)

  // postCategories
  for (const r of data.postCategories) {
    await prisma.postCategory.upsert({
      where: { postId_categoryId: { postId: r.postId, categoryId: r.categoryId } },
      update: {},
      create: { postId: r.postId, categoryId: r.categoryId },
    })
  }
  console.log(`  ✓ postCategories: ${data.postCategories.length}`)

  // postTags
  for (const r of data.postTags) {
    await prisma.postTag.upsert({
      where: { postId_tagId: { postId: r.postId, tagId: r.tagId } },
      update: {},
      create: { postId: r.postId, tagId: r.tagId },
    })
  }
  console.log(`  ✓ postTags: ${data.postTags.length}`)

  // menuItems
  for (const r of data.menuItems) {
    await prisma.menuItem.upsert({
      where: { id: r.id },
      update: {},
      create: {
        id: r.id,
        title: r.title,
        href: r.href,
        type: r.type,
        order: r.order,
        disabled: r.disabled,
        categoryId: r.categoryId,
      },
    })
  }
  console.log(`  ✓ menuItems: ${data.menuItems.length}`)

  // siteConfig
  for (const r of data.siteConfig) {
    await prisma.siteConfig.upsert({
      where: { id: r.id },
      update: { data: r.data },
      create: { id: r.id, data: r.data },
    })
  }
  console.log(`  ✓ siteConfig: ${data.siteConfig.length}`)

  // dishGroups
  for (const r of data.dishGroups) {
    await prisma.dishGroup.upsert({
      where: { id: r.id },
      update: {},
      create: {
        id: r.id,
        name: r.name,
        order: r.order,
        createdAt: fixDate(r.createdAt),
        updatedAt: fixDate(r.updatedAt),
      },
    })
  }
  console.log(`  ✓ dishGroups: ${data.dishGroups.length}`)

  // dishes
  for (const r of data.dishes) {
    await prisma.dish.upsert({
      where: { id: r.id },
      update: {},
      create: {
        id: r.id,
        name: r.name,
        description: r.description,
        unit: r.unit,
        image: r.image,
        postId: r.postId,
        available: r.available,
        order: r.order,
        groupId: r.groupId,
        createdAt: fixDate(r.createdAt),
        updatedAt: fixDate(r.updatedAt),
      },
    })
  }
  console.log(`  ✓ dishes: ${data.dishes.length}`)

  console.log("\n✅ Import xong!")
}

main()
  .catch((e) => { console.error("LỖI:", e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
