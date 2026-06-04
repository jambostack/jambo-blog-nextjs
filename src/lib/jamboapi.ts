import { cmsConfig, assertCmsConfig } from "@/config/cms";
import type { Category, Tag, Author, Post } from "@/types/blog";

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------

/**
 * Shape of the settings document returned by JamboApi.
 * These keys should mirror what you configure on the CMS side.
 * Extend as necessary when your remote schema evolves.
 */
export interface JamboapiSettings {
	"title": string;
	"description": string;
	"fav-icon": string;
	"x": string;
	"facebook": string;
	"github": string;
	"linkedin": string;
	"instagram": string;
}

// ------------------------------------------------------------
// Low-level fetch helper
// ------------------------------------------------------------

/**
 * Executes a GET request against JamboApi REST API.
 * Handles Authorization header & basic error handling.
 */
async function cmsFetch<T>(endpoint: string, init: RequestInit = {}): Promise<T> {
	assertCmsConfig();
	const { apiUrl, projectId, apiKey } = cmsConfig;

	// Build full URL (avoid duplicate slashes)
	const cleanedBase = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
	const cleanedPath = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
	const url = `${cleanedBase}${cleanedPath}`;

	const res = await fetch(url, {
		...init,
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${apiKey}`,
			"project-id": projectId as string,
			...(init.headers || {}),
		},
		next: { revalidate: 0 },
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`JamboApi request failed (${res.status} ${res.statusText}) on ${url}: ${text}`);
	}

	return res.json() as Promise<T>;
}

// ------------------------------------------------------------
// Public API
// ------------------------------------------------------------

/**
 * Fetches global site settings from the CMS.
 *
 * These settings can be consumed inside server components (e.g., app/layout.tsx) to drive
 * page metadata, theme selection, etc.
 */
export async function getSettings(): Promise<JamboapiSettings> {
	const raw = await cmsFetch<any>("/settings");

	// API returns { data: [ entry ], meta: {...} } for collections
	let entry: any = null;
	if (raw && typeof raw === "object" && Array.isArray(raw.data)) {
		entry = raw.data[0] ?? null;
	} else if (raw && typeof raw === "object" && !Array.isArray(raw)) {
		entry = raw;
	}

	// Fields are at the top level of the entry — return them directly
	return (entry ?? {}) as JamboapiSettings;
}


// Jambo API returns field values at the top level of each entry.
// This helper wraps non-system keys under a `fields` property so existing
// code using `item.fields.xxx` continues to work.
const SYSTEM_KEYS = new Set([
	'id','uuid','locale','status','collection','created_at','updated_at',
	'deleted_at','published_at','creator','updater',
]);

function wrapFields(entry: any): any {
	if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return entry;
	if ('fields' in entry) return entry; // already wrapped
	const fields: Record<string, any> = {};
	const result: Record<string, any> = {};
	for (const [key, value] of Object.entries(entry)) {
		if (SYSTEM_KEYS.has(key)) {
			result[key] = value;
		} else {
			fields[key] = value;
		}
	}
	result.fields = fields;
	return result;
}

/** Fetches a collection of documents (array) by name. */
export async function getCollection<T = any>(name: string): Promise<T[]> {
	try {
		const raw = await cmsFetch<any>(`/${name}`);

		let col: any[] = [];
		if (Array.isArray(raw)) {
			col = raw;
		} else if (raw && typeof raw === "object") {
			if (Array.isArray(raw.data)) col = raw.data;
			else col = [raw]; // single-type collection returns object
		}
		return col.map(wrapFields) as T[];
	} catch (err) {
		console.error(`Failed to fetch collection '${name}' from JamboApi`, err);
		return [];
	}
}

// ------------------------------------------------------------
// Blog taxonomy helpers
// ------------------------------------------------------------

export async function getCategories(): Promise<Category[]> {
	const raw = await getCollection<{ uuid: string; fields: { title: string; slug: string } }>("categories?sort=title,ASC");
	return raw.map((item) => ({ id: item.uuid, name: item.fields.title, slug: item.fields.slug }));
}

export async function getTags(): Promise<Tag[]> {
	const raw = await getCollection<{ uuid: string; fields: { title: string; slug: string } }>("tags?sort=title,ASC");
	return raw.map((item) => ({ id: item.uuid, name: item.fields.title, slug: item.fields.slug }));
}

// ------------------------------------------------------------
// Posts helpers
// ------------------------------------------------------------

function mapAuthor(raw: any): Author {
	if (!raw) {
		return { id: "", name: "Anonymous", bio: "", avatarSeed: "anon" };
	}
	// API retourne un array d'UUIDs pour les relations (pas d'objets résolus)
	if (Array.isArray(raw)) {
		return { id: raw[0] ?? "", name: "Anonymous", bio: "", avatarSeed: "anon" };
	}
	// Objet résolu (usage futur si l'API supporte populate)
	if (raw.fields) {
		return {
			id: raw.uuid,
			name: raw.fields.name,
			bio: raw.fields.about ?? "",
			avatarSeed: raw.fields["avatar-seed"] ?? raw.fields.name,
		};
	}
	return { id: raw.uuid ?? raw, name: "Anonymous", bio: "", avatarSeed: "anon" };
}

function mapTaxonomy(rawArr: any[] | null | undefined): Category[] | Tag[] {
	if (!rawArr) return [];
	return rawArr
		.filter((it) => it != null)
		.map((it: any) => {
			// API retourne des UUIDs (strings) au lieu d'objets résolus
			if (typeof it === "string") {
				return { id: it, name: "", slug: "" };
			}
			if (it.fields) {
				return { id: it.uuid, name: it.fields.title, slug: it.fields.slug };
			}
			return { id: it.uuid ?? it, name: "", slug: "" };
		});
}

export async function getPosts(): Promise<Post[]> {
	const raw = await getCollection<any>("posts?sort=published_at,DESC");
	return raw.map((item: any) => {
		const f = item.fields;
		return {
			id: item.uuid,
			title: f.title,
			slug: f.url,
			excerpt: f.excerpt ?? "",
			content: f.content ?? "",
			publishedDate: item.published_at,
			featured: f.featured ?? false,
			coverImage: f["cover-image"]?.[0]?.url ?? "",
			author: mapAuthor(f.author),
			categories: mapTaxonomy(f.categories) as Category[],
			tags: mapTaxonomy(f.tags) as Tag[],
			comments: [],
		} as Post;
	});
}

export interface PaginatedPosts {
	posts: Post[];
	meta: any;
}

export async function getPostsPage(page: number = 1, perPage: number = 9): Promise<PaginatedPosts> {
	const res = await cmsFetch<any>(`/posts?sort=published_at,DESC&paginate=${perPage}&page=${page}`);
	const posts = mapPosts((res.data ?? []).map(wrapFields));
	return { posts, meta: res.meta };
}

function mapPosts(arr: any[]): Post[] {
	return arr.map((item: any) => {
		const f = item.fields;
		return {
			id: item.uuid,
			title: f.title,
			slug: f.url,
			excerpt: f.excerpt ?? "",
			content: f.content ?? "",
			publishedDate: item.published_at,
			featured: f.featured ?? false,
			coverImage: f["cover-image"]?.[0]?.url ?? "",
			author: mapAuthor(f.author),
			categories: mapTaxonomy(f.categories) as Category[],
			tags: mapTaxonomy(f.tags) as Tag[],
			comments: [],
		} as Post;
	});
}

export async function getFeaturedPosts(): Promise<Post[]> {
	const raw = await getCollection<any>("posts?limit=4&where[featured]=1&sort=published_at,DESC");
	return mapPosts(raw);
}

export async function getPostBySlug(slug: string) {
	const raw = await cmsFetch<any>(`/posts?where[url]=${encodeURIComponent(slug)}&first`);
	if (!raw) return null;
	const entries = Array.isArray(raw) ? raw : (raw.data ? raw.data : [raw]);
	return mapPosts(entries.map(wrapFields))[0] ?? null;
}

export async function getPostsByCategorySlugPage(slug: string, page: number = 1, perPage: number = 9): Promise<PaginatedPosts> {
	const res = await cmsFetch<any>(`/posts?where[categories][slug]=${encodeURIComponent(slug)}&sort=published_at,DESC&paginate=${perPage}&page=${page}`);
	return { posts: mapPosts((res.data ?? []).map(wrapFields)), meta: res.meta };
}

export async function getPostsByCategorySlug(slug: string): Promise<Post[]> {
	const { posts } = await getPostsByCategorySlugPage(slug, 1, 9999);
	return posts;
}

export async function getPostsByTagSlugPage(slug: string, page: number = 1, perPage: number = 9): Promise<PaginatedPosts> {
	const res = await cmsFetch<any>(`/posts?where[tags][slug]=${encodeURIComponent(slug)}&sort=published_at,DESC&paginate=${perPage}&page=${page}`);
	return { posts: mapPosts((res.data ?? []).map(wrapFields)), meta: res.meta };
}

export async function getPostsByTagSlug(slug: string): Promise<Post[]> {
	const { posts } = await getPostsByTagSlugPage(slug, 1, 9999);
	return posts;
}

// ------------------------------------------------------------
// About page
// ------------------------------------------------------------

export interface AboutData {
	name: string;
	shortBio: string;
	aboutHtml: string;
	imageUrl: string;
	socials: Record<string, string>;
	email?: string;
}

export async function getAbout(): Promise<AboutData | null> {
	const rawArr = await getCollection<any>('about?first');
	const raw = Array.isArray(rawArr) ? rawArr[0] : rawArr;
	if (!raw) return null;
	const f = raw.fields;
	return {
		name: f.name,
		shortBio: f['short-bio'] ?? '',
		aboutHtml: f['about-section'] ?? '',
		imageUrl: f.image?.[0]?.url ?? '',
		socials: {
			x: f.x,
			facebook: f.facebook,
			github: f.github,
			linkedin: f.linkedin,
		},
		email: f.email,
	};
}

// ------------------------------------------------------------
// Pages helpers
// ------------------------------------------------------------

export interface CmsPage {
	id: string;
	title: string;
	slug: string;
	content: string;
}

export async function getPages(): Promise<CmsPage[]> {
	const raw = await getCollection<any>("pages?sort=page-title,ASC");
	return raw.map((item: any) => {
		const f = item.fields;
		return {
			id: item.uuid,
			title: f["page-title"] ?? f.title ?? "Untitled",
			slug: f.url,
			content: f.content ?? "",
		} as CmsPage;
	});
}

export async function getPageBySlug(slug: string): Promise<CmsPage | null> {
	const raw = await cmsFetch<any>(`/pages?where[url]=${encodeURIComponent(slug)}&first`);
	if (!raw) return null;
	const entries = Array.isArray(raw) ? raw : (raw.data ? raw.data : [raw]);
	const item = wrapFields(entries[0]);
	if (!item) return null;
	const f = item.fields;
	if (!f) return null;
	return {
		id: item.uuid,
		title: f["page-title"] ?? f.title ?? "Untitled",
		slug: f.url,
		content: f.content ?? "",
	} as CmsPage;
}

// ------------------------------------------------------------
// Comments helpers
// ------------------------------------------------------------

export interface Comment {
	id: string;
	name: string;
	email: string;
	comment: string;
	postId: string;
	publishedAt: string;
}

export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
	const raw = await getCollection<any>(`comments?where[post][uuid]=${encodeURIComponent(postId)}&sort=published_at,DESC&exclude=post`);
	return raw.map((item: any) => {
		const f = item.fields;
		return {
			id: item.uuid,
			name: f.name,
			email: f.email,
			comment: f.comment,
			postId: f.post,
			publishedAt: item.published_at,
		} as Comment;
	});
}

export async function createComment(data: {
	name: string;
	email: string;
	comment: string;
	post: string;
}): Promise<Comment | null> {
	assertCmsConfig();
	const { apiUrl, projectId, createKey } = cmsConfig;

	const url = `${apiUrl}/comments`;

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${createKey}`,
				'project-id': projectId as string,
			},
			body: JSON.stringify({
				data: {
					name: data.name,
					email: data.email,
					comment: data.comment,
					post: data.post,
				}
			}),
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Failed to create comment: ${response.status} ${response.statusText} - ${errorText}`);
		}

		const result = await response.json();
		const item = result.data;

		return {
			id: item.uuid,
			name: item.fields.name,
			email: item.fields.email,
			comment: item.fields.comment,
			postId: item.fields.post,
			publishedAt: item.published_at,
		} as Comment;
	} catch (error) {
		console.error('Error creating comment:', error);
		throw error;
	}
} 