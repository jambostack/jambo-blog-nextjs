import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug, getPosts, getCommentsByPostId } from "@/lib/jamboapi";
import { formatDate, getAvatarUrl, getCoverImageUrl } from "@/lib/utils";
import SharePost from "@/components/blog/share-post";
import CommentSection from "@/components/blog/comment-section";

// Define params as a Promise
type PageParams = Promise<{ slug: string }>;

// Generate static paths for all blog posts
export async function generateStaticParams() {
	const posts = await getPosts();
	return posts.map((p) => ({ slug: p.slug }));
}

// Define generateMetadata with Promise params type
export async function generateMetadata({ params }: { params: PageParams }) {
	const { slug } = await params;
	const post = await getPostBySlug(slug);

	return {
		title: post?.title,
		description: post?.excerpt,
		openGraph: {
			title: post?.title,
			description: post?.excerpt,
			type: 'article',
		},
	};
}

// Use Promise params type for the page component
export default async function BlogPostPage({ params }: { params: PageParams }) {
	const { slug } = await params;
	const post = await getPostBySlug(slug);

	if (!post) {
		notFound();
	}

	// Fetch comments for this post
	const comments = await getCommentsByPostId(post.id);

	return (
		<div className="container max-w-5xl mx-auto px-4 py-8">
			<article className="space-y-8">
				{/* Post Header */}
				<header className="space-y-4">
					<div className="flex flex-wrap gap-2">
						{post.categories.map((category) => (
							<Link
								key={category.id}
								href={`/categories/${category.slug}`}
								className="inline-block text-sm font-medium text-primary hover:underline"
							>
								{category.name}
							</Link>
						))}
					</div>
					<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">{post.title}</h1>
					<p className="text-xl text-muted-foreground">{post.excerpt}</p>

					{/* Author and Date */}
					<div className="flex items-center gap-4 py-2">
						<div className="relative h-12 w-12 rounded-full overflow-hidden">
							<Image
								src={getAvatarUrl(post.author.avatarSeed)}
								alt={post.author.name}
								fill
								sizes="48px"
								className="object-cover"
							/>
						</div>
						<div>
							<div className="font-medium">{post.author.name}</div>
							<div className="text-sm text-muted-foreground">
								{formatDate(post.publishedDate)}
							</div>
						</div>
					</div>
				</header>

				{/* Post Cover Image */}
				{post.coverImage && (
					<div className="relative aspect-video w-full overflow-hidden rounded-lg">
						<Image
							src={getCoverImageUrl(post.coverImage)}
							alt={post.title}
							fill
							sizes="(max-width: 1536px) 100vw, 1536px"
							className="object-cover"
							priority
						/>
					</div>
				)}

				{/* Post Content */}
				<div
					className="blog-content prose dark:prose-invert mx-auto"
					dangerouslySetInnerHTML={{ __html: post.content }}
				/>

				{/* Tags */}
				<div className="flex flex-wrap gap-2">
					{post.tags.map((tag) => (
						<Link
							key={tag.id}
							href={`/tags/${tag.slug}`}
							className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-primary hover:text-primary-foreground"
						>
							{tag.name}
						</Link>
					))}
				</div>

				{/* Author Bio */}
				<div className="rounded-lg border bg-card p-6">
					<div className="flex items-start gap-4">
						<div className="relative h-16 w-16 flex-shrink-0 rounded-full overflow-hidden">
							<Image
								src={getAvatarUrl(post.author.avatarSeed)}
								alt={post.author.name}
								fill
								sizes="64px"
								className="object-cover"
							/>
						</div>
						<div className="space-y-1">
							<h3 className="font-semibold">About {post.author.name}</h3>
							<p className="text-sm text-muted-foreground">{post.author.bio}</p>
						</div>
					</div>
				</div>

				{/* Share Post */}
				<SharePost title={post.title} slug={post.slug} />

				{/* Comment Section */}
				<CommentSection comments={comments} postId={post.id} />
			</article>
		</div>
	);
}