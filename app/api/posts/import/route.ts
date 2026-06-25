import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { isEditor } from "@/lib/permissions"

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let i = 0
  while (i <= line.length) {
    if (i === line.length) break
    if (line[i] === '"') {
      let j = i + 1
      let field = ""
      while (j < line.length) {
        if (line[j] === '"' && line[j + 1] === '"') { field += '"'; j += 2 }
        else if (line[j] === '"') { j++; break }
        else { field += line[j++] }
      }
      result.push(field)
      i = line[j] === "," ? j + 1 : j
    } else {
      const end = line.indexOf(",", i)
      if (end === -1) { result.push(line.slice(i)); break }
      result.push(line.slice(i, end))
      i = end + 1
    }
  }
  return result
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) return []
  const headers = parseCSVLine(lines[0]).map((h) => h.trim().toLowerCase())
  return lines.slice(1)
    .filter((l) => l.trim())
    .map((line) => {
      const values = parseCSVLine(line)
      return Object.fromEntries(headers.map((h, i) => [h, (values[i] ?? "").trim()]))
    })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return new Response("Unauthorized", { status: 403 })
  if (!isEditor((session.user as any).role)) return new Response("Forbidden", { status: 403 })

  let text: string
  try {
    const form = await req.formData()
    const file = form.get("file") as File | null
    if (!file) return new Response(JSON.stringify({ error: "Không tìm thấy file." }), { status: 400 })
    text = await file.text()
  } catch {
    return new Response(JSON.stringify({ error: "Không đọc được file." }), { status: 400 })
  }

  const rows = parseCSV(text)
  if (!rows.length) {
    return new Response(
      JSON.stringify({ created: 0, errors: ["File CSV trống hoặc không có dòng dữ liệu."] }),
      { status: 422 }
    )
  }

  // Pre-load categories for name → id lookup
  const allCategories = await db.category.findMany({ select: { id: true, name: true } })
  const catByName = new Map(allCategories.map((c) => [c.name.toLowerCase(), c.id]))

  let created = 0
  const errors: string[] = []

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const title = row.title?.trim()
    if (!title) {
      errors.push(`Dòng ${i + 2}: thiếu tiêu đề (cột "title")`)
      continue
    }

    const rawPrice = row.price?.trim()
    const price = rawPrice ? parseFloat(rawPrice.replace(/[^0-9.]/g, "")) : null

    const categoryNames = row.categories
      ? row.categories.split("|").map((s) => s.trim()).filter(Boolean)
      : []
    const categoryIds = categoryNames
      .map((n) => catByName.get(n.toLowerCase()))
      .filter((id): id is string => !!id)

    const unknownCats = categoryNames.filter((n) => !catByName.has(n.toLowerCase()))
    if (unknownCats.length) {
      errors.push(`Dòng ${i + 2}: danh mục không tồn tại — ${unknownCats.join(", ")}`)
    }

    try {
      await db.post.create({
        data: {
          title,
          published: false,
          authorId: session.user.id,
          price: price !== null && !isNaN(price) ? price : null,
          ...(categoryIds.length
            ? { categories: { create: categoryIds.map((categoryId) => ({ categoryId })) } }
            : {}),
        },
      })
      created++
    } catch {
      errors.push(`Dòng ${i + 2}: "${title}" — tạo thất bại`)
    }
  }

  return new Response(JSON.stringify({ created, errors }), {
    headers: { "Content-Type": "application/json" },
  })
}
