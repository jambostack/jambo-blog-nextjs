import { notFound } from "next/navigation";
import { getPageBySlug, getPages } from "@/lib/jamboapi";

// Define param type
interface PageParams {
    slug: string;
}

export async function generateStaticParams() {
    const pages = await getPages();
    return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<PageParams> }) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    const page = await getPageBySlug(slug);
    if (!page) return {};
    return {
        title: page.title,
        description: page.title,
    };
}

export default async function CmsPage({ params }: { params: Promise<PageParams> }) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    const page = await getPageBySlug(slug);

    if (!page) {
        notFound();
    }

    return (
        <div className="container max-w-5xl mx-auto px-4 py-8">
            <article className="prose dark:prose-invert max-w-none">
                <h1 className="text-3xl md:text-4xl font-bold mb-6">{page.title}</h1>
                <div dangerouslySetInnerHTML={{ __html: page.content }} />
            </article>
        </div>
    );
} 