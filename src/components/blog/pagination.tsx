import Link from "next/link";

interface PaginationProps {
	current: number;
	total: number;
	basePath?: string; // default '/blog'
}

export default function Pagination({ current, total, basePath = "/blog" }: PaginationProps) {
	if (total <= 1) return null;

	const prevPage = current > 1 ? current - 1 : null;
	const nextPage = current < total ? current + 1 : null;

	return (
		<nav className="flex justify-center gap-4 pt-8" aria-label="Pagination">
			{prevPage && (
				<Link
					href={`${basePath}?page=${prevPage}`}
					className="px-3 py-1.5 rounded border text-sm hover:bg-muted"
				>
					Previous
				</Link>
			)}
			<span className="px-3 py-1.5 text-sm text-muted-foreground">
				Page {current} of {total}
			</span>
			{nextPage && (
				<Link
					href={`${basePath}?page=${nextPage}`}
					className="px-3 py-1.5 rounded border text-sm hover:bg-muted"
				>
					Next
				</Link>
			)}
		</nav>
	);
} 