"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Account } from "@/lib/apyData";
import { useIsDark } from "@/lib/useTheme";

interface APYChartProps {
  accounts: Account[];
  /** How many years of history to show by default. */
  years?: number;
}

/** APY in effect on `dayMs` for a sorted-ascending history (null before it starts). */
function apyAsOf(history: { date: string; apy: number }[], dayMs: number): number | null {
  let val: number | null = null;
  for (const r of history) {
    if (new Date(r.date).getTime() <= dayMs) val = r.apy;
    else break;
  }
  return val;
}

export default function APYChart({ accounts, years = 5 }: APYChartProps) {
  const isDark = useIsDark();
  const gridColor = isDark ? "#374151" : "#e5e7eb";
  const axisColor = isDark ? "#9ca3af" : "#6b7280";
  const tooltipStyle = isDark
    ? { backgroundColor: "#1f2937", border: "1px solid #374151", color: "#f3f4f6" }
    : { backgroundColor: "#ffffff", border: "1px solid #e5e7eb", color: "#111827" };

  const now = new Date();
  const windowStart = new Date(now.getFullYear() - years, now.getMonth(), now.getDate());
  const minMs = windowStart.getTime();
  const maxMs = now.getTime();

  // Unified rows keyed by timestamp: every rate-change date across the selected
  // banks, plus "now". Each row carries every bank's APY in effect at that time,
  // so stepAfter lines render exact step changes.
  const times = new Set<number>([maxMs]);
  accounts.forEach((a) =>
    a.history.forEach((r) => times.add(new Date(r.date).getTime()))
  );
  const sortedTimes = Array.from(times).sort((x, y) => x - y);

  const data = sortedTimes.map((t) => {
    const row: Record<string, number | null> = { t };
    accounts.forEach((a) => {
      row[a.name] = apyAsOf(a.history, t);
    });
    return row;
  });

  // One tick at Jan 1 of each year within the visible window.
  const yearTicks: number[] = [];
  for (let y = windowStart.getFullYear(); y <= now.getFullYear(); y++) {
    const t = new Date(y, 0, 1).getTime();
    if (t >= minMs && t <= maxMs) yearTicks.push(t);
  }

  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg p-0 sm:p-2">
      {/* key on theme forces a clean remount so ResponsiveContainer re-measures
          instead of getting stuck at its -1 sentinel size after a re-render. */}
      <ResponsiveContainer key={isDark ? "dark" : "light"} width="100%" height="100%">
        <LineChart data={data} margin={{ top: 16, right: 24, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="t"
            type="number"
            scale="time"
            domain={[minMs, maxMs]}
            ticks={yearTicks}
            allowDataOverflow
            tickFormatter={(t) => String(new Date(t).getFullYear())}
            tick={{ fontSize: 12, fill: axisColor }}
            stroke={gridColor}
          />
          <YAxis
            domain={["auto", "auto"]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 12, fill: axisColor }}
            stroke={gridColor}
            width={48}
            label={{
              value: "APY (%)",
              angle: -90,
              position: "insideLeft",
              style: { fill: axisColor, fontSize: 12 },
            }}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={{ color: axisColor }}
            labelFormatter={(t) =>
              new Date(Number(t)).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            }
            formatter={(value: any, name: any) => [`${Number(value).toFixed(2)}%`, name]}
          />
          <Legend />
          {accounts.map((a) => (
            <Line
              key={a.id}
              type="stepAfter"
              dataKey={a.name}
              stroke={a.color}
              strokeWidth={2}
              dot={false}
              connectNulls={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
