import { notFound } from "next/navigation";
import Link from "next/link";
import PostGrid from "@/components/blog/post-grid";
import Pagination from "@/components/blog/pagination";
import { getTags, getPostsByTagSlugPage } from "@/lib/jamboapi";

// Define params as a Promise
type PageParams = Promise<{ slug: string }>;

export default async function TagPage({ params, searchParams }: { params: PageParams; searchParams?: Promise<{ page?: string }> }) {
	const { slug } = await params;
	const searchParamsResolved = await searchParams;
	const pageNumber = Number(searchParamsResolved?.page ?? '1');

	const tags = await getTags();
	const tag = tags.find((t) => t.slug === slug);

	if (!tag) {
		notFound();
	}

	const { posts: tagPosts, meta } = await getPostsByTagSlugPage(slug, pageNumber);

	return (
		<div className="container max-w-5xl mx-auto px-4 py-8">
			<div className="space-y-6">
				<div className="space-y-2">
					<h1 className="text-3xl md:text-4xl font-bold">Tag: {tag.name}</h1>
					<p className="text-muted-foreground">
						Browse all posts tagged with {tag.name}.
					</p>
				</div>

				{tagPosts.length > 0 ? (
					<>
						<PostGrid posts={tagPosts} />
						<Pagination current={meta.page} total={meta.pages} basePath={`/tags/${slug}`} />
					</>
				) : (
					<div className="text-center py-10">
						<p className="text-muted-foreground">No posts found with this tag.</p>
						<Link href="/blog" className="text-primary hover:underline mt-4 inline-block">
							Back to all posts
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}