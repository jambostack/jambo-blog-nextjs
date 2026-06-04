/**
 * JamboApi configuration
 *
 * All sensitive values are pulled from environment variables loaded at build time.
 * Make sure to copy `env.local.example` → `.env.local` (or appropriate env file) and fill in your real credentials.
 */
export const cmsConfig = {
	/** Unique project identifier in JamboApi */
	projectId: process.env.JAMBOAPI_PROJECT_ID as string | undefined,

	/** API key for fetching published content */
	apiKey: process.env.JAMBOAPI_API_KEY as string | undefined,

	/** API URL for JamboApi REST API */
	apiUrl: process.env.JAMBOAPI_API_URL ?? "https://jambostack.site/api",

	/** Key with create permissions (optional, used for mutations) */
	createKey: process.env.JAMBOAPI_CREATE_KEY as string | undefined,

} as const;

export type CmsConfig = typeof cmsConfig;

/**
 * Simple runtime assertion to ensure that required values are present.
 * Call this early in your app (e.g., in `app/layout.tsx`) to fail fast if misconfigured.
 */
export function assertCmsConfig(cfg: CmsConfig = cmsConfig) {
	if (!cfg.projectId) throw new Error("Missing JAMBOAPI_PROJECT_ID env variable");
	if (!cfg.apiKey) throw new Error("Missing JAMBOAPI_API_KEY env variable");
} 