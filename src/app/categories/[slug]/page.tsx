import { notFound } from "next/navigation";
import Link from "next/link";
import PostGrid from "@/components/blog/post-grid";
import { getCategories, getPostsByCategorySlugPage } from "@/lib/jamboapi";
import Pagination from "@/components/blog/pagination";

// Define params as a Promise
type PageParams = Promise<{ slug: string }>;

export default async function CategoryPage({ params, searchParams }: { params: PageParams; searchParams?: Promise<{ page?: string }> }) {
	const { slug } = await params;
	const searchParamsResolved = await searchParams;
	const pageNumber = Number(searchParamsResolved?.page ?? '1');

	const categories = await getCategories();
	const category = categories.find((cat) => cat.slug === slug);

	if (!category) {
		notFound();
	}

	const { posts: categoryPosts, meta } = await getPostsByCategorySlugPage(slug, pageNumber);

	return (
		<div className="container max-w-5xl mx-auto px-4 py-8">
			<div className="space-y-6">
				<div className="space-y-2">
					<h1 className="text-3xl md:text-4xl font-bold">Category: {category.name}</h1>
					<p className="text-muted-foreground">
						Browse all posts in the {category.name} category.
					</p>
				</div>

				{categoryPosts.length > 0 ? (
					<>
						<PostGrid posts={categoryPosts} />
						<Pagination current={meta.page} total={meta.pages} basePath={`/categories/${slug}`} />
					</>
				) : (
					<div className="text-center py-10">
						<p className="text-muted-foreground">No posts found in this category.</p>
						<Link href="/blog" className="text-primary hover:underline mt-4 inline-block">
							Back to all posts
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}