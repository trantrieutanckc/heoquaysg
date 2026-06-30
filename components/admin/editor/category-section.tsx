"use client"

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CategorySelector } from "@/components/admin/category-selector"

interface Category {
  id: string
  name: string
  slug: string
}

interface Props {
  categories: Category[]
  selectedCategoryIds: string[]
  onChange: (ids: string[]) => void
}

export function EditorCategorySection({ categories, selectedCategoryIds, onChange }: Props) {
  return (
    <AccordionItem value="category">
      <AccordionTrigger className="text-base font-medium">
        Danh mục
        {selectedCategoryIds.length > 0 && (
          <span className="ml-2 text-xs text-muted-foreground font-normal">
            {selectedCategoryIds.length} đã chọn
          </span>
        )}
      </AccordionTrigger>
      <AccordionContent>
        <div className="pt-2">
          <CategorySelector
            categories={categories}
            selected={selectedCategoryIds}
            onChange={onChange}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
