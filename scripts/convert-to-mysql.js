const fs = require("fs")
const path = require("path")

const data = JSON.parse(fs.readFileSync(path.join(__dirname, "../heoquaybinhtan_data.json"), "utf8"))

function esc(val) {
  if (val === null || val === undefined) return "NULL"
  if (typeof val === "boolean") return val ? "1" : "0"
  if (typeof val === "number") return val
  if (typeof val === "object") return `'${JSON.stringify(val).replace(/'/g, "''").replace(/\\/g, "\\\\")}'`
  return `'${String(val).replace(/\\/g, "\\\\").replace(/'/g, "''")}'`
}

function dt(val) {
  if (!val) return "NULL"
  return `'${new Date(val).toISOString().slice(0, 19).replace("T", " ")}'`
}

let sql = `-- Heo Quay Binh Tan — MySQL Export
-- Tao: ${new Date().toLocaleString("vi-VN")}
-- Import vao phpMyAdmin

SET FOREIGN_KEY_CHECKS=0;
SET NAMES utf8mb4;

`

// ── users ────────────────────────────────────────────────
sql += `DROP TABLE IF EXISTS \`users\`;
CREATE TABLE \`users\` (
  \`id\` varchar(191) NOT NULL,
  \`name\` varchar(191) DEFAULT NULL,
  \`email\` varchar(191) DEFAULT NULL,
  \`emailVerified\` datetime DEFAULT NULL,
  \`image\` text DEFAULT NULL,
  \`role\` enum('ADMIN','EDITOR','CONTRIBUTOR') NOT NULL DEFAULT 'CONTRIBUTOR',
  \`password\` varchar(191) DEFAULT NULL,
  \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`email\` (\`email\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`

for (const r of data.users) {
  sql += `INSERT INTO \`users\` VALUES (${esc(r.id)},${esc(r.name)},${esc(r.email)},${dt(r.emailVerified)},${esc(r.image)},${esc(r.role)},${esc(r.password)},${dt(r.createdAt)},${dt(r.updatedAt)});\n`
}

// ── categories ───────────────────────────────────────────
sql += `\nDROP TABLE IF EXISTS \`categories\`;
CREATE TABLE \`categories\` (
  \`id\` varchar(191) NOT NULL,
  \`name\` varchar(191) NOT NULL,
  \`slug\` varchar(191) NOT NULL,
  \`description\` text DEFAULT NULL,
  \`published\` tinyint(1) NOT NULL DEFAULT 1,
  \`image\` json DEFAULT NULL,
  \`order\` int NOT NULL DEFAULT 0,
  \`seoTitle\` varchar(191) DEFAULT NULL,
  \`seoDescription\` text DEFAULT NULL,
  \`seoKeywords\` text DEFAULT NULL,
  \`seoImage\` varchar(191) DEFAULT NULL,
  \`template\` varchar(191) NOT NULL DEFAULT 'standard',
  \`banner\` json DEFAULT NULL,
  \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`slug\` (\`slug\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`

for (const r of data.categories) {
  sql += `INSERT INTO \`categories\` VALUES (${esc(r.id)},${esc(r.name)},${esc(r.slug)},${esc(r.description)},${r.published ? 1 : 0},${esc(r.image)},${r.order},${esc(r.seoTitle)},${esc(r.seoDescription)},${esc(r.seoKeywords)},${esc(r.seoImage)},${esc(r.template)},${esc(r.banner)},${dt(r.createdAt)},${dt(r.updatedAt)});\n`
}

// ── posts ────────────────────────────────────────────────
sql += `\nDROP TABLE IF EXISTS \`posts\`;
CREATE TABLE \`posts\` (
  \`id\` varchar(191) NOT NULL,
  \`title\` varchar(191) NOT NULL,
  \`content\` longtext DEFAULT NULL,
  \`published\` tinyint(1) NOT NULL DEFAULT 0,
  \`featured\` tinyint(1) NOT NULL DEFAULT 0,
  \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`authorId\` varchar(191) NOT NULL,
  \`image\` json DEFAULT NULL,
  \`likes\` int NOT NULL DEFAULT 0,
  \`seoTitle\` varchar(191) DEFAULT NULL,
  \`seoDescription\` text DEFAULT NULL,
  \`seoKeywords\` text DEFAULT NULL,
  \`seoImage\` varchar(191) DEFAULT NULL,
  \`template\` varchar(191) NOT NULL DEFAULT 'standard',
  \`banner\` json DEFAULT NULL,
  \`relatedPostIds\` json DEFAULT NULL,
  \`slug\` varchar(191) DEFAULT NULL,
  \`scheduledAt\` datetime DEFAULT NULL,
  \`bookable\` tinyint(1) NOT NULL DEFAULT 0,
  \`ctaEnabled\` tinyint(1) NOT NULL DEFAULT 1,
  \`ctaTitle\` varchar(191) DEFAULT NULL,
  \`ctaDesc\` text DEFAULT NULL,
  \`ctaImage\` varchar(191) DEFAULT NULL,
  \`ctaBtn2Label\` varchar(191) DEFAULT NULL,
  \`ctaBtn2Url\` varchar(191) DEFAULT NULL,
  \`avgRating\` float DEFAULT NULL,
  \`ratingCount\` int NOT NULL DEFAULT 0,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`slug\` (\`slug\`),
  KEY \`authorId\` (\`authorId\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`

