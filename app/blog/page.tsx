import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import PostCard from "@/components/PostCard";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Analysis of high-yield savings rates: how banks set them, quietly lower them, and which accounts actually hold up over time.",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          The APY Archives Blog
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
          How savings rates really behave — and how to make them work for you.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No posts yet. Check back soon.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
