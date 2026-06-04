import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Syne } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { siteConfig } from "@/config/site";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { SiteSettingsProvider } from "@/context/site-settings";

const dmSans = DM_Sans({
	variable: "--font-sans",
	subsets: ["latin"],
	weight: ["400", "500", "700"],
	display: "swap",
});

const syne = Syne({
	variable: "--font-display",
	subsets: ["latin"],
	weight: ["600", "700", "800"],
	display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
	variable: "--font-mono",
	subsets: ["latin"],
	weight: ["400", "500", "600"],
	display: "swap",
});

// Dynamically compute page metadata from JamboApi at build/request time
export async function generateMetadata(): Promise<Metadata> {
	try {
		const { getSettings } = await import("@/lib/jamboapi");
		const settings = await getSettings();

		const dynamicTitle =
			(settings as any)["title"] ??
			siteConfig.title;

		// Favicon URL
		const favicon = (settings as any)["fav-icon"] as string | undefined;

		return {
			title: dynamicTitle,
			description: siteConfig.description,
			icons: favicon ? { icon: favicon } : undefined,
		} satisfies Metadata;
	} catch (err) {
		// If CMS fetch fails, fall back to the static siteConfig values
		console.error("Failed to load site settings from JamboApi", err);
		return {
			title: siteConfig.title,
			description: siteConfig.description,
		} satisfies Metadata;
	}
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { getSettings, getPages } = await import("@/lib/jamboapi");
	const settings = await getSettings();

	// Fetch all CMS pages to list in footer
	const legalPages = await getPages();

	// Extract Google Analytics ID from CMS (fallback to env var)
	const gaId =
		(settings as any)?.["google-analytics"] ??
		process.env.NEXT_PUBLIC_GA_ID ?? "";

	return (
		<html lang="en" suppressHydrationWarning>
			<body
				suppressHydrationWarning
				className={`${dmSans.variable} ${syne.variable} ${jetbrainsMono.variable} antialiased`}
			>
				<SiteSettingsProvider settings={settings}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<div className="flex min-h-screen flex-col">
							<Header />
							<main className="flex-1">
								{children}
							</main>
							<Footer legalPages={legalPages} />
						</div>
					</ThemeProvider>
				</SiteSettingsProvider>
				<GoogleAnalytics gaId={gaId} />
			</body>
		</html>
	);
}
