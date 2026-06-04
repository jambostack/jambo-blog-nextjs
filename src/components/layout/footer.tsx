"use client";

import Link from "next/link";
import SocialLinks from "../ui/social-links";
import { siteConfig } from "@/config/site";
import { useSiteSettings } from "@/context/site-settings";

type LegalPage = {
	title: string;
	slug: string;
};

interface FooterProps {
	legalPages: LegalPage[];
}

export default function Footer({ legalPages = [] }: FooterProps) {
	const settings = useSiteSettings();
	const siteTitle =
		(settings as any).fields?.["title"] ??
		siteConfig.title;
	const siteDescription =
		(settings as any).fields?.["description"] ??
		siteConfig.description;
	const siteName = siteTitle.split('|')[0].trim();

	const xLink = (settings as any).fields?.["x"] ?? "";
	const facebookLink = (settings as any).fields?.["facebook"] ?? "";
	const githubLink = (settings as any).fields?.["github"] ?? "";
	const linkedinLink = (settings as any).fields?.["linkedin"] ?? "";

	return (
		<footer className="border-t bg-background">
			<div className="container max-w-5xl mx-auto py-8 px-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div>
						<h3 className="text-lg font-semibold mb-2">{siteName}</h3>
						<p className="text-sm text-muted-foreground">
							{siteDescription}
						</p>
					</div>
					<div>
						<h3 className="text-lg font-semibold mb-2">Links</h3>
						<ul className="space-y-2">
							<li>
								<Link
									href="/"
									className="text-sm text-muted-foreground hover:text-primary"
								>
									Home
								</Link>
							</li>
							<li>
								<Link
									href="/blog"
									className="text-sm text-muted-foreground hover:text-primary"
								>
									Blog
								</Link>
							</li>
							<li>
								<Link
									href="/categories"
									className="text-sm text-muted-foreground hover:text-primary"
								>
									Categories
								</Link>
							</li>
							<li>
								<Link
									href="/tags"
									className="text-sm text-muted-foreground hover:text-primary"
								>
									Tags
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h3 className="text-lg font-semibold mb-2">Follow</h3>
						{ /* 'twitter', 'facebook', 'github', 'linkedin', 'instagram', 'youtube', 'dribbble', 'pinterest', 'telegram', 'discord' */}
						<SocialLinks
							links={[
								{ platform: 'twitter', url: xLink },
								{ platform: 'facebook', url: facebookLink },
								{ platform: 'github', url: githubLink },
								{ platform: 'linkedin', url: linkedinLink }
							]}
						/>
					</div>
				</div>
				<div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
					<p className="text-sm text-muted-foreground">
						© {new Date().getFullYear()} {siteName}. All rights reserved.
					</p>
					<div className="flex space-x-6 mt-4 md:mt-0">
						{legalPages.map((p) => (
							<Link
								key={p.slug}
								href={`/${p.slug}`}
								className="text-xs text-muted-foreground hover:text-primary"
							>
								{p.title}
							</Link>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
}