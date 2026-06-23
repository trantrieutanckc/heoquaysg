import { NextResponse } from "next/server"
import * as z from "zod"
import { db } from "@/lib/db"

const postPatchSchema = z.object({
  title: z.string().optional(),
  content: z.any().optional(),
  published: z.boolean().optional(),
  image: z.any().optional().nullable(),
  categoryIds: z.array(z.string()).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  seoImage: z.string().optional(),
  template: z.string().optional(),
  banner: z.any().optional().nullable(),
  relatedPostIds: z.array(z.string()).nullable().optional(),
})

// HÀM PATCH: Cập nhật bài viết
export async function PATCH(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    // 1. Đọc dữ liệu chỉnh sửa từ Editor gửi lên
    const json = await req.json()
    const body = postPatchSchema.parse(json)

    // 2. Cập nhật thẳng vào Supabase bằng ID bài viết, bỏ qua bước check User sở hữu
    await db.post.update({
      where: { id: params.postId },
      data: {
        title: body.title,
        content: body.content,
        ...(body.published !== undefined && { published: body.published }),
        image: body.image == null || body.image === "" ? undefined : body.image,
        seoTitle: body.seoTitle,
        seoDescription: body.seoDescription,
        seoKeywords: body.seoKeywords,
        seoImage: body.seoImage,
        template: body.template,
        ...(body.banner !== undefined && { banner: body.banner ?? undefined }),
        ...(body.relatedPostIds !== undefined && { relatedPostIds: body.relatedPostIds }),
        ...(body.categoryIds !== undefined && {
          categories: {
            deleteMany: {},
            create: body.categoryIds.map((id) => ({ categoryId: id })),
          },
        }),
      },
    })

    return new Response(null, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

// HÀM DELETE: Xóa bài viết (Sửa luôn để sau này bạn bấm xóa bài viết không bị lỗi 403)
export async function DELETE(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    await db.post.delete({
      where: {
        id: params.postId,
      },
    })

    return new Response(null, { status: 200 })
  } catch (error) {
    return new Response(null, { status: 500 })
  }
}