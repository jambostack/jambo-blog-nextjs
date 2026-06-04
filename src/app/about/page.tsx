import Image from "next/image";
import SocialLinks from "@/components/ui/social-links";
import { getAbout } from "@/lib/jamboapi";

export default async function AboutPage() {
	const about = await getAbout();
	if (!about) {
		return <div className="container px-4 py-12">About data not found.</div>;
	}

	return (
		<div className="container max-w-5xl mx-auto px-4 py-12">
			{/* Minimalist Header with Accent */}
			<div className="relative mb-16">
				<div className="absolute -top-6 left-0 w-24 h-2 bg-primary rounded-full"></div>
				<h1 className="text-5xl font-bold tracking-tight mb-3">{about.name}</h1>
				<p className="text-xl text-muted-foreground max-w-full">{about.shortBio}</p>
			</div>

			{/* Profile Section with Asymmetric Layout */}
			<section className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-16">
				<div className="md:col-span-2">
					<div className="sticky top-8">
						<div className="w-full max-w-[320px] mx-auto rounded-2xl overflow-hidden mb-6 flex items-center justify-center">
							<Image
								src={about.imageUrl}
								alt={about.name}
								width={320}
								height={320}
								priority
								className="object-cover"
							/>
						</div>
						<div className="flex justify-center space-x-4 mb-6">
							<SocialLinks
								links={Object.entries(about.socials)
									.filter(([, url]) => url)
									.map(([platform, url]) => {
										const p = platform === 'x' ? 'twitter' : (platform as any);
										return { platform: p, url } as any;
									})}
							/>
						</div>
						<div className="text-center">
							{about.email && (
								<a
									href={`mailto:${about.email}`}
									className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
								>
									<svg className="mr-2 -ml-1" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
										<rect width="20" height="16" x="2" y="4" rx="2" />
										<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
									</svg>
									Contact Me
								</a>
							)}
						</div>
					</div>
				</div>

				{/* About Me Section */}
				<div className="md:col-span-3 space-y-10">
					<div>
						<div dangerouslySetInnerHTML={{ __html: about.aboutHtml }} className="prose dark:prose-invert" />
					</div>
				</div>
			</section>
		</div>
	);
}