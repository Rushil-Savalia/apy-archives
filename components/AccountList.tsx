"use client";

import { Account } from "@/lib/apyData";

interface AccountListProps {
  accounts: Account[];
}

export default function AccountList({ accounts }: AccountListProps) {
  return (
    <div className="w-full rounded-2xl bg-white dark:bg-gray-800 ring-1 ring-gray-900/5 dark:ring-white/10 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700/60">
        <div className="flex items-center gap-2.5">
          <span className="h-5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            High-Yield Savings Accounts
          </h2>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700/60 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <th className="px-6 py-3 text-left font-semibold">Bank</th>
              <th className="px-6 py-3 text-left font-semibold">Account</th>
              <th className="px-6 py-3 text-right font-semibold">Current APY</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
            {accounts.map((account) => (
              <tr
                key={account.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: account.color }}
                    />
                    <span className="font-medium text-gray-900 dark:text-gray-100">{account.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{account.provider}</td>
                <td className="px-6 py-4 text-right">
                  <span className="inline-block rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 ring-1 ring-emerald-600/10 dark:ring-emerald-400/20 px-3 py-1 font-bold text-base tabular-nums">
                    {account.currentAPY.toFixed(2)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 bg-gray-50/70 dark:bg-gray-900/30 border-t border-gray-100 dark:border-gray-700/60">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <strong className="font-semibold text-gray-700 dark:text-gray-300">Tip:</strong> These rates update regularly — compare trends to find the best account for your goals.
        </p>
      </div>
    </div>
  );
}
