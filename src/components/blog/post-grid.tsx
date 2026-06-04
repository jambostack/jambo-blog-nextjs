import { Post } from "@/types/blog";
import PostCard from "./post-card";

interface PostGridProps {
	posts: Post[];
	className?: string;
}

export default function PostGrid({ posts, className }: PostGridProps) {
	return (
		<div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className || ""}`}>
			{posts.map((post, index) => (
				<PostCard key={post.id} post={post} isPriority={index === 0} />
			))}
		</div>
	);
}