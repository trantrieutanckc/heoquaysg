"use client"

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { RelatedPostSelector } from "@/components/admin/related-post-selector"

interface PostOption {
  id: string
  title: string
}

interface Props {
  allPosts: PostOption[]
  currentPostId: string
  relatedPostIds: string[]
  onChange: (ids: string[]) => void
}

export function EditorRelatedSection({ allPosts, currentPostId, relatedPostIds, onChange }: Props) {
  return (
    <AccordionItem value="related">
      <AccordionTrigger className="text-base font-medium">
        Bài liên quan
        {relatedPostIds.length > 0 && (
          <span className="ml-2 text-xs text-muted-foreground font-normal">
            {relatedPostIds.length} bài
          </span>
        )}
      </AccordionTrigger>
      <AccordionContent>
        <div className="pt-2">
          <RelatedPostSelector
            allPosts={allPosts}
            currentPostId={currentPostId}
            selected={relatedPostIds}
            onChange={onChange}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
