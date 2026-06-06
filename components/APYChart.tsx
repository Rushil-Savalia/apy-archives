"use client";

import {
  Chart as ChartJS,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";
import { Account } from "@/lib/apyData";

ChartJS.register(
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface APYChartProps {
  accounts: Account[];
  /** How many years of history to show by default. */
  years?: number;
}

export default function APYChart({ accounts, years = 5 }: APYChartProps) {
  // Default x-window: the last `years` years up to today.
  const now = new Date();
  const windowStart = new Date(now);
  windowStart.setFullYear(windowStart.getFullYear() - years);

  // Full history is kept in each dataset; the axis min/max controls the view,
  // and stepped lines correctly hold each APY flat until the next change.
  const datasets = accounts.map((account) => ({
    label: account.name,
    data: account.history.map((record) => ({
      x: new Date(record.date).getTime(),
      y: record.apy,
    })),
    borderColor: account.color,
    backgroundColor: account.color + "20",
    stepped: true as const,
    borderWidth: 2,
    fill: false,
    pointRadius: 0,
    pointHoverRadius: 5,
    pointBackgroundColor: account.color,
  }));

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "nearest", intersect: false },
    plugins: {
      legend: {
        position: "top" as const,
        labels: { usePointStyle: true, padding: 15 },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        callbacks: {
          title: (items) =>
            new Date(Number(items[0].parsed.x)).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
          label: (ctx) => `${ctx.dataset.label}: ${Number(ctx.parsed.y).toFixed(2)}%`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grace: "10%",
        ticks: { callback: (value: any) => `${value}%` },
        title: { display: true, text: "APY (%)" },
      },
      x: {
        type: "time",
        min: windowStart.getTime(),
        max: now.getTime(),
        time: { unit: "year", tooltipFormat: "MMM d, yyyy" },
      },
    },
  };

  return (
    <div className="w-full h-full bg-white rounded-lg p-0 sm:p-2 flex items-center justify-center">
      <div className="w-full h-full relative">
        <Line data={{ datasets }} options={options} />
      </div>
    </div>
  );
}
