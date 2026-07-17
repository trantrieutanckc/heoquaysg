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
  if (!session || !isEditor(session.user.role)) {
    return new Response("Forbidden", { status: 403 })
  }

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

  // Cache groups để tránh query lặp
  const groupCache = new Map<string, string>()

  async function getOrCreateGroup(name: string): Promise<string> {
    const key = name.toLowerCase()
    if (groupCache.has(key)) return groupCache.get(key)!
    const existing = await db.dishGroup.findFirst({ where: { name } })
    if (existing) {
      groupCache.set(key, existing.id)
      return existing.id
    }
    const maxOrder = await db.dishGroup.aggregate({ _max: { order: true } })
    const created = await db.dishGroup.create({
      data: { name, order: (maxOrder._max.order ?? 0) + 1 },
    })
    groupCache.set(key, created.id)
    return created.id
  }

  let created = 0
  const errors: string[] = []

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const groupName = row.group?.trim()
    const name = row.name?.trim()

    if (!groupName) { errors.push(`Dòng ${i + 2}: thiếu tên nhóm (cột "group")`); continue }
    if (!name) { errors.push(`Dòng ${i + 2}: thiếu tên món (cột "name")`); continue }

    const rawPrice = row.price?.trim()
    const price = rawPrice ? parseFloat(rawPrice.replace(/[^0-9.]/g, "")) : NaN
    if (isNaN(price) || price < 0) {
      errors.push(`Dòng ${i + 2}: giá không hợp lệ — "${rawPrice}"`)
      continue
    }

    const unit = row.unit?.trim() || "phần"
    const description = row.description?.trim() || null
    const available = row.available?.trim().toLowerCase() !== "false"
    const order = parseInt(row.order ?? "0") || 0

    try {
      const groupId = await getOrCreateGroup(groupName)
      await db.dish.create({
        data: { name, description, price, unit, available, order, groupId },
      })
      created++
    } catch {
      errors.push(`Dòng ${i + 2}: "${name}" — tạo thất bại`)
    }
  }

  return new Response(JSON.stringify({ created, errors }), {
    headers: { "Content-Type": "application/json" },
  })
}
