import Link from "next/link";

const CONTACT_EMAIL = "apyarchive@gmail.com";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-gray-200/70 dark:border-gray-800 mt-8">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 font-bold tracking-tight text-gray-900 dark:text-gray-100">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 6l-9.5 9.5-5-5L1 18" />
                  <path d="M17 6h6v6" />
                </svg>
              </span>
              <span>APY Archives</span>
            </div>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Historical APY data for high-yield savings accounts, so you can see
              how rates really behave over time.
            </p>
          </div>

          <nav className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-gray-900 dark:text-gray-100">Site</span>
            <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
            <Link href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Blog</Link>
            <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">About &amp; Privacy</Link>
            <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Contact</Link>
          </nav>
        </div>

        <div className="mt-8 border-t border-gray-100 dark:border-gray-800 pt-6 space-y-2 text-xs text-gray-500 dark:text-gray-500">
          <p>
            Data sourced from online sources. Actual rates may
            vary — check official bank websites for current rates. Informational
            only; not financial advice.
          </p>
          <p>
            © {year} APY Archives · Questions?{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2 hover:text-blue-600 dark:hover:text-blue-400">
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
