"use client"

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { TagSelector } from "@/components/admin/tag-selector"

interface Tag {
  id: string
  name: string
  slug: string
}

interface Props {
  tags: Tag[]
  selectedTagIds: string[]
  onChange: (ids: string[]) => void
  onTagCreated: (tag: Tag) => void
}

export function EditorTagSection({ tags, selectedTagIds, onChange, onTagCreated }: Props) {
  return (
    <AccordionItem value="tags">
      <AccordionTrigger className="text-base font-medium">
        Tags
        {selectedTagIds.length > 0 && (
          <span className="ml-2 text-xs text-muted-foreground font-normal">
            {selectedTagIds.length} đã chọn
          </span>
        )}
      </AccordionTrigger>
      <AccordionContent>
        <div className="pt-2">
          <TagSelector
            tags={tags}
            selected={selectedTagIds}
            onChange={onChange}
            onTagCreated={onTagCreated}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
