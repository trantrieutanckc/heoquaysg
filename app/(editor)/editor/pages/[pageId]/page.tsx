import { notFound, redirect } from "next/navigation"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { PageEditor } from "@/components/admin/page-editor"

interface Props {
  params: { pageId: string }
}

export default async function PageEditorPage({ params }: Props) {
  const user = await getCurrentUser()
  if (!user || (user as any).role !== "ADMIN") redirect("/dashboard")

  const page = await db.page.findUnique({ where: { id: params.pageId } })
  if (!page) notFound()

  return (
    <PageEditor
      page={{
        id: page.id,
        title: page.title,
        slug: page.slug,
        content: page.content,
        published: page.published,
        image: page.image,
        seoTitle: page.seoTitle,
        seoDescription: page.seoDescription,
        seoKeywords: page.seoKeywords,
        seoImage: page.seoImage,
        banner: page.banner,
      }}
    />
  )
}
