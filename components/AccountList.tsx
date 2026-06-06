"use client";

import { Account } from "@/lib/apyData";

interface AccountListProps {
  accounts: Account[];
}

export default function AccountList({ accounts }: AccountListProps) {
  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600">
        <h2 className="text-xl font-bold text-white">High-Yield Savings Accounts</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left font-semibold text-gray-700">Bank</th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700">Account</th>
              <th className="px-6 py-4 text-center font-semibold text-gray-700">Current APY</th>
              <th className="px-6 py-4 text-center font-semibold text-gray-700">5-Year Trend</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, index) => {
              // Trend over the last 5 years: APY as of ~5 years ago vs. current.
              const cutoff = new Date();
              cutoff.setFullYear(cutoff.getFullYear() - 5);
              const cutoffStr = cutoff.toISOString().split("T")[0];
              const priorRecords = account.history.filter((r) => r.date <= cutoffStr);
              const baseline =
                priorRecords[priorRecords.length - 1] ?? account.history[0];
              const firstAPY = baseline?.apy || 0;
              const lastAPY = account.currentAPY;
              const trend = lastAPY - firstAPY;
              const isPositive = trend >= 0;

              return (
                <tr
                  key={account.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: account.color }}
                      ></div>
                      <span className="font-medium text-gray-900">{account.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{account.provider}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold text-lg">
                      {account.currentAPY.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full font-semibold ${
                        isPositive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {isPositive ? "+" : ""}{trend.toFixed(2)} pts
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          💡 <strong>Tip:</strong> These rates update regularly. Compare trends to find the best account for your savings goals.
        </p>
      </div>
    </div>
  );
}
