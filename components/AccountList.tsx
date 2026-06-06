"use client";

import { Account } from "@/lib/apyData";

interface AccountListProps {
  accounts: Account[];
}

export default function AccountList({ accounts }: AccountListProps) {
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-900">
        <h2 className="text-xl font-bold text-white">High-Yield Savings Accounts</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Bank</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Account</th>
              <th className="px-6 py-4 text-center font-semibold text-gray-700 dark:text-gray-300">Current APY</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, index) => {
              return (
                <tr
                  key={account.id}
                  className={`border-b border-gray-100 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors ${
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-50 dark:bg-gray-800/60"
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: account.color }}
                      ></div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{account.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{account.provider}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 px-3 py-1 rounded-full font-bold text-lg">
                      {account.currentAPY.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          💡 <strong>Tip:</strong> These rates update regularly. Compare trends to find the best account for your savings goals.
        </p>
      </div>
    </div>
  );
}
