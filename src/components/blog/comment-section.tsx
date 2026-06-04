"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";
import type { Comment } from "@/lib/jamboapi";

interface CommentSectionProps {
	comments: Comment[];
	postId: string;
}

export default function CommentSection({ comments: initialComments, postId }: CommentSectionProps) {
	const [comments, setComments] = useState<Comment[]>(initialComments);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		comment: "",
	});
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError("");
		setSuccess("");

		try {
			const response = await fetch("/api/comments", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...formData,
					post: postId,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Failed to post comment");
			}

			// Add the new comment to the list (assuming data.data contains the comment)
			if (data.data) {
				const newComment: Comment = {
					id: data.data.uuid,
					name: data.data.fields.name,
					email: data.data.fields.email,
					comment: data.data.fields.comment,
					postId: data.data.fields.post,
					publishedAt: data.data.published_at,
				};
				setComments([newComment, ...comments]);
			}

			// Reset form
			setFormData({ name: "", email: "", comment: "" });
			setSuccess("Comment posted successfully!");

			// Clear success message after 3 seconds
			setTimeout(() => setSuccess(""), 3000);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to post comment");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	return (
		<div className="space-y-8">
			<div>
				<h2 className="text-2xl font-semibold mb-4">
					Comments ({comments.length})
				</h2>

				{/* Comment Form */}
				<div className="bg-muted/50 rounded-lg p-6 mb-8">
					<h3 className="text-lg font-medium mb-4">Leave a Comment</h3>

					{error && (
						<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
							{error}
						</div>
					)}

					{success && (
						<div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700">
							{success}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label htmlFor="name" className="block text-sm font-medium mb-1">
									Name *
								</label>
								<Input
									id="name"
									name="name"
									type="text"
									required
									value={formData.name}
									onChange={handleInputChange}
									placeholder="Your name"
								/>
							</div>
							<div>
								<label htmlFor="email" className="block text-sm font-medium mb-1">
									Email *
								</label>
								<Input
									id="email"
									name="email"
									type="email"
									required
									value={formData.email}
									onChange={handleInputChange}
									placeholder="your@email.com"
								/>
							</div>
						</div>
						<div>
							<label htmlFor="comment" className="block text-sm font-medium mb-1">
								Comment *
							</label>
							<Textarea
								id="comment"
								name="comment"
								required
								rows={4}
								value={formData.comment}
								onChange={handleInputChange}
								placeholder="Share your thoughts..."
							/>
						</div>
						<Button
							type="submit"
							disabled={isSubmitting}
							className="w-full md:w-auto"
						>
							{isSubmitting ? "Posting..." : "Post Comment"}
						</Button>
					</form>
				</div>

				{/* Comments List */}
				<div className="space-y-6">
					{comments.length === 0 ? (
						<p className="text-muted-foreground text-center py-8">
							No comments yet. Be the first to share your thoughts!
						</p>
					) : (
						comments.map((comment) => (
							<div key={comment.id} className="border-b border-border pb-6 last:border-b-0">
								<div className="flex items-start gap-3">
									<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
										{comment.name.charAt(0).toUpperCase()}
									</div>
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-2">
											<span className="font-medium">{comment.name}</span>
											<span className="text-sm text-muted-foreground">
												{formatDate(comment.publishedAt)}
											</span>
										</div>
										<p className="text-foreground whitespace-pre-wrap">{comment.comment}</p>
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}