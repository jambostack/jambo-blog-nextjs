import Link from "next/link";
import { getTags } from "@/lib/jamboapi";

export default async function TagsPage() {
	const tags = await getTags();

	return (
		<div className="container max-w-5xl mx-auto px-4 py-8">
			<div className="space-y-6">
				<div className="space-y-2">
					<h1 className="text-3xl md:text-4xl font-bold">Tags</h1>
					<p className="text-muted-foreground">
						Browse posts by tags to find specific topics that interest you.
					</p>
				</div>

				<div className="flex flex-wrap gap-3">
					{tags.map((tag) => (
						<Link
							key={tag.id}
							href={`/tags/${tag.slug}`}
							className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
						>
							{tag.name}
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}