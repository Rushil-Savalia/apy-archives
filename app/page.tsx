import { loadAccounts } from "@/lib/apyData";
import Dashboard from "@/components/Dashboard";

// Banks to pre-select on load (the "top 3").
const DEFAULT_SELECTED = ["SoFi", "Marcus by Goldman Sachs", "Capital One 360"];

export default function Home() {
  const accounts = loadAccounts();

  const defaultSelectedIds = accounts
    .filter((a) => DEFAULT_SELECTED.includes(a.name))
    .map((a) => a.id);

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">APY Archives</h1>
          <p className="text-lg text-blue-100">
            Track and compare high-yield savings account rates over time
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Dashboard accounts={accounts} defaultSelectedIds={defaultSelectedIds} />

        {/* Footer Info */}
        <footer className="text-center py-8 text-gray-600">
          <p className="text-sm">
            APYarchives.com • Historical APY data for high-yield savings accounts
          </p>
          <p className="text-xs mt-2 text-gray-500">
            Data sourced from DepositAccounts.com rate history. Actual rates may
            vary — check official bank websites for current rates.
          </p>
        </footer>
      </div>
    </main>
  );
}
