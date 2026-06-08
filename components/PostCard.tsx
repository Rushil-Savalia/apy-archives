import Link from "next/link";
import { PostMeta, formatDate } from "@/lib/blog";

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl bg-white dark:bg-gray-800 ring-1 ring-gray-900/5 dark:ring-white/10 shadow-sm p-5 transition-all hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden>·</span>
        <span>{post.readingMinutes} min read</span>
      </div>
      <h3 className="mt-2 text-lg font-semibold leading-snug text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
        {post.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-gray-600 dark:text-gray-400 line-clamp-3">
        {post.excerpt}
      </p>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400">
        Read more
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}
