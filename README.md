# Jambo Blog — Next.js 15 Starter

A production-ready blog starter template built with **Next.js 15** (App Router) and **[Jambo CMS](https://jambostack.site)** as the headless backend.

## Features

- **Next.js 15** App Router + React Server Components
- **Tailwind CSS** with Syne / DM Sans / JetBrains Mono (Jambo brand typography)
- **Emerald color palette** — dark/light themes with `next-themes`
- **Blog** — paginated post list, individual post pages, richtext content
- **Categories & Tags** — filterable post archives
- **Comments** — reader comments per post
- **Newsletter** — email subscription form
- **About page** — author profile with social links
- **Static CMS pages** — legal, privacy, etc.

## Quick Start

### 1. Import the schema into Jambo

The fastest way to create all 11 collections is to import the provided schema file:

1. Log in to your Jambo admin panel
2. On the **Dashboard**, click the **Import** button (↑ icon)
3. Upload `data/jambo-blog-nextjs-schema.zip`
4. Choose **Create new project**, give it a name
5. Click **Import** — all 11 collections are created instantly

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```ini
JAMBOAPI_PROJECT_ID=your-project-uuid
JAMBOAPI_API_KEY=your-read-api-token
JAMBOAPI_CREATE_KEY=your-write-api-token
JAMBOAPI_API_URL=https://your-jambo-domain.com/api/your-project-uuid
JAMBOAPI_IMAGE_HOST=your-jambo-domain.com
NEXT_PUBLIC_SITE_URL=https://your-blog.com
```

Find your project UUID and API tokens in **Project Settings → API Access**.

### 3. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Start by adding content in the `settings` collection (site title), then `hero-section`, then your first `posts`.

### 4. Deploy

```bash
# Vercel (recommended)
vercel deploy

# Any Node.js host
npm run build && npm start
```

## Collections Schema

| Collection | Type | Key fields |
|------------|------|-----------|
| `settings` | singleton | title, description, social links |
| `hero-section` | singleton | title, sub-text, CTA buttons |
| `blog-features` | list | title, sub-text, icon-name, order |
| `authors` | list | name, about, avatar-seed |
| `categories` | list | title, slug |
| `tags` | list | title, slug |
| `posts` | list | title, url, excerpt, content, cover-image, author → categories[] → tags[] |
| `comments` | list | name, email, comment, post → |
| `about` | singleton | name, short-bio, about-section, image, social links |
| `pages` | list | page-title, url, content |
| `newsletter` | list | email |

Full schema reference: [docs.jambostack.site/templates/blog-nextjs](https://docs.jambostack.site/templates/blog-nextjs/)

## Revalidation Webhook

Set up a Jambo webhook to revalidate pages when content changes:

1. In **Project Settings → Webhooks**, add a webhook
2. URL: `https://your-blog.com/api/revalidate?secret=YOUR_SECRET`
3. Events: `entry.published`, `entry.updated`, `entry.deleted`

Add to `.env.local`:
```ini
REVALIDATE_SECRET=YOUR_SECRET
```

## License

MIT
