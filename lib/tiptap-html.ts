import { generateHTML } from "@tiptap/core"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Underline from "@tiptap/extension-underline"

const extensions = [
  StarterKit.configure({ link: false, underline: false }),
  Underline,
  Link,
]

export function tiptapToHtml(json: string | null | undefined): string | null {
  if (!json) return null
  try {
    const doc = typeof json === "string" ? JSON.parse(json) : json
    return generateHTML(doc, extensions)
  } catch {
    return null
  }
}
