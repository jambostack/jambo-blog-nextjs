import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getCollection } from "@/lib/jamboapi";

interface HeroFields {
	title: string;
	"sub-text"?: string;
	"read-articles"?: boolean;
	"browse-button"?: boolean;
}

export default async function Hero() {
	const arr = await getCollection<{ fields: HeroFields }>("hero-section");
	const data = Array.isArray(arr) ? arr[0] : (arr as any);
	const fields: HeroFields = data?.fields ?? {} as HeroFields;

	const {
		title = "",
		"sub-text": subText = "",
		"read-articles": readArticles = true,
		"browse-button": browseButton = true,
	} = fields;

	return (
		<section className="py-12 md:py-16">
			<div className="text-center space-y-4">
				<h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tighter">
					{title}
				</h1>
				{subText && (
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						{subText}
					</p>
				)}
				<div className="flex justify-center gap-4 pt-4">
					{readArticles && (
						<Link href="/blog">
							<Button className="gap-2">
								Read Blog <ArrowRight className="h-4 w-4" />
							</Button>
						</Link>
					)}
					{browseButton && (
						<Link href="/categories">
							<Button variant="outline">Browse Categories</Button>
						</Link>
					)}
				</div>
			</div>
		</section>
	);
}