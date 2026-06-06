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
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-4 sm:px-6 pt-4 flex items-baseline justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              APY History
            </h2>
            <span className="text-sm text-gray-500">Last 5 years</span>
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

      {/* Account List Section */}
      <section className="mb-12">
        <AccountList accounts={accounts} />
      </section>

      {/* Account Selection Section */}
      <section className="mb-12 bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Select Accounts to Display
          </h2>
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
            >
              Select all
            </button>
            <button
              onClick={removeAll}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Remove all
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <label
              key={account.id}
              className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedAccounts.has(account.id)}
                onChange={() => handleAccountToggle(account.id)}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: account.color }}
                ></div>
                <span className="font-medium text-gray-900">{account.name}</span>
              </div>
            </label>
          ))}
        </div>
      </section>
    </>
  );
}
