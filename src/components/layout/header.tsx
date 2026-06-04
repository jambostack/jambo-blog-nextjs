"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { useSiteSettings } from "@/context/site-settings";

export interface NavItem {
	name: string;
	href: string;
}

export const navItems: NavItem[] = [
	{ name: "Home", href: "/" },
	{ name: "Blog", href: "/blog" },
	{ name: "Categories", href: "/categories" },
	{ name: "Tags", href: "/tags" },
	{ name: "About", href: "/about" },
];

export default function Header() {
	const pathname = usePathname();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const settings = useSiteSettings();
	const siteTitle =
		(settings as any).fields?.["title"] ??
		siteConfig.title;
	// Extract just the name part from the title (removing any tagline after |)
	const siteName = siteTitle.split('|')[0].trim();

	return (
		<header className="sticky top-0 z-50 w-full">
			{/* Top colorful bar */}
			<div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-primary to-purple-500"></div>

			<div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
				<div className="container max-w-5xl mx-auto h-20 flex items-center justify-between px-4">
					<div className="flex items-center gap-2">
						<Link
							href="/"
							className="flex items-center gap-2 group"
						>
							<div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xl">
								{siteName.charAt(0)}
							</div>
							<span className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">{siteName}</span>
						</Link>
					</div>

					{/* Desktop navigation */}
					<nav className="hidden md:flex items-center gap-7">
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									"text-sm font-medium transition-colors hover:text-primary relative group",
									pathname === item.href
										? "text-foreground"
										: "text-muted-foreground"
								)}
							>
								{item.name}
								<span className={cn(
									"absolute left-0 right-0 bottom-0 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200",
									pathname === item.href && "scale-x-100"
								)}></span>
							</Link>
						))}

						<div className="flex items-center pl-1">
							<ThemeToggle />
						</div>
					</nav>

					{/* Mobile menu button */}
					<div className="flex items-center gap-2 md:hidden">
						<ThemeToggle />
						<Button
							variant="ghost"
							size="sm"
							className="rounded-full md:hidden"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							aria-label="Toggle menu"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className={cn(isMenuOpen && "hidden")}
							>
								<line x1="3" y1="12" x2="21" y2="12"></line>
								<line x1="3" y1="6" x2="21" y2="6"></line>
								<line x1="3" y1="18" x2="21" y2="18"></line>
							</svg>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className={cn(!isMenuOpen && "hidden")}
							>
								<line x1="18" y1="6" x2="6" y2="18"></line>
								<line x1="6" y1="6" x2="18" y2="18"></line>
							</svg>
						</Button>
					</div>
				</div>
			</div>

			{/* Mobile navigation */}
			{isMenuOpen && (
				<div className="md:hidden border-t bg-background">
					<div className="container max-w-5xl mx-auto py-4 px-4">
						<nav className="flex flex-col space-y-4">
							{navItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className={cn(
										"text-sm font-medium transition-colors hover:text-primary",
										pathname === item.href
											? "text-foreground"
											: "text-muted-foreground"
									)}
									onClick={() => setIsMenuOpen(false)}
								>
									{item.name}
								</Link>
							))}
						</nav>
					</div>
				</div>
			)}
		</header>
	);
}