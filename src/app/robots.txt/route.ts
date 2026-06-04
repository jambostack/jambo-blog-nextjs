import { NextResponse } from 'next/server';

export async function GET() {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

	// Create robots.txt content
	const robotsTxt = `# Robots.txt file for ${baseUrl}
User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml
`;

	// Return the text content with proper content-type
	return new NextResponse(robotsTxt, {
		headers: {
			'Content-Type': 'text/plain',
		},
	});
} 