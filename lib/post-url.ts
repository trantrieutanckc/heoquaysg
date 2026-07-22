export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export function postUrl(
  post: { id: string; slug?: string | null },
  useSlugs: boolean
): string {
  return useSlugs && post.slug ? `/posts/${post.slug}` : `/posts/${post.id}`
}
