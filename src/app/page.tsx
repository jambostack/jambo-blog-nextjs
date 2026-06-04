import { getFeaturedPosts } from "@/lib/jamboapi";
import Hero from "@/components/layout/hero";
import FeaturedPosts from "@/components/blog/featured-posts";
import NewsletterSection from "@/components/home/newsletter-section";
import DynamicIcon from "@/components/ui/dynamic-icon";
import { getCollection } from "@/lib/jamboapi";

export default async function Home() {
	const featuredPosts = await getFeaturedPosts();
	const features = await getCollection<{ fields: { "icon-name": string; title: string; "sub-text": string; order?: number } }>("blog-features?sort=order,ASC");

	function renderIcon(name: string) {
		return <DynamicIcon name={name} className="h-6 w-6 text-primary" />;
	}

	return (
		<div>
			{/* Container for the main content */}
			<div className="container max-w-5xl mx-auto px-4 py-8">
				{/* Hero Section */}
				<Hero />

				{/* Featured Posts Section */}
				<FeaturedPosts posts={featuredPosts} />

				{/* Blog Features Section */}
				<section className="py-12 md:py-16 border-t">
					<h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center mb-8">
						Blog Features
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{features.map((item) => {
							const f = item.fields;
							return (
								<div key={(item as any).uuid ?? f.title} className="flex flex-col items-center text-center p-4">
									<div className="bg-primary/10 p-3 rounded-full mb-4">
										{f["icon-name"] && 
											renderIcon(f["icon-name"])
										}
									</div>
									<h3 className="text-xl font-semibold mb-2">{f.title}</h3>
									<p className="text-muted-foreground">{f["sub-text"]}</p>
								</div>
							);
						})}
					</div>
				</section>
			</div>

			{/* Newsletter Section - Full width */}
			<NewsletterSection />

		</div>
	);
}
