export const dynamic = "force-dynamic"

import { notFound, redirect } from "next/navigation"
import { Post, User } from "@prisma/client"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { isAdmin } from "@/lib/permissions"
import type { Role } from "@/lib/permissions"
import { Editor } from "@/components/admin/editor"

async function getPostForUser(postId: Post["id"], userId: User["id"], admin: boolean) {
  return await db.post.findFirst({
    where: admin ? { id: postId } : { id: postId, authorId: userId },
    include: {
      categories: { select: { categoryId: true } },
      tags: { select: { tagId: true } },
    },
  })
}

interface EditorPageProps {
  params: { postId: string }
}

export default async function EditorPage({ params }: EditorPageProps) {

  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const [post, categories, allPosts, tags] = await Promise.all([
    getPostForUser(params.postId, user.id, isAdmin((user.role ?? "CONTRIBUTOR") as Role)),
    db.category.findMany({ orderBy: { name: "asc" } }),
    db.post.findMany({ select: { id: true, title: true }, orderBy: { createdAt: "desc" } }),
    db.tag.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, slug: true } }),
  ])

  if (!post) {
    notFound()
  }

  const postCategoryIds = post.categories.map((c) => c.categoryId)
  const postTagIds = post.tags.map((t) => t.tagId)

  return (
    <Editor
      post={{
        id: post.id,
        title: post.title,
        content: post.content,
        image: post.image,
        published: post.published,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        seoKeywords: post.seoKeywords,
        seoImage: post.seoImage,
        template: post.template,
        banner: post.banner,
        relatedPostIds: post.relatedPostIds,
        price: post.price,
        scheduledAt: post.scheduledAt,
        bookable: post.bookable,
        ctaEnabled: post.ctaEnabled,
        ctaTitle: post.ctaTitle,
        ctaDesc: post.ctaDesc,
        ctaImage: post.ctaImage,
        ctaBtn2Label: post.ctaBtn2Label,
        ctaBtn2Url: post.ctaBtn2Url,
        slug: post.slug,
      }}
      categories={categories}
      postCategoryIds={postCategoryIds}
      allPosts={allPosts}
      tags={tags}
      postTagIds={postTagIds}
    />
  )
}
