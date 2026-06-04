export interface Author {
	id: string;
	name: string;
	bio: string;
	avatarSeed: string; // Used to generate consistent avatar images
}

export interface Comment {
	id: string;
	author: string;
	content: string;
	date: string;
	avatarSeed: string;
}

export interface Category {
	id: string;
	name: string;
	slug: string;
}

export interface Tag {
	id: string;
	name: string;
	slug: string;
}

export interface Post {
	id: string;
	title: string;
	slug: string;
	excerpt: string;
	content: string;
	publishedDate: string;
	author: Author;
	featured: boolean;
	coverImage: string;
	categories: Category[];
	tags: Tag[];
	comments: Comment[];
}