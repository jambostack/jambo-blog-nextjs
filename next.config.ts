import type { NextConfig } from "next";

// Allow overriding the CMS host at build time
const CMS_IMAGE_HOST = process.env.JAMBOAPI_IMAGE_HOST || "jambostack.site";

const nextConfig: NextConfig = {
	/* config options here */
	experimental: {
		// Remove the custom turbo rules that were causing issues
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: CMS_IMAGE_HOST,
				pathname: '/**',
			},
		],
		dangerouslyAllowSVG: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
	// Add typescript configuration
	typescript: {
		// Don't ignore TypeScript errors during build
		ignoreBuildErrors: false
	},
	eslint: {
		// Don't ignore ESLint errors during build
		ignoreDuringBuilds: false
	},
	// Make sure canonical URLs are properly formed
	poweredByHeader: false,
};

export default nextConfig;
