import Image from "next/image"
import Link from "next/link"
import { Post } from "@prisma/client"

import { BLUR_PLACEHOLDER } from "@/lib/image"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { PostOperations } from "@/components/post-operations"
import { PostAddImageButton } from "@/components/post-add-image-button"
import { PostCategoryButton } from "@/components/post-category-button"
import { FeaturedToggle } from "@/components/featured-toggle"
import { PublishToggle } from "@/components/publish-toggle"

interface PostItemProps {
  post: Pick<Post, "id" | "title" | "published" | "featured" | "createdAt" | "image" | "likes"> & {
    categories: { category: { id: string; name: string; slug: string } }[]
  }
  allCategories: { id: string; name: string }[]
}

export function PostItem({ post, allCategories }: PostItemProps) {
  const image = post.image as { url?: string; alt?: string } | null

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        {image?.url && (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md">
            <Image
              src={image.url}
              alt={image.alt || post.title}
              fill
              className="object-cover"
              placeholder="blur"
              blurDataURL={BLUR_PLACEHOLDER}
            />
          </div>
        )}
        <div className="grid gap-1">
          <Link
            href={`/editor/${post.id}`}
            className="font-semibold hover:underline"
          >
            {post.title}
          </Link>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {formatDate(post.createdAt?.toDateString())}
            </p>
            {post.categories.map(({ category }) => (
              <Badge key={category.id} variant="secondary" className="text-xs">
                {category.name}
              </Badge>
            ))}
            {post.likes > 0 && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-3 w-3 fill-rose-500 stroke-rose-500" strokeWidth={2}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                {post.likes}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <PublishToggle id={post.id} published={post.published} endpoint="posts" />
        <FeaturedToggle postId={post.id} featured={post.featured ?? false} />
        <PostCategoryButton
          postId={post.id}
          allCategories={allCategories}
          currentCategoryIds={post.categories.map((c) => c.category.id)}
        />
        {!image?.url && <PostAddImageButton postId={post.id} />}
        <PostOperations post={{ id: post.id, title: post.title }} />
      </div>
    </div>
  )
}

PostItem.Skeleton = function PostItemSkeleton() {
  return (
    <div className="p-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 shrink-0 rounded-md" />
        <div className="space-y-3">
          <Skeleton className="h-5 w-2/5" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  )
}
