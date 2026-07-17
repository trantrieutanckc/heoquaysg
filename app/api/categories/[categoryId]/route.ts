import { NextResponse } from "next/server"

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

export async function DELETE(
  _req: Request,
  { params }: { params: { categoryId: string } }
) {
  const user = await getCurrentUser()
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await db.category.delete({ where: { id: params.categoryId } })
    return new Response(null, { status: 200 })
  } catch {
    return new Response(null, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  const user = await getCurrentUser()
  if (!user || (user.role !== "ADMIN" && user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { name, slug, description, image, order, template, seoTitle, seoDescription, seoKeywords, seoImage, banner, published } = await req.json()
    const category = await db.category.update({
      where: { id: params.categoryId },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description: description || null }),
        ...(published !== undefined && { published }),
        ...(image !== undefined && { image: image ?? undefined }),
        ...(order !== undefined && { order }),
        ...(template !== undefined && { template }),
        ...(seoTitle !== undefined && { seoTitle }),
        ...(seoDescription !== undefined && { seoDescription }),
        ...(seoKeywords !== undefined && { seoKeywords }),
        ...(seoImage !== undefined && { seoImage }),
        ...(banner !== undefined && { banner: banner ?? undefined }),
      },
    })
    return NextResponse.json(category)
  } catch {
    return new Response(null, { status: 500 })
  }
}
