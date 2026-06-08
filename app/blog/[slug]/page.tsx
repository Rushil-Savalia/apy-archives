import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getPostSlugs, formatDate } from "@/lib/blog";
import MDXContent from "@/components/MDXContent";

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  try {
    const { meta } = getPostBySlug(params.slug);
    return { title: meta.title, description: meta.excerpt };
  } catch {
    return { title: "Post" };
  }
}

export default function PostPage({ params }: { params: { slug: string } }) {
  let post;
  try {
    post = getPostBySlug(params.slug);
  } catch {
    post = null;
  }
  if (!post) notFound();

  const { meta, content } = post;

  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M11 18l-6-6 6-6" />
        </svg>
        Back to blog
      </Link>

      <header className="mt-5 mb-8">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
          <time dateTime={meta.date}>{formatDate(meta.date)}</time>
          <span aria-hidden>·</span>
          <span>{meta.readingMinutes} min read</span>
          <span aria-hidden>·</span>
          <span>{meta.author}</span>
        </div>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {meta.title}
        </h1>
        {meta.excerpt && (
          <p className="mt-4 text-lg leading-7 text-gray-600 dark:text-gray-400">
            {meta.excerpt}
          </p>
        )}
      </header>

      <div className="border-t border-gray-200 dark:border-gray-800 pt-2">
        <MDXContent source={content} />
      </div>
    </article>
  );
}
