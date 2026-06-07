"use client";

import { useMemo, useState } from "react";
import { Account } from "@/lib/apyData";
import APYChart from "@/components/APYChart";
import AccountList from "@/components/AccountList";

interface DashboardProps {
  accounts: Account[];
  defaultSelectedIds: string[];
}

export default function Dashboard({
  accounts,
  defaultSelectedIds,
}: DashboardProps) {
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(
    new Set(defaultSelectedIds)
  );

  const filteredAccounts = useMemo(
    () => accounts.filter((account) => selectedAccounts.has(account.id)),
    [accounts, selectedAccounts]
  );

  // Featured banks lead the selection grid (first row); the rest follow in
  // their existing (APY-sorted) order.
  const selectionOrder = useMemo(() => {
    const featured = ["SoFi", "Marcus by Goldman Sachs", "CIT Bank"];
    const rank = (a: Account) => {
      const i = featured.indexOf(a.name);
      return i === -1 ? featured.length : i;
    };
    return [...accounts].sort((a, b) => rank(a) - rank(b));
  }, [accounts]);

  const handleAccountToggle = (accountId: string) => {
    const next = new Set(selectedAccounts);
    if (next.has(accountId)) next.delete(accountId);
    else next.add(accountId);
    setSelectedAccounts(next);
  };

  const selectAll = () =>
    setSelectedAccounts(new Set(accounts.map((a) => a.id)));
  const removeAll = () => setSelectedAccounts(new Set());

  return (
    <>
      {/* Chart Section */}
      <section className="mb-12">
        <div className="rounded-2xl bg-white dark:bg-gray-800 ring-1 ring-gray-900/5 dark:ring-white/10 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 pt-5 flex items-baseline justify-between">
            <div className="flex items-center gap-2.5">
              <span className="h-5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                APY History
              </h2>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Last 5 years</span>
          </div>
          <div className="h-80 sm:h-96 md:h-[500px] lg:h-[600px] w-full p-4 sm:p-6">
            {filteredAccounts.length > 0 ? (
              <APYChart accounts={filteredAccounts} years={5} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Select at least one account below to see its APY history.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Account Selection Section */}
      <section className="mb-12 rounded-2xl bg-white dark:bg-gray-800 ring-1 ring-gray-900/5 dark:ring-white/10 shadow-sm p-6">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
          <div className="flex items-center gap-2.5">
            <span className="h-5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Select Accounts to Display
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
            >
              Select all
            </button>
            <button
              onClick={removeAll}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Remove all
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {selectionOrder.map((account) => {
            const selected = selectedAccounts.has(account.id);
            return (
              <label
                key={account.id}
                style={selected ? { borderColor: account.color } : undefined}
                className={`group flex items-center gap-3 cursor-pointer rounded-xl border p-3 transition-all ${
                  selected
                    ? "bg-gray-50 dark:bg-gray-700/40"
                    : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => handleAccountToggle(account.id)}
                  className="sr-only"
                />
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors"
                  style={{
                    borderColor: account.color,
                    backgroundColor: selected ? account.color : "transparent",
                  }}
                >
                  {selected && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </span>
                <span className="font-medium truncate text-gray-900 dark:text-gray-100">
                  {account.name}
                </span>
              </label>
            );
          })}
        </div>
      </section>

      {/* Account List Section */}
      <section className="mb-12">
        <AccountList accounts={accounts} />
      </section>
    </>
  );
}
