import { NextResponse } from "next/server"

import { db } from "@/lib/db"

export async function DELETE(
  _req: Request,
  { params }: { params: { categoryId: string } }
) {
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
  try {
    const { name, slug, image, order, template, seoTitle, seoDescription, seoKeywords, seoImage, banner } = await req.json()
    const category = await db.category.update({
      where: { id: params.categoryId },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
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
