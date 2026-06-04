"use client";

import Link from "next/link";
import Image from "next/image";
import { Post } from "@/types/blog";
import PostCard from "./post-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { formatDate, getAvatarUrl, getCoverImageUrl } from "@/lib/utils";

export interface FeaturedPostsProps {
	posts: Post[];
}

export default function FeaturedPosts({ posts }: FeaturedPostsProps) {
	if (posts.length === 0) return null;

	const mainPost = posts[0];
	const secondaryPosts = posts.slice(1, 4);

	return (
		<section className="py-8 md:py-12">
			<h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8 text-center">
				Featured Content
			</h2>

			<div className="space-y-8">
				{/* Main featured post */}
				<article className="rounded-xl overflow-hidden border bg-card/50 shadow-sm">
					<div className="relative aspect-[21/9] w-full overflow-hidden">
						<Image
							src={getCoverImageUrl(mainPost.coverImage)}
							alt={mainPost.title}
							fill
							sizes="(max-width: 768px) 100vw, 1200px"
							className="object-cover"
							priority
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/0 flex items-end">
							<div className="p-6 md:p-8 w-full">
								<div className="flex space-x-2 mb-3">
									{mainPost.categories.map((category) => (
										<Link
											key={category.id}
											href={`/categories/${category.slug}`}
											className="text-xs font-medium px-2 py-1 bg-primary/20 text-primary rounded-md backdrop-blur-sm"
										>
											{category.name}
										</Link>
									))}
								</div>
								<h3 className="text-2xl md:text-3xl font-bold mb-2 text-white">
									<Link href={`/blog/${mainPost.slug}`} className="hover:underline decoration-primary underline-offset-4">
										{mainPost.title}
									</Link>
								</h3>
								<p className="text-white/80 line-clamp-2 md:w-2/3 mb-4">
									{mainPost.excerpt}
								</p>
								<div className="flex items-center gap-3">
									<div className="relative h-8 w-8 rounded-full overflow-hidden">
										<Image
											src={getAvatarUrl(mainPost.author.avatarSeed)}
											alt={mainPost.author.name}
											fill
											sizes="32px"
											className="object-cover"
										/>
									</div>
									<div className="text-white">
										<div className="text-sm font-medium">{mainPost.author.name}</div>
										<div className="text-xs opacity-80">{formatDate(mainPost.publishedDate)}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</article>

				{/* Secondary posts */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{secondaryPosts.map((post, index) => (
						<PostCard key={post.id} post={post} isPriority={index === 0} />
					))}
				</div>

				<div className="text-center">
					<Link href="/blog">
						<Button className="gap-2">
							Explore All Articles <ArrowRight className="h-4 w-4" />
						</Button>
					</Link>
				</div>
			</div>
		</section>
	);
}
