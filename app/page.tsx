import { loadAccounts } from "@/lib/apyData";
import Dashboard from "@/components/Dashboard";
import ThemeToggle from "@/components/ThemeToggle";

// Banks to pre-select on load (the "top 3").
const DEFAULT_SELECTED = ["SoFi", "Marcus by Goldman Sachs", "CIT Bank"];

export default function Home() {
  const accounts = loadAccounts();

  const defaultSelectedIds = accounts
    .filter((a) => DEFAULT_SELECTED.includes(a.name))
    .map((a) => a.id);

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-gray-900 dark:via-blue-950 dark:to-gray-950 text-white shadow-lg">
        {/* subtle decorative glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-white/10 blur-3xl"
        />
        <div className="relative max-w-4xl mx-auto px-4 py-10 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* logomark */}
            <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 6l-9.5 9.5-5-5L1 18" />
                <path d="M17 6h6v6" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">APY Archives</h1>
              <p className="mt-1 text-base sm:text-lg text-blue-100/90">
                Track and compare high-yield savings account rates over time
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <Dashboard accounts={accounts} defaultSelectedIds={defaultSelectedIds} />

        {/* Footer Info */}
        <footer className="mt-4 border-t border-gray-200/70 dark:border-gray-800 pt-8 pb-10 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            APYarchives.com · Historical APY data for high-yield savings accounts
          </p>
          <p className="mx-auto mt-2 max-w-2xl text-xs text-gray-500 dark:text-gray-500">
            Actual rates may vary — check official bank websites for current rates.
          </p>
        </footer>
      </div>
    </main>
  );
}
