export const dynamic = "force-dynamic"

import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { EditorJsRenderer } from "@/components/editorjs-renderer"
import { TiptapRenderer } from "@/components/tiptap-renderer"

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props) {
  const page = await db.page.findFirst({
    where: { slug: params.slug, published: true },
    select: { title: true },
  })
  if (!page) return {}
  return { title: page.title }
}

export default async function StaticPage({ params }: Props) {
  const page = await db.page.findFirst({
    where: { slug: params.slug, published: true },
  })

  if (!page) notFound()

  const isTiptap = page.content && typeof page.content === "object" && (page.content as any).type === "doc"

  return (
    <div className="container max-w-3xl py-12 px-4">
      <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-8">{page.title}</h1>
      {page.content && (
        isTiptap
          ? <TiptapRenderer content={page.content} className="prose prose-stone dark:prose-invert max-w-none [&_.tiptap-columns]:grid [&_.tiptap-columns]:grid-cols-2 [&_.tiptap-columns]:gap-6 [&_.tiptap-column]:min-w-0" />
          : <div className="prose prose-stone dark:prose-invert max-w-none"><EditorJsRenderer content={page.content} /></div>
      )}
    </div>
  )
}
