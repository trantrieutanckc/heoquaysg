import * as z from "zod"

const imageObjectSchema = z.object({
  url: z.string().url({ message: "Định dạng link ảnh không hợp lệ" }).or(z.literal("")),
  alt: z.string().optional(),
  title: z.string().optional(),
})

export const postPatchSchema = z.object({
  title: z.string().min(3).max(128).optional(),

  // TODO: Type this properly from editorjs block types?
  content: z.any().optional(),
  image: imageObjectSchema.optional().nullable(),
})
type FormData = z.infer<typeof postPatchSchema>