for (const r of data.posts) {
  sql += `INSERT INTO \`posts\` VALUES (${esc(r.id)},${esc(r.title)},${esc(r.content)},${r.published?1:0},${r.featured?1:0},${dt(r.createdAt)},${dt(r.updatedAt)},${esc(r.authorId)},${esc(r.image)},${r.likes},${esc(r.seoTitle)},${esc(r.seoDescription)},${esc(r.seoKeywords)},${esc(r.seoImage)},${esc(r.template)},${esc(r.banner)},${esc(r.relatedPostIds)},${esc(r.slug)},${dt(r.scheduledAt)},${r.bookable?1:0},${r.ctaEnabled?1:0},${esc(r.ctaTitle)},${esc(r.ctaDesc)},${esc(r.ctaImage)},${esc(r.ctaBtn2Label)},${esc(r.ctaBtn2Url)},${r.avgRating??'NULL'},${r.ratingCount});\n`
}

// ── post_categories ──────────────────────────────────────
sql += `\nDROP TABLE IF EXISTS \`post_categories\`;
CREATE TABLE \`post_categories\` (
  \`postId\` varchar(191) NOT NULL,
  \`categoryId\` varchar(191) NOT NULL,
  PRIMARY KEY (\`postId\`,\`categoryId\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`

for (const r of data.postCategories) {
  sql += `INSERT INTO \`post_categories\` VALUES (${esc(r.postId)},${esc(r.categoryId)});\n`
}

// ── tags ─────────────────────────────────────────────────
sql += `\nDROP TABLE IF EXISTS \`tags\`;
CREATE TABLE \`tags\` (
  \`id\` varchar(191) NOT NULL,
  \`name\` varchar(191) NOT NULL,
  \`slug\` varchar(191) NOT NULL,
  \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`name\` (\`name\`),
  UNIQUE KEY \`slug\` (\`slug\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`

for (const r of data.tags) {
  sql += `INSERT INTO \`tags\` VALUES (${esc(r.id)},${esc(r.name)},${esc(r.slug)},${dt(r.createdAt)});\n`
}

// ── post_tags ────────────────────────────────────────────
sql += `\nDROP TABLE IF EXISTS \`post_tags\`;
CREATE TABLE \`post_tags\` (
  \`postId\` varchar(191) NOT NULL,
  \`tagId\` varchar(191) NOT NULL,
  PRIMARY KEY (\`postId\`,\`tagId\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`

for (const r of data.postTags) {
  sql += `INSERT INTO \`post_tags\` VALUES (${esc(r.postId)},${esc(r.tagId)});\n`
}

// ── menu_items ───────────────────────────────────────────
sql += `\nDROP TABLE IF EXISTS \`menu_items\`;
CREATE TABLE \`menu_items\` (
  \`id\` varchar(191) NOT NULL,
  \`title\` varchar(191) NOT NULL,
  \`href\` varchar(191) NOT NULL,
  \`type\` varchar(191) NOT NULL DEFAULT 'custom',
  \`order\` int NOT NULL DEFAULT 0,
  \`disabled\` tinyint(1) NOT NULL DEFAULT 0,
  \`categoryId\` varchar(191) DEFAULT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`

for (const r of data.menuItems) {
  sql += `INSERT INTO \`menu_items\` VALUES (${esc(r.id)},${esc(r.title)},${esc(r.href)},${esc(r.type)},${r.order},${r.disabled?1:0},${esc(r.categoryId)});\n`
}

// ── site_config ──────────────────────────────────────────
sql += `\nDROP TABLE IF EXISTS \`site_config\`;
CREATE TABLE \`site_config\` (
  \`id\` varchar(191) NOT NULL DEFAULT 'default',
  \`data\` json NOT NULL,
  \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`

for (const r of data.siteConfig) {
  sql += `INSERT INTO \`site_config\` VALUES (${esc(r.id)},${esc(r.data)},${dt(r.updatedAt)});\n`
}

// ── dish_groups ──────────────────────────────────────────
sql += `\nDROP TABLE IF EXISTS \`dish_groups\`;
CREATE TABLE \`dish_groups\` (
  \`id\` varchar(191) NOT NULL,
  \`name\` varchar(191) NOT NULL,
  \`order\` int NOT NULL DEFAULT 0,
  \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`

for (const r of data.dishGroups) {
  sql += `INSERT INTO \`dish_groups\` VALUES (${esc(r.id)},${esc(r.name)},${r.order},${dt(r.createdAt)},${dt(r.updatedAt)});\n`
}

// ── dishes ───────────────────────────────────────────────
sql += `\nDROP TABLE IF EXISTS \`dishes\`;
CREATE TABLE \`dishes\` (
  \`id\` varchar(191) NOT NULL,
  \`name\` varchar(191) NOT NULL,
  \`description\` text DEFAULT NULL,
  \`unit\` varchar(191) NOT NULL DEFAULT 'phần',
  \`image\` text DEFAULT NULL,
  \`postId\` varchar(191) DEFAULT NULL,
  \`available\` tinyint(1) NOT NULL DEFAULT 1,
  \`order\` int NOT NULL DEFAULT 0,
  \`groupId\` varchar(191) NOT NULL,
  \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`groupId\` (\`groupId\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`

for (const r of data.dishes) {
  sql += `INSERT INTO \`dishes\` VALUES (${esc(r.id)},${esc(r.name)},${esc(r.description)},${esc(r.unit)},${esc(r.image)},${esc(r.postId)},${r.available?1:0},${r.order},${esc(r.groupId)},${dt(r.createdAt)},${dt(r.updatedAt)});\n`
}

sql += `\nSET FOREIGN_KEY_CHECKS=1;\n`

const outPath = path.join(__dirname, "../heoquaybinhtan_mysql.sql")
fs.writeFileSync(outPath, sql, "utf8")
console.log(`Xong! File: ${outPath}`)
