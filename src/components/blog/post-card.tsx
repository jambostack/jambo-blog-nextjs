import Link from "next/link";
import Image from "next/image";
import { formatDate, getAvatarUrl, getCoverImageUrl } from "@/lib/utils";
import { Post } from "@/types/blog";

interface PostCardProps {
	post: Post;
	isPriority?: boolean;
}

export default function PostCard({ post, isPriority = false }: PostCardProps) {
	return (
		<article className="group flex flex-col overflow-hidden rounded-lg border bg-card transition-colors hover:border-primary">
			<div className="relative aspect-video overflow-hidden">
				<Link href={`/blog/${post.slug}`} className="relative block h-full w-full">
					{post.coverImage ? (
						<Image
							src={getCoverImageUrl(post.coverImage)}
							alt={post.title}
							fill
							{...(isPriority && { priority: true })}
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
							className="object-cover transition-transform duration-300 group-hover:scale-105"
						/>
					) : (
						<div className="h-full w-full bg-muted" />
					)}
				</Link>
			</div>
			<div className="flex flex-col space-y-2 p-4">
				<div className="space-x-2">
					{post.categories.map((category) => (
						<Link
							key={category.id}
							href={`/categories/${category.slug}`}
							className="inline-block text-xs font-medium text-primary hover:underline"
						>
							{category.name}
						</Link>
					))}
				</div>
				<h2 className="line-clamp-2 text-xl font-semibold leading-tight hover:text-primary">
					<Link href={`/blog/${post.slug}`}>
						{post.title}
					</Link>
				</h2>
				<p className="line-clamp-3 text-sm text-muted-foreground">
					{post.excerpt}
				</p>
				<div className="flex items-center gap-2 pt-2">
					<div className="relative h-8 w-8 rounded-full overflow-hidden">
						<Image
							src={getAvatarUrl(post.author.avatarSeed)}
							alt={post.author.name}
							fill
							sizes="32px"
							className="object-cover"
						/>
					</div>
					<div className="flex flex-col">
						<span className="text-xs font-medium">{post.author.name}</span>
						<span className="text-xs text-muted-foreground">
							{formatDate(post.publishedDate)}
						</span>
					</div>
				</div>
			</div>
		</article>
	);
}