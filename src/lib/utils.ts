import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Format date to readable format
export function formatDate(date: string | Date): string {
	return new Date(date).toLocaleDateString("en-US", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

// Function to copy text to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch (err) {
		console.error("Failed to copy text: ", err);
		return false;
	}
}

/**
 * Returns a URL for an avatar image based on the provided seed.
 * Using CSS-only approach for avatars with initials.
 */
export function getAvatarUrl(seed: string): string {
	// Get first character as initial
	const initial = seed.charAt(0).toUpperCase();
	// Generate background color from seed
	const bgColor = stringToColor(seed);

	// Create SVG with proper encoding for special characters
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#${bgColor}"/><text x="50%" y="50%" dy=".1em" font-family="Arial, Helvetica, sans-serif" font-size="90" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${initial}</text></svg>`;

	// Encode the SVG for use in data URL
	const encodedSvg = svg
		.replace(/"/g, "'")
		.replace(/#/g, '%23')
		.replace(/</g, '%3C')
		.replace(/>/g, '%3E')
		.replace(/&/g, '%26')
		.replace(/\s+/g, ' ');

	return `data:image/svg+xml;charset=utf-8,${encodedSvg}`;
}

/**
 * Converts a string to a consistent hex color
 */
export function stringToColor(str: string): string {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	let color = '';
	for (let i = 0; i < 3; i++) {
		const value = (hash >> (i * 8)) & 0xff;
		color += ('00' + value.toString(16)).slice(-2);
	}
	return color;
}

/**
 * Gets the full URL for a post cover image
 */
export function getCoverImageUrl(imageFileName: string): string {
	// Absolute remote URL – leave untouched
	if (imageFileName.startsWith('http://') || imageFileName.startsWith('https://')) {
		return imageFileName;
	}

	// Internal static images already under /images
	if (imageFileName.startsWith('/images/')) {
		return imageFileName;
	}

	// Otherwise treat as local filename
	return `/images/${imageFileName}`;
}