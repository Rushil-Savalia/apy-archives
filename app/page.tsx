import Link from "next/link";
import { loadAccounts } from "@/lib/apyData";
import Dashboard from "@/components/Dashboard";
import PostCard from "@/components/PostCard";
import { getAllPosts } from "@/lib/blog";

// Banks to pre-select on load (the "top 3").
const DEFAULT_SELECTED = ["SoFi", "Marcus by Goldman Sachs", "CIT Bank"];

const VALUE_PROPS = [
  {
    title: "Independent data",
    body: "Rates compiled from public rate history — not bank marketing.",
    icon: (
      <>
        <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
  {
    title: "Years of history",
    body: "See multi-year trends and rate changes, not just today's number.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  },
  {
    title: "No sign-up",
    body: "Free to use. No account, no email, and no tracking cookies.",
    icon: <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />,
  },
];

export default function Home() {
  const accounts = loadAccounts();

  const defaultSelectedIds = accounts
    .filter((a) => DEFAULT_SELECTED.includes(a.name))
    .map((a) => a.id);

  const latestPosts = getAllPosts().slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-gray-900 dark:via-blue-950 dark:to-gray-950 text-white">
        <div aria-hidden className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 py-16 sm:py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Track the real history of savings rates
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100/90">
            See how high-yield savings account APYs have moved over the years — so
            you can pick a bank by its track record, not just today&apos;s headline.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href="#rates"
              className="rounded-lg bg-white px-5 py-2.5 font-semibold text-blue-700 shadow-sm transition-colors hover:bg-blue-50"
            >
              View the rates
            </a>
            <Link
              href="/blog"
              className="rounded-lg bg-white/10 px-5 py-2.5 font-semibold text-white ring-1 ring-white/25 backdrop-blur transition-colors hover:bg-white/20"
            >
              Read the blog
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Rates / dashboard */}
        <section id="rates" className="scroll-mt-20">
          <Dashboard accounts={accounts} defaultSelectedIds={defaultSelectedIds} />
        </section>

        {/* Value props */}
        <section className="my-14 grid gap-4 sm:grid-cols-3">
          {VALUE_PROPS.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl bg-white dark:bg-gray-800 ring-1 ring-gray-900/5 dark:ring-white/10 shadow-sm p-5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {v.icon}
                </svg>
              </div>
              <h3 className="mt-3 font-semibold text-gray-900 dark:text-gray-100">{v.title}</h3>
              <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">{v.body}</p>
            </div>
          ))}
        </section>

        {/* Latest posts */}
        {latestPosts.length > 0 && (
          <section className="my-14">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="h-5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  From the blog
                </h2>
              </div>
              <Link href="/blog" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                All posts →
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              {latestPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
