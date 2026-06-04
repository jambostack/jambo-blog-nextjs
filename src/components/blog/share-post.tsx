"use client";

import { Share, Link as LinkIcon, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, copyToClipboard } from "@/lib/utils";
import { useState, useEffect } from "react";

interface SharePostProps {
	title: string;
	slug: string;
	className?: string;
}

export default function SharePost({ title, slug, className }: SharePostProps) {
	const [copied, setCopied] = useState(false);
	const [pageUrl, setPageUrl] = useState('');

	useEffect(() => {
		// Only run on the client
		setPageUrl(`${window.location.origin}/blog/${slug}`);
	}, [slug]);

	const handleCopyLink = async () => {
		if (!pageUrl) return;

		const success = await copyToClipboard(pageUrl);

		if (success) {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const getShareUrl = (platform: 'x' | 'facebook' | 'linkedin') => {
		if (!pageUrl) return '#';

		const url = encodeURIComponent(pageUrl);
		const encodedTitle = encodeURIComponent(title);

		switch (platform) {
			case 'x':
				return `https://x.com/intent/tweet?url=${url}&text=${encodedTitle}`;
			case 'facebook':
				return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
			case 'linkedin':
				return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
		}
	};

	return (
		<div className={cn("flex flex-col space-y-3", className)}>
			<div className="flex items-center space-x-2">
				<Share className="h-4 w-4" />
				<span className="font-medium">Share this post</span>
			</div>
			<div className="flex flex-wrap gap-2">
				<Button
					variant="outline"
					size="sm"
					className="flex items-center gap-2"
					onClick={handleCopyLink}
				>
					{copied ? (
						<>
							<CheckCheck className="h-4 w-4" />
							Copied!
						</>
					) : (
						<>
							<LinkIcon className="h-4 w-4" />
							Copy Link
						</>
					)}
				</Button>
				<a
					href={getShareUrl('x')}
					target="_blank"
					rel="noopener noreferrer"
				>
					<Button variant="outline" size="sm" className="flex items-center gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="currentColor"
							stroke="none"
							className="h-4 w-4"
						>
							<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
						</svg>
					</Button>
				</a>
				<a
					href={getShareUrl('facebook')}
					target="_blank"
					rel="noopener noreferrer"
				>
					<Button variant="outline" size="sm" className="flex items-center gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 512 512"
							className="h-4 w-4"
							fill="currentColor"
						>
							<path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16 0 44.2 3.2 55.7 6.4v69.3c-6.1-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287v170.3C399.3 476.8 512 376 512 256z" />
						</svg>
					</Button>
				</a>
				<a
					href={getShareUrl('linkedin')}
					target="_blank"
					rel="noopener noreferrer"
				>
					<Button variant="outline" size="sm" className="flex items-center gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 448 512"
							className="h-4 w-4"
							fill="currentColor"
						>
							<path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
						</svg>
					</Button>
				</a>
			</div>
		</div>
	);
}