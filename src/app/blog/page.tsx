import PostGrid from "@/components/blog/post-grid";
import { getPostsPage } from "@/lib/jamboapi";
import Pagination from "@/components/blog/pagination";

export default async function BlogPage(props: { searchParams?: Promise<{ page?: string }> }) {
	const searchParams = await props.searchParams;
	const pageNumber = Number(searchParams?.page ?? '1');
	const { posts, meta } = await getPostsPage(pageNumber);

	return (
		<div className="container max-w-5xl mx-auto px-4 py-8">
			<div className="space-y-6">
				<div className="space-y-2">
					<h1 className="text-3xl md:text-4xl font-bold">Blog</h1>
					<p className="text-muted-foreground">
						Discover the latest articles and tutorials on web development, UI/UX, and more.
					</p>
				</div>

				<PostGrid posts={posts} />
				<Pagination current={meta.page} total={meta.pages} />
			</div>
		</div>
	);
}