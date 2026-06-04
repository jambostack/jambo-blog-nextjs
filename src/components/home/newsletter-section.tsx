"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import axios from "axios";

export default function NewsletterSection() {
	const [email, setEmail] = useState("");
	const [submitted, setSubmitted] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Basic validation
		if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
			setError("Please enter a valid email address");
			return;
		}

		setLoading(true);
		setError("");

		try {
			await axios.post("/api/newsletter", { email });
			setSubmitted(true);
		} catch (err: any) {
			const message = err.response?.data?.message ?? err.message ?? "Failed to subscribe";
			setError(message);
			console.error("Newsletter subscribe error", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className="py-12 md:py-20 bg-muted/50">
			<div className="container max-w-5xl mx-auto px-4">
				<div className="bg-card rounded-xl overflow-hidden shadow-md border">
					<div className="p-6 md:p-10">
						<div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
							<div className="md:w-2/3">
								<div className="bg-primary/10 h-10 w-10 flex items-center justify-center rounded-full mb-4">
									<Mail className="h-5 w-5 text-primary" />
								</div>

								<h2 className="text-2xl md:text-3xl font-bold mb-3">
									Subscribe to our newsletter
								</h2>

								<p className="text-muted-foreground mb-6 md:pr-8">
									Get the latest articles, tutorials, and updates delivered straight to your inbox.
									We send out a newsletter once a week with valuable insights on web development.
								</p>

								{submitted ? (
									<div className="flex items-center gap-2 text-green-600 dark:text-green-500">
										<CheckCircle className="h-5 w-5" />
										<span className="font-medium">Thanks for subscribing!</span>
									</div>
								) : (
									<form onSubmit={handleSubmit} className="space-y-4">
										<div className="flex flex-col sm:flex-row gap-3">
											<div className="flex-1">
												<Input
													type="email"
													placeholder="Enter your email"
													value={email}
													onChange={(e) => setEmail(e.target.value)}
													className={`h-11 ${error ? 'border-red-500' : ''}`}
													disabled={loading}
												/>
												{error && <p className="text-red-500 text-sm mt-1">{error}</p>}
											</div>
											<Button
												type="submit"
												className="h-11 gap-1.5"
												disabled={loading}
											>
												Subscribe
												<ArrowRight className="h-4 w-4" />
											</Button>
										</div>
										<p className="text-xs text-muted-foreground">
											We respect your privacy. Unsubscribe at any time.
										</p>
									</form>
								)}
							</div>

							<div className="hidden md:block md:w-1/3 relative">
								<div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-primary/10 to-transparent rounded-lg"></div>
								<div className="absolute -top-3 -right-3">
									<svg width="104" height="104" viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M2 2L20.5 12.5M20.5 12.5L39 2M20.5 12.5V36.5M39 23L57.5 12.5M57.5 12.5L76 23M57.5 12.5V36.5M76 2L94.5 12.5M94.5 12.5L113 2M94.5 12.5V36.5M2 44L20.5 54.5M20.5 54.5L39 44M20.5 54.5V78.5M39 65L57.5 54.5M57.5 54.5L76 65M57.5 54.5V78.5M76 44L94.5 54.5M94.5 54.5L113 44M94.5 54.5V78.5M2 86L20.5 96.5M20.5 96.5L39 86M20.5 96.5V120.5M39 107L57.5 96.5M57.5 96.5L76 107M57.5 96.5V120.5M76 86L94.5 96.5M94.5 96.5L113 86M94.5 96.5V120.5" stroke="currentColor" strokeOpacity="0.1" strokeWidth="2.5" />
									</svg>
								</div>
								<div className="w-full h-full py-8 px-10 flex items-center justify-center">
									<div className="flex flex-col gap-2 text-center">
										<span className="font-bold text-lg">Join our subscribers</span>
										<span className="text-muted-foreground text-sm">Developers & designers</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
} 