import Link from "next/link";
import { getCategories } from "@/lib/jamboapi";

export default async function CategoriesPage() {
	const categories = await getCategories();

	return (
		<div className="container max-w-5xl mx-auto px-4 py-8">
			<div className="space-y-6">
				<div className="space-y-2">
					<h1 className="text-3xl md:text-4xl font-bold">Categories</h1>
					<p className="text-muted-foreground">
						Browse posts by category to find content that interests you.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{categories.map((category) => (
						<Link
							key={category.id}
							href={`/categories/${category.slug}`}
							className="block p-6 rounded-lg border bg-card transition-colors hover:border-primary"
						>
							<h2 className="text-xl font-semibold">{category.name}</h2>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}