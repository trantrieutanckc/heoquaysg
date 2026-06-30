"use client"

import { cn } from "@/lib/utils"
import { POST_TEMPLATES } from "@/lib/templates"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface Props {
  postTemplate: string
  onChange: (template: string) => void
}

export function EditorTemplateSection({ postTemplate, onChange }: Props) {
  return (
    <AccordionItem value="template">
      <AccordionTrigger className="text-base font-medium">
        Template
        <span className="ml-2 text-xs text-muted-foreground font-normal">
          {POST_TEMPLATES.find((t) => t.value === postTemplate)?.label ?? postTemplate}
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="grid gap-3 pt-2">
          {POST_TEMPLATES.map((tpl) => (
            <button
              key={tpl.value}
              type="button"
              onClick={() => onChange(tpl.value)}
              className={cn(
                "flex flex-col gap-0.5 rounded-lg border p-4 text-left transition-colors",
                postTemplate === tpl.value ? "border-primary bg-primary/5" : "hover:bg-muted"
              )}
            >
              <span className="font-medium">{tpl.label}</span>
              <span className="text-sm text-muted-foreground">{tpl.description}</span>
            </button>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